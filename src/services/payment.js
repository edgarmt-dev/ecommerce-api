const { stripeSK } = require('../config')
const UserModel = require('../models/user')
const CartModel = require('../models/cart')
const stripe = require('stripe')(stripeSK)
const endpointSecret = "whsec_a7f36c3228e31ba39014992c089fb1704d83bd3206b5757ac5b51679463c9fdb"

class Payment {
    async createIntent(amount, idUser, stripeCustomerID) {
        const intent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            customer: stripeCustomerID
        })
        return intent.client_secret
    }

    async confirmOne(data, signature) {
        let event
        try {
            event = stripe.webhooks.constructEvent(data, signature, endpointSecret)
        } catch (error) {
            return {
                success: false,
                message: `Webhook Error: ${error.message}`
            }
        }

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object
                const stripeCustomerID = paymentIntent.customer

                console.log('Listo')
    
                // Then define and call a function to handle the event payment_intent.succeeded
                break
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`)
        }

        return {
            success: true,
            message: 'OK'
        }
    }

    async confirm(data, signature) {
        let event
        try {
            event = stripe.webhooks.constructEvent(data, signature, endpointSecret)
        } catch (error) {
            return {
                success: false,
                message: `Webhook Error: ${error.message}`
            }
        }

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object
                const stripeCustomerID = paymentIntent.customer

                const user = await UserModel.findOneAndUpdate({ stripeCustomerID })
                console.log(user);

                await CartModel.findOneAndUpdate({ 
                    idUser: user.id 
                }, {
                    items: []
                }, { new: true })

                // Then define and call a function to handle the event payment_intent.succeeded
                break
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`)
        }

        return {
            success: true,
            message: 'OK'
        }
    }

    

}

module.exports = Payment