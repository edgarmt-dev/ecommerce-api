const { Router } = require('express')
const Payment = require('../../services/payment')

function webhooks(app) {
    const router = Router()

    app.use('/api/webhooks', router)
    const paymentService = new Payment()

    router.post('/stripe', async (req, res) => {
        const sig = req.headers['stripe-signature']
        const result = await paymentService.confirm(req.body, sig)

        console.log(result);

        return res.status(result.success ? 200 : 400).json(result)
    })
}

module.exports = webhooks