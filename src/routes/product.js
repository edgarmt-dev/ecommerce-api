const { Router } = require("express");
const authValidation = require("../middlewares/auth");
const Product = require("../services/product");

function product(app) {
    const router = Router()
    app.use('/api/products', router)
    const productService = new Product()

    router.get('/', async (req, res) => {
        const products = await productService.getAll()
        return res.json(products)
    })

    router.get('/:id', async (req, res) => {
        const product = await productService.getOne(req.params.id)
        return res.json(product)
    })

    router.post('/', authValidation(10), async (req, res) => {
        const result = await productService.createProduct(req.body)
        return res.status(result.code ? result.code : 200).json(result)
    })
}

module.exports = product