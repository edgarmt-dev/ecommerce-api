const app = require("./src/app")
const {
	port
} = require("./src/config")
const {
	connection
} = require("./src/config/db")

connection()

const PORT = port || 4000

app.listen(PORT, () => {
	console.log(`Listening on: http://localhost:${PORT}`)
})
