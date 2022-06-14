const { Router } = require("express");
const authValidation = require("../middlewares/auth");
const Cart = require("../services/cart");

function cart(app) {
    const router = Router()
    app.use('/api/cart', router)
    const cartService = new Cart()

    router.get('/', authValidation(1), async (req, res) => {
        const products = await cartService.getItems(req.user.id)
        return res.json(products)
    })

    router.post('/add-item', authValidation(1), async (req, res) => {
        const { idProduct, amount } = req.body
        const result = await cartService.addToCart(req.user.id, idProduct, amount)
        return res
            .status(result.success ? 200 : 400)
            .json(result)
    })

    router.delete('/remove-item', authValidation(1), async (req, res) => {
        const { idProduct } = req.body
        const result = await cartService.removeFromCart(req.user.id, idProduct)
        return res
            .status(result.success ? 200 : 400)
            .json(result)
    })

    router.get('/pay', authValidation(1), async(req, res) => {
        console.log(req.user.id);
        const result = await cartService.pay(req.user.id)
        console.log(result);
        return res.json(result)
    })

}

module.exports = cart