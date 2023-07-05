const {
  Router
} = require('express')
const passport = require('passport')
const authValidation = require('../middlewares/auth')
const AuthService = require('../services/auth.service')
const AuthController = require('../controllers/auth.controller')

function auth(app) {
  const router = Router()
  app.use('/api/auth', router)
  const authService = new AuthService()
  const authController = new AuthController(authService)

  router.post('/login', authController.login)
  router.post('/register', authController.register)
  router.get('/auth-cookies', authController.getCookies)
  router.get('/validate', authValidation(1), authController.validate)
  router.get('/logout', authController.logout)

  router.get(
    '/google',
    passport.authenticate('google', {
      scope: [
        'email', 'profile'
      ],
    }),
  )
  router.get(
    '/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: '/',
    }),
    authController.loginWhitProvider,
  )

  router.get(
    '/facebook',
    passport.authenticate('facebook', {
      scope: [
        'email'
      ],
    }),
  )
  router.get(
    '/facebook/callback',
    passport.authenticate('facebook', {
      session: false,
      failureRedirect: '/',
    }),
    authController.loginWhitProvider,
  )

  router.get(
    '/github',
    passport.authenticate('github', {
      scope: [
        'user:email'
      ],
    }),
  )
  router.get(
    '/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/',
      session: false,
    }),
    authController.loginWhitProvider,
  )
}

module.exports = auth
