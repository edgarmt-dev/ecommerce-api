function validationErrors({ errors }) {
    const keys = Object.keys(errors)
    const errorsData = keys.map(item => ({
        field: item,
        message: errors[item].message
    })) 

    return {
        success: false,
        errorsData
    }
}

module.exports = validationErrors