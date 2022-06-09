const express = require('express')
const morgan = require('morgan')
const pkg = require('../package.json')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const passport = require('passport')
const { useGoogleStrategy, useFacebookStrategy, useGitHubStrategy } = require('./middlewares/authProvider')
const { jwtSecret } = require('./config')

const app = express()
app.set('pkg', pkg)

//Routes import
const auth = require('./routes/auth')
const user = require('./routes/user')
const product = require('./routes/product')
const cart = require('./routes/cart')

//Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser(jwtSecret))
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))
app.use(passport.initialize())

//Strategies Auth
passport.use(useGoogleStrategy())
passport.use(useFacebookStrategy())
passport.use(useGitHubStrategy())
passport.serializeUser((user, done) => {
    done(null, user)
})

//Routes
auth(app)
user(app)
product(app)
cart(app)

app.get('/', (req, res) => {
    const data = {
        name: app.get('pkg').name,
        version: app.get('pkg').version
    }
    return res.json(data)
})

module.exports = app