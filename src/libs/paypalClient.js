const paypal = require("@paypal/checkout-server-sdk")
const {
	production, paypalClientID, paypalClientSecret
} = require("../config")

const env = production ?
	new paypal.core.LiveEnvironment(paypalClientID, paypalClientSecret) :
	new paypal.core.SandboxEnvironment(paypalClientID, paypalClientSecret)

const client = new paypal.core.PayPalHttpClient(env)

module.exports = {
	client
}