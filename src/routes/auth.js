const { Router } = require("express");
const Auth = require("../services/auth");

function auth(app) {
    const router = Router()
    app.use('/api/auth', router)

    const authService = new Auth()

    router.post('/login', async (req, res) => {
        const result = await authService.logIn(req.body)
        return res
            .status(result.success ? 200 : 400)
            .json(result)
    })

    router.post('/register', async (req, res) => {
        const result = await authService.register(req.body)
        return res
            .status(result.code ? result.code : 200)
            .json(result)
    })
}

module.exports = auth