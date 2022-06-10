const { mongoose: { Schema, model } } = require('../config/db')

const cartSchema = new Schema(
    {
        idUser: {
            ref: 'User',
            type: Schema.Types.ObjectId
        },
        items: [
            {
                product: {
                    ref: 'Product',
                    type: Schema.Types.ObjectId
                },
                amount: {
                    type: Number,
                    default: 1
                }
            }
        ]
    }
)

module.exports = model('Cart', cartSchema)