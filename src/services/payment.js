const { stripeSK } = require('../config')
const stripe = require('stripe')(stripeSK)

class Payment {
    async createIntent(amount) {
        const intent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd'
        })
        return intent.client_secret
    }
}

module.exports = Payment