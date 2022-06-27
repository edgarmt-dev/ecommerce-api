const { stripeSK } = require('../config')
const hasErrors = require('../helpers/errors/hasErrors')
const pagination = require('../libs/pagination')
const ProductModel = require('../models/product')
const Cart = require('./cart')
const Payment = require('./payment')
const stripe = require('stripe')(stripeSK)

class Product {

    constructor() {
        this.cartService = new Cart()
        this.paymentService = new Payment()
    }

    async getAll(limit = 20, page = 1) {
        try {
           return await pagination(limit, page, ProductModel)
        } catch (error) {
            return {
                success: false,
                error
            }
        }
    }

    async getOne(id) {
        try {
            const product = await ProductModel.findOne({ _id: id })
            return {
                success: true,
                product
            }
        } catch (error) {
            return { success: false, error }
        }
    }

    async createProduct(data) {
        try {
            const product = await ProductModel.create(data)
            return {
                succes: true,
                product
            }
        } catch (error) {
            return hasErrors(error)
        }
    }

    async pay(idUser, stripeCustomerID, idProduct) {
        try {
            const { product } = await this.getOne(idProduct)
            const price = product.price

            if (price > 0) {
                const clientSecret = await this.paymentService.createIntent(
                    price,
                    idUser,
                    stripeCustomerID
                )
                return {
                    success: true,
                    clientSecret
                }
            }

            return { success: false }
        } catch (error) {

        }
    }
}

module.exports = Product