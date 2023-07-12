const {
  stripeSK
} = require('../../config')
const stripe = require('stripe')(stripeSK)

const date = new Date(new Date().setDate(new Date().getDate() - 90))

class CustomerService {
  async getAllCustomers() {
    try {
      const customers = await stripe.customers.list({
        limit: 100,
        created: {
          gt: date
        }
      })
      return {
        success: true,
        customers: customers.data,
        numberOfCustomers: customers.data?.length
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }
}

module.exports = CustomerService
