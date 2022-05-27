const duplicatedField = require("./duplicatedField")
const validationErrors = require("./validationErrors")

function hasErrors(error) {
    if (error.errors) {
        return validationErrors(error)
    }
    return duplicatedField(error)
}

module.exports = hasErrors