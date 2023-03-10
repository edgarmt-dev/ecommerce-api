const CartModel = require("../models/cart");
const Payment = require("./payment");

class Cart {
  constructor() {
    this.paymentService = new Payment();
  }

  // eslint-disable-next-line class-methods-use-this
  async create(idUser) {
    try {
      const cart = await CartModel.create({
        idUser,
        items: [],
      });
      return cart;
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getItems(idUser) {
    try {
      const items = await CartModel.findOne({
        idUser: idUser,
      }).populate("items.product");
      return items;
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getOneCart(idUser) {
    const { items } = await CartModel.findOne({
      idUser: idUser,
    }).populate("items.product");

    return items;
  }

  async getProductInOneCart(idUser, idProduct) {
    try {
      const items = await this.getOneCart(idUser);
      if (items.length > 0) {
        const product = items.filter((item) => item.product.id === idProduct);
        if (product) {
          return {
            exists: true,
            product: product[0],
          };
        }
        return {
          exists: false,
        };
      }
      return {
        message: "No products",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async addToCart(idUser, idProduct, amount) {
    try {
      const { exists, product } = await this.getProductInOneCart(
        idUser,
        idProduct
      );
      if (exists) {
        const result = await this.increaseAmount(
          idUser,
          idProduct,
          amount,
          product
        );
        return {
          success: true,
          result,
        };
      }
      const result = await CartModel.findOneAndUpdate(
        {
          idUser,
        },
        {
          $push: {
            items: {
              product: idProduct,
              amount: 1,
            },
          },
        },
        {
          new: true,
        }
      ).populate("items.product");

      return {
        success: true,
        result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async increaseAmount(idUser, idProduct, amount, product) {
    try {
      const newAmount = product.amount + amount;
      const items = await this.getOneCart(idUser);
      const productsInCart = items.filter(
        (item) => item.product.id !== idProduct
      );

      const result = await CartModel.findOneAndUpdate(
        {
          idUser: idUser,
        },
        {
          items: [
            ...productsInCart,
            {
              product: idProduct,
              amount: !amount ? product.amount + 1 : newAmount,
            },
          ],
        },
        {
          new: true,
        }
      ).populate("items.product");

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async removeFromCart(idUser, idProduct) {
    try {
      const result = await CartModel.findOneAndUpdate(
        {
          idUser: idUser,
        },
        {
          $pull: {
            items: {
              product: idProduct,
            },
          },
        },
        {
          new: true,
        }
      ).populate("items.product");

      return {
        success: true,
        result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async pay(idUser, stripeCustomerID) {
    try {
      const { items } = await this.getItems(idUser);
      const total =
        items.reduce(
          (result, item) => result + item.product.price * item.amount,
          0
        ) * 100;

      if (total > 0) {
        const clientSecret = await this.paymentService.createIntent(
          total,
          idUser,
          stripeCustomerID
        );
        return {
          success: true,
          clientSecret,
        };
      }
      return {
        success: false,
        message: "Value invalid",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async clearOut(idUser) {
    try {
      const cart = await CartModel.findOneAndUpdate(
        {
          idUser: idUser,
        },
        {
          $pullAll: {
            items: [],
          },
        }
      );

      return {
        success: true,
        cart,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = Cart;
