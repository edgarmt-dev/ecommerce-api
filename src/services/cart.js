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
            const items = await CartModel.findOne({ idUser: idUser }).populate('items._id')
            return items
        } catch (error) {

        }
    }

    async addToCart(idUser, idProduct, amount) {
        try {
            const result = await CartModel.findOneAndUpdate({ idUser: idUser }, {
                $push: {
                    items: {
                        _id: idProduct,
                        amount
                    }
                }
            }, { new: true }).populate('items._id')

            return { succes: true, result }
        } catch (error) {
            console.log(error);
        }
    }

    async removeFromCart(idUser, idProduct, amount) {
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