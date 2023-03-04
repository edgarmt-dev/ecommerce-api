const hasErrors = require("../helpers/errors/hasErrors");
const UserModel = require("../models/user");
const { stripeSK } = require("../config");
const stripe = require("stripe")(stripeSK);
const Cart = require("../services/cart");
const uuid = require("uuid");

class User {
  constructor() {
    this.cartService = new Cart();
  }

  // eslint-disable-next-line class-methods-use-this
  async getAll() {
    try {
      const users = await UserModel.find();
      return {
        success: true,
        users,
      };
    } catch (error) {
      return error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getOneByEmail(email) {
    try {
      const user = await UserModel.findOne({
        email: email,
      });
      return {
        success: true,
        user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async create(data) {
    let stripeCustomerID;
    try {
      const customer = await stripe.customers.create({
        name: data.name,
        email: data.email,
      });
      stripeCustomerID = customer.id;
      const user = await UserModel.create({
        ...data,
        stripeCustomerID,
      });
      await this.cartService.create(user._id);
      console.log("USER", user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      // const customer = await stripe.customers.del(stripeCustomerID)
      return hasErrors(error);
    }
  }

  async getOrCreateByProvider(data) {
    const providerData = {
      idProvider: {
        [data.provider]: data.id,
      },
      provider: {
        [data.provider]: true,
      },
    };
    let user = await UserModel.findOne(providerData);

    if (user) {
      return {
        success: true,
        user,
      };
    }

    data.password = uuid.v4();
    const newData = {
      ...data,
      ...providerData,
    };
    let stripeCustomerID;
    try {
      const customer = await stripe.customers.create({
        name: data.name,
        email: data.email,
      });
      stripeCustomerID = customer.id;
      user = await UserModel.create({
        ...newData,
        stripeCustomerID,
      });
      await this.cartService.create(user._id);
      return {
        success: true,
        user,
      };
    } catch (error) {
      // const customer = await stripe.customers.del(stripeCustomerID)
      if (error.code === 11000 && error.keyValue.email) {
        const result = await this.updateProviders(error.keyValue.email, data);
        if (result.success) {
          return result;
        }
      }
      return hasErrors(error);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async updateProviders(email, data) {
    const user = await UserModel.findOneAndUpdate(
      {
        email: email,
      },
      {
        [`provider.${data.provider}`]: true,
        [`idProvider.${data.provider}`]: data.id,
      },
      {
        new: true,
      }
    );

    return {
      success: true,
      user,
    };
  }
}

module.exports = User;
