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

    async addToCart(idUser, idProduct, amount) {
        try {
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
            console.log(items)
            const total = items.reduce((result, item) => {
                return result + (item.product.price * item.amount)
            }, 0)
            const clientSecret = await this.paymentService.createIntent(total*100)
            console.log(clientSecret);
            return { success: true, clientSecret }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Cart