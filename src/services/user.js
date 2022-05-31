const hasErrors = require("../helpers/errors/hasErrors");
const UserModel = require("../models/user");
const uuid = require('uuid')

class User {

    async getAll() {
        try {
            return await UserModel.find()
        } catch (error) {
            return error
        }
    }

    async getOneByEmail(email) {
        try {
            const result = await UserModel.findOne({ email: email })
            return result
        } catch (error) {
            console.log(result);
        }
    }

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

    async getOrCreate(data) {
        try {
            const user = await UserModel.findOne({ 
                idProvider: data.idProvider, 
                provider: data.provider 
            })
            if (user) return {success:true, user}

            data.password = uuid.v4()
            const result = await UserModel.create(data)
            return  {
                success: true,
                user: result
            }
        } catch (error) {
            return hasErrors(error)
        }
    }
}

module.exports = User