const {
  mongoose: {
    Schema, model
  },
} = require('../config/db')

const reviewsSchema = new Schema({
  idUser: {
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
  stars: {
    type: Number,
  },
  title: {
    type: String,
    required: [
      true, 'Title required'
    ],
  },
  comment: {
    type: String,
    required: [
      true, 'Comment required'
    ],
  },
  date: {
    type: Schema.Types.Date,
    default: new Date(),
  },
})

module.exports = model('Review', reviewsSchema)
