const hasErrors = require("../helpers/errors/hasErrors");
const UserModel = require("../models/user");

class User {

    async create(data) {
        try {
            const user = await UserModel.create(data)
            return {
                success: true,
                user
            }
        } catch (error) {
            return hasErrors(error)
        }
    }
}

module.exports = User