const User = require('./user')
const bcrypt = require('bcrypt')

class Auth {

    constructor() {
        this.userService = new User()
    }

    async #encrypt(password) {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }

    async create(data) {
        try {
            if(data && data.password) {
                data.password = await this.#encrypt(data.password)
            }
            const result = await this.userService.create(data)
            return result
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Auth