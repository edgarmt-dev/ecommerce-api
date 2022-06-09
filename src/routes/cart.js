const { Router } = require("express");
const authValidation = require("../middlewares/auth");
const Cart = require("../services/cart");

function cart(app) {
    const router = Router()
    app.use('/api/cart', router)
    const cartService = new Cart()

    router.get('/', async (req, res) => {
        return res.json({Hola:'mundo'})
    })

}

module.exports = cart