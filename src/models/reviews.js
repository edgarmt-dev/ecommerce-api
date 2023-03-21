const {
  mongoose: { Schema, model },
} = require("../config/db");

const reviewsSchema = new Schema({
  idUser: {
    ref: "User",
    type: Schema.Types.ObjectId,
  },
  idProduct: {
    ref: "Product",
    type: Schema.Types.ObjectId,
  },
  stars: {
    type: Number,
  },
  comment: {
    type: String,
    required: [true, "Price required"],
  },
});

module.exports = model("Review", reviewsSchema);
