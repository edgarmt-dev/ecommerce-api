const {
	Router
} = require("express")

function payments(app) {
	const router = Router()
	app.use("/api/payments", router)

	router.get("/cart", async (req, res) => {})
}

module.exports = payments
