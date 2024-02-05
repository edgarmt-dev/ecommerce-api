const {
  Router
} = require('express')
const authValidation = require('../../middlewares/auth')
const ProductAdminService = require('../../services/admin/productAdmin.service')
const ProductAdminController = require('../../controllers/admin/productAdmin.controller')

// Router
const router = Router()

/**
   *
   * @param {Express.Application} app
   */
function productAdmin(app) {
  app.use('/api/admin/products', router)

  const productAdminService = new ProductAdminService()
  const productAdminController = new ProductAdminController(productAdminService)
  router.put('/update', authValidation(10), productAdminController.updateProduct)
}

module.exports = productAdmin
