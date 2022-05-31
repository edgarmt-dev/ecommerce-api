const { Router } = require("express");
const { tokenToCookie, deleteCookie } = require("../helpers/auth/tokenToCookie");
const Auth = require("../services/auth");
const passport = require('passport')

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

    router.get('/google', passport.authenticate('google', {
        scope: ['email', 'profile']
    }))

    router.get('/google/callback', passport.authenticate('google', {
        session: false,
        failureRedirect: '/'
    }),
        async (req, res) => {
            const result = await authService.authProvider(req.user.profile)
            return tokenToCookie(res, result)
        })
}

module.exports = auth