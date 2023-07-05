const {
  Router
} = require('express')
const authValidation = require('../../middlewares/auth')
const BalanceController = require('../../controllers/admin/balance.controller')
const BalanceService = require('../../services/admin/balance.service')

// Router
const router = Router()

/**
 *
 * @param {Express.Application} app
 */
function balance(app) {
  app.use('/api/admin/balance', router)
  const balanceService = new BalanceService()
  const balanceCtrl = new BalanceController(balanceService)

  router.get('/', authValidation(10), balanceCtrl.getBalance)
}

module.exports = balance
