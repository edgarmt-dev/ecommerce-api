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
            return result
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
        const providerData = {
            idProvider: {
                [data.provider]: data.id
            },
            provider: {
                [data.provider]: true
            }
        }
        let user = await UserModel.findOne(providerData)
        if (user) return { success: true, user }

        data.password = uuid.v4()
        const newData = { ...data, ...providerData }

        try {
            user = await UserModel.create(newData)
            return {
                success: true,
                user
            }
        } catch (error) {
            if (error.code === 11000 && error.keyValue.email) {
                const result = await this.updateProviders(error.keyValue.email, data)
                if (result.success) return result
            }
            return hasErrors(error)
        }
    }

    async updateProviders(email, data) {
        const provider = 'provider.' + data.provider
        const idProvider = 'idProvider.' + data.provider
        const user = await UserModel.findOneAndUpdate({
            email: email
        }, {
            [provider]: true,
            [idProvider]: data.id
        }, {
            new: true,
            returnOriginal: false 
        })

        return {
            success: true,
            user
        }
    }
}

module.exports = User