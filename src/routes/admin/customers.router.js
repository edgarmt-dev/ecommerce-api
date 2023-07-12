const {
  Router
} = require('express')
const CustomerService = require('../../services/admin/customers.service')
const CustomerController = require('../../controllers/admin/customers.cotroller')

const router = Router()

/**
 *
 * @param {Express.Application} app
 */
function customers(app) {
  app.use('/api/admin/customers', router)

  const customerService = new CustomerService()
  const customerController = new CustomerController(customerService)

  router.get('/', customerController.getAllCustomers)
}

module.exports = customers
