const CartModel = require("../models/cart");
const Payment = require("./payment");

class Cart {

    constructor() {
        this.paymentService = new Payment()
    }

    async create(idUser) {
        try {
            const cart = await CartModel.create({
                idUser,
                items: []
            })
            return cart
        } catch (error) {

        }
    }

    async getItems(idUser) {
        try {
            const items = await CartModel.findOne({
                idUser: idUser
            }).populate('items.product')
            return items
        } catch (error) {

        }
    }

    async getOne(idUser, idProduct) {
        try {
            const product = await CartModel.findOne({
                idUser: idUser,
                ['items.product']: idProduct
            })
            if (product) return { exists: true, product: product.items }
            return { exists: false }
        } catch (error) {
            console.log(error)
        }
    }

    async addToCart(idUser, idProduct, amount) {
        try {
            const productExists = await this.getOne(idUser, idProduct)
            if (productExists.exists) {
                const result = await this.increaseAmount(idUser, idProduct, amount)
                return { success: true, result }
            }
            const result = await CartModel.findOneAndUpdate({
                idUser: idUser
            }, {
                $push: {
                    items: {
                        product: idProduct,
                        amount
                    }
                }
            }, { new: true }).populate('items.product')

            return { success: true, result }
        } catch (error) {
            console.log(error);
        }
    }

    async increaseAmount(idUser, idProduct, amount) {
        try {
            const { product } = await this.getOne(idUser, idProduct)
            const newAmount = product[0].amount + amount

            const result = await CartModel.findOneAndUpdate({
                idUser: idUser,
                ['items.product']: idProduct
            }, {
                items: [...product.items, { product: idProduct, amount: !amount ? product[0].amount + 1 : newAmount }]
            }, { new: true }).populate('items.product')

            return result
        } catch (error) {
            console.log(error);
        }
    }

    async removeFromCart(idUser, idProduct) {
        try {
            const result = await CartModel.findOneAndUpdate({
                idUser: idUser
            }, {
                $pull: {
                    items: {
                        product: idProduct,
                    }
                }
            }, { new: true }).populate('items.product')

            return { success: true, result }
        } catch (error) {
            console.log(error);
        }
    }

    async pay(idUser) {
        try {
            const { items } = await this.getItems(idUser)
            const total = items.reduce((result, item) => {
                return result + (item.product.price * item.amount)
            }, 0)
            const clientSecret = await this.paymentService.createIntent(total * 100)
            return {
                success: true,
                clientSecret
            }
        } catch (error) {
            console.log(error);
        }
    }

    async clearOut(idUser) {
        try {
            const cart = await CartModel.findOneAndUpdate({
                idUser: idUser
            }, {
                $pullAll: { items: [] }
            })

            return { success: true, cart }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Cart