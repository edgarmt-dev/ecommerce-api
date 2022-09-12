const duplicatedField = require("./duplicatedField")
const validationErrors = require("./validationErrors")

function hasErrors(error) {
	if (error.code === 11000) {
		return duplicatedField(error.keyValue)
	}
	return validationErrors(error)
}

module.exports = hasErrors
