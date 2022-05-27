const { Router } = require("express");
const Auth = require("../services/auth");

function auth(app) {
    const router = Router()
    app.use('/api/auth', router)

    const authService = new Auth()

    router.post('/register', async (req, res) => {
        const result = await authService.create(req.body)
        res.json(result)
    })
}

module.exports = auth