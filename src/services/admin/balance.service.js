const {
  stripeSK
} = require('../../config')
const stripe = require('stripe')(stripeSK)

class BalanceService {
  async getBalance() {
    try {
      const balance = await stripe.balance.retrieve()
      return {
        success: true,
        balance: balance.available[0],
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }
}

module.exports = BalanceService
