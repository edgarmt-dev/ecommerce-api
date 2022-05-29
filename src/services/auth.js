const User = require('./user')
const bcrypt = require('bcrypt')
const res = require('express/lib/response')

class Auth {

    constructor() {
        this.userService = new User()
    }

    async #encrypt(password) {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }

    async #comparePassword(password, passwordEncrypt) {
        return await bcrypt.compare(password, passwordEncrypt)
    }

    async logIn(credentials) {
        try {
            const { email, password } = credentials
            const user = await this.userService.getOneByEmail(email)
            if (!user) return {
                success: false,
                messsage: 'User not found'
            }

            const compare = await this.#comparePassword(password, user.password)

            if (!compare) return {
                success: false,
                message: 'Invalid credentials'
            }
            return { success: true, user }
        } catch (error) {
            console.log(error);
        }
    }

    async register(data) {
        try {
            if (data && data.password) {
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