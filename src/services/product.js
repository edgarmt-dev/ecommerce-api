const { stripeSK } = require('../config')
const hasErrors = require('../helpers/errors/hasErrors')
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
            const total = await ProductModel.count()
            const totalPages = Math.ceil(total / limit)

            if (page > totalPages || page === 0) return {
                success: false,
                message: 'Page not found'
            }

            const skip = (page - 1) * limit
            const products = await ProductModel.find().skip(skip).limit(limit)

            const nextPage = totalPages < 2 ? null : `/api/products?${(page + 1)}`
            const prevPage = page - 1 != 0 ? `/api/products?${(page - 1)}` : null

            return {
                success: true,
                products,
                totalProducts: total,
                totalPages,
                prevPage,
                nextPage
            }
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