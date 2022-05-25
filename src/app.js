const express = require('express')
const morgan = require('morgan')
const pkg = require('../package.json')

const app = express()
app.set('pkg', pkg)

//TODO:Routes import

//Middlewares
app.use(morgan('dev'))
app.use(express.json())

// TODO:Routes

app.get('/', (req, res) => {
    const data = {
        name: app.get('pkg').name,
        version: app.get('pkg').version
    }
    return res.json(data)
})

module.exports = app