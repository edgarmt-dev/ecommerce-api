const {
	mongoose: {
		Schema, model
	}
} = require("../config/db")

const productsSchema = new Schema(
	{
		name: {
			type: String,
			required: [
				true, "Name required"
			]
		},
		description: String,
		imgURL: {
			type: [
				String
			],
			required: [
				true, "Image required"
			]
		},
		price: {
			type: String,
			required: [
				true, "Price required"
			]
		},
		categories: {
			type: String,
			enum: [
				"Audio", "Computation", "Electronic", "Security", "Tools", "Cables", "Phones", "Global"
			],
			default: "Global"
		},
		amount: {
			type: Number,
			default: 1
		}
	}
)

module.exports = model("Product", productsSchema)