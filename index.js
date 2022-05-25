const app = require("./src/app");
const { port } = require("./src/config");
const { connection } = require("./src/config/db");

connection()

app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
})