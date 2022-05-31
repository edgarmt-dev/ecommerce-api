const hasErrors = require('../helpers/errors/hasErrors')
const ProductModel = require('../models/product')

class Product {

    async getAll() {
        try {
            const products = await ProductModel.find()
            return { success: true, products }
        } catch (error) {
            return { success: false, error }
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

}

module.exports = Product