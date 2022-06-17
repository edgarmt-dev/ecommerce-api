const hasErrors = require("../helpers/errors/hasErrors");
const UserModel = require("../models/user");
const { stripeSK } = require("../config");
const stripe = require('stripe')(stripeSK)
const Cart = require('../services/cart')
const uuid = require('uuid');

class User {

    constructor() {
        this.cartService = new Cart()
    }

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
        let stripeCustomerID
        try {
            const customer = await stripe.customers.create({
                name: data.name,
                email: data.email
            })
            stripeCustomerID = customer.id
            const user = await UserModel.create({ ...data, stripeCustomerID })
            await this.cartService.create(user._id)
            return {
                success: true,
                user
            }
        } catch (error) {
            const customer = await stripe.customers.del(stripeCustomerID)
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
        let stripeCustomerID
        try {
            const customer = await stripe.customers.create({
                name: data.name,
                email: data.email
            })
            stripeCustomerID = customer.id
            user = await UserModel.create({
                ...newData,
                stripeCustomerID
            })
            await this.cartService.create(user._id)
            return {
                success: true,
                user
            }
        } catch (error) {
            const customer = await stripe.customers.del(stripeCustomerID)
            if (error.code === 11000 &&
                error.keyValue.email
            ) {
                const result = await this.updateProviders(error.keyValue.email, data)
                if (result.success) return result
            }
            return hasErrors(error)
        }
    }

    async updateProviders(email, data) {
        const user = await UserModel.findOneAndUpdate({
            email: email
        }, {
            [`provider.${data.provider}`]: true,
            [`idProvider.${data.provider}`]: data.id
        }, {
            new: true,
        })

        return {
            success: true,
            user
        }
    }
}

module.exports = User