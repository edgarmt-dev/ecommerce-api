const express = require('express')
const morgan = require('morgan')
const pkg = require('../package.json')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const passport = require('passport')
const { useGoogleStrategy } = require('./middlewares/authProvider')

const app = express()
app.set('pkg', pkg)

//Routes import
const auth = require('./routes/auth')
const user = require('./routes/user')
const { jwtSecret } = require('./config')

//Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser(jwtSecret))
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))
app.use(passport.initialize())
passport.use(useGoogleStrategy())
passport.serializeUser((user, done) => {
    done(null, user)
})

//Routes
auth(app)
user(app)

app.get('/', (req, res) => {
    const data = {
        name: app.get('pkg').name,
        version: app.get('pkg').version
    }
    return res.json(data)
})

module.exports = app