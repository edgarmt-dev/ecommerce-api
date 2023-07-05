const {
  Router
} = require('express')
const authValidation = require('../middlewares/auth')
const CartService = require('../services/cart.service')
const CartController = require('../controllers/cart.controller')

function cart(app) {
  const router = Router()
  app.use('/api/cart', router)
  const cartService = new CartService()
  const cartController = new CartController(cartService)

  router.get('/', authValidation(1), cartController.getAll)
  router.post('/add-item', authValidation(1), cartController.addItem)
  router.delete('/remove-item', authValidation(1), cartController.removeItem)
  router.put('/clear-out-cart', authValidation(1), cartController.clearCart)
  router.get('/pay', authValidation(1), cartController.payCart)
}

module.exports = cart
