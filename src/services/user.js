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

    async getOrCreateByProvider(data) {
        let user = await UserModel.findOne({
            idProvider: {
                [data.provider]: data.id
            },
            provider: {
                [data.provider]: true
            }
        })

        console.log();

        if (user) return { success: true, user }

        data.password = uuid.v4()

        const newData = {
            ...data,
            idProvider: { [data.provider]: data.id },
            provider: { [data.provider]: true, }
        }

        try {
            user = await UserModel.create(newData)
            return {
                success: true,
                user
            }
        } catch (error) {
            if (error.code === 11000 && error.keyValue.email) {
                const provider = 'provider.' + data.provider
                const idProvider = 'idProvider.' + data.provider
                user = await UserModel.findOneAndUpdate({
                    email: error.keyValue.email
                }, {
                    [provider]: true,
                    [idProvider]: data.id
                }, { new: true, returnOriginal: false })
                return {
                    success: true,
                    user
                }
            }
            return hasErrors(error)
        }
    }
}

module.exports = User