const User = require('./user')

class Auth {

    constructor() {
        this.userService = new User()
    }

    async create(data) {
        try {
            const result = await this.userService.create(data)
            return result
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Auth