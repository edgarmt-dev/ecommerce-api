const { mongoose } = require("../config/db");

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name required"],
  },
  description: String,
  imgURL: {
    type: [String],
    required: [true, "Image required"],
  },
  price: {
    type: mongoose.Types.Decimal128,
    required: [true, "Price required"],
  },
  categories: {
    type: [String],
    enum: [
      "Tools",
      "Boards",
      "Leds",
      "Integrated",
      "Accesories",
      "Cables",
      "Adapters",
      "Network",
      "Resistences",
      "Default",
    ],
    default: "Global",
  },
  amount: {
    type: Number,
    default: 1,
  },
  reviews: [{ ref: "Review", type: mongoose.Types.ObjectId }],
});

module.exports = mongoose.model("Product", productsSchema);
