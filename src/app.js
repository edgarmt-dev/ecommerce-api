const express = require('express')
const morgan = require('morgan')
const pkg = require('../package.json')

const app = express()
app.set('pkg', pkg)

//Routes import
const auth = require('./routes/auth')

//Middlewares
app.use(morgan('dev'))
app.use(express.json())

//Routes
auth(app)

app.get('/', (req, res) => {
    const data = {
        name: app.get('pkg').name,
        version: app.get('pkg').version
    }
    return res.json(data)
})

module.exports = app