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

    async getOneCart(idUser) {
        const { items } = await CartModel.findOne({
            idUser: idUser,
        }).populate('items.product')

        return items
    }

    async getOneProductInOneCart(idUser, idProduct) {
        try {
            const items = await this.getOneCart(idUser)
            const product = items.filter(item => item.product.id === idProduct)
            if (product) return {
                exists: true,
                product: product[0]
            }
            return { exists: false }
        } catch (error) {
            console.log(error)
        }
    }

    async addToCart(idUser, idProduct, amount) {
        try {
            const { exists, product } = await this.getOneProductInOneCart(idUser, idProduct)
            if (exists) {
                const result = await this.increaseAmount(
                    idUser,
                    idProduct,
                    amount,
                    product
                )
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

    async increaseAmount(idUser, idProduct, amount, product) {
        try {
            const newAmount = product.amount + amount
            const items = await this.getOneCart(idUser)
            const productsInCart = items.filter(item => item.product.id !== idProduct)

            const result = await CartModel.findOneAndUpdate({
                idUser: idUser
            }, {
                items: [
                    ...productsInCart,
                    {
                        product: idProduct,
                        amount: !amount ? product.amount + 1 : newAmount
                    }
                ]
            }, {
                new: true
            }).populate('items.product')

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

    async pay(idUser, stripeCustomerID) {
        try {
            const { items } = await this.getItems(idUser)
            const total = items.reduce((result, item) => {
                return result + (item.product.price * item.amount)
            }, 0) * 100

            if (total > 0) {
                const clientSecret = await this.paymentService.createIntent(total, idUser, stripeCustomerID)
                return {
                    success: true,
                    clientSecret
                }
            }
            return {
                success: false,
                message: 'Value invalid'
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