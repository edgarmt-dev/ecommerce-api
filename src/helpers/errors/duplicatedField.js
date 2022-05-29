function duplicatedField(error) {
    const errors = Object.keys(error).map(field => ({
        [field]: `The ${field} ${error[field]} is already in use`
    }))
    return {
        success: false,
        errors,
        code: 400
    }
}

module.exports = duplicatedField