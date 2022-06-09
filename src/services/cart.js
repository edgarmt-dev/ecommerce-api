const CartModel = require("../models/cart");

class Cart {

    async create(idUser) {
        try {
            const cart = await CartModel.create({ idUser, items: [] })
            return cart
        } catch (error) {

        }
    }

    async getItems(idUser) {
        try {
            const items = await CartModel.findById(idUser)
            return items
        } catch (error) {

        }
    }

    async addToCart(idUser, idProduct, amount) {
        try {
            const result = await CartModel.findByIdAndUpdate(idUser, {
                $push: {
                    items: {
                        product: idProduct,
                        amount
                    }
                }
            }, { new: true })

            return result
        } catch (error) {
            console.log(error);
        }
    }

    async removeFromCart(idUser, idProduct) {
        try {
            const items = await CartModel.findById(idUser)
            return items
        } catch (error) {

        }
    }

    async addToCart(idUser, idProduct, amount) {
        try {
            const result = await CartModel.findByIdAndUpdate(idUser, {
                $pull: {
                    items: { product: idProduct, }
                }
            }, { new: true })

            return result
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = Cart