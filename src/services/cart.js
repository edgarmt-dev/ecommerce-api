const CartModel = require("../models/cart");

class Cart {

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
            }).populate('items._id')
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
                    items: { product: idProduct, }
                }
            }, { new: true }).populate('items.product')

            return {
                success: true,
                result
            }
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = Cart