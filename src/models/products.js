const { mongoose: { Schema, model } } = require('../config/db')

const productsSchema = new Schema(
    {
        name: String,
        description: String,
        imgURL:String,
        price:String
    }
)

module.exports = model('Product', productsSchema)