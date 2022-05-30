const { Router } = require("express");
const { tokenToCookie, deleteCookie } = require("../helpers/auth/tokenToCookie");
const Auth = require("../services/auth");

function auth(app) {
    const router = Router()
    app.use('/api/auth', router)

    const authService = new Auth()

    router.post('/login', async (req, res) => {
        const result = await authService.logIn(req.body)
        return tokenToCookie(res, result, 401)
    })

    router.post('/register', async (req, res) => {
        const result = await authService.register(req.body)
        return tokenToCookie(res, result, 401)
    })

    router.get('/logout', (req, res) => {
        return deleteCookie(res)
    })
}

module.exports = auth