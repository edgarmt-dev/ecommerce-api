// const {
// 	stripeSK
// } = require("../config")
// const stripe = require("stripe")(stripeSK)
const hasErrors = require("../helpers/errors/hasErrors");
const pagination = require("../libs/pagination");
const ProductModel = require("../models/product");
const ReviewModel = require("../models/reviews");
const Cart = require("./cart.service");
const Payment = require("./payment.service");
const uploadFiles = require("../libs/uploadFiles");

class ProductService {
  constructor() {
    this.cartService = new Cart();
    this.paymentService = new Payment();
  }

  /**
   * Function that get all products
   * @param {number} limit
   * @param {number} page
   * @returns
   */
  async getAll(limit = 20, page = 1) {
    try {
      return await pagination(limit, page, ProductModel, "/api/products");
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  /**
   * Function that get products by category
   * @param {string} cat
   * @param {number} limit
   * @param {number} page
   * @returns
   */
  async getProductsByCategory(cat) {
    try {
      // return await pagination(limit, page, ProductModel, "/api/products");
      const response = await ProductModel.find({
        categories: cat,
      }).populate({
        path: "reviews",
        populate: [
          {
            path: "idUser",
            select: "name lastName country",
          },
        ],
      });
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        succes: false,
        error,
      };
    }
  }

  /**
   * Get a product by _id of mondgodb
   * @param {*} id
   * @returns
   */
  async getOne(id) {
    try {
      const product = await ProductModel.findOne({
        _id: id,
      }).populate({
        path: "reviews",
        populate: [
          {
            path: "idUser",
            select: "name lastName country",
          },
        ],
      });
      return {
        success: true,
        product,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  /**
   * The function create a new product in db
   * @param {Object} data
   * @param {File[]} files
   * @returns
   */
  async createProduct(data, files) {
    try {
      const { success, imagesURl } = await this.#uploadImages(files);

      if (!success) {
        throw new Error("Error", {
          error: "Images not uploaded",
        });
      }

      data.imgURL = imagesURl;
      data.categories = data.categories.split(",");
      const product = await ProductModel.create(data);
      return {
        success: true,
        product,
      };
    } catch (error) {
      return hasErrors(error);
    }
  }

  /**
   * Private service to run upload array images
   * @param {File} images
   * @returns
   */
  async #uploadImages(images) {
    try {
      const imagesURl = await Promise.all(
        images.map(async (image) => {
          const response = await uploadFiles(image.path);
          return response.url;
        }),
      );
      return {
        success: true,
        imagesURl,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  /**
   * The function add a new review to some product, and make relations with the models
   * @param {{ idUser, idProduct, stars, comment }} data
   * @returns
   */
  async addReview(data) {
    try {
      const response = await ReviewModel.create(data);
      const updateProduct = await this.addReviewToProductById(
        data.idProduct,
        response._id,
      );
      if (updateProduct.success) {
        return {
          success: true,
          response,
        };
      }
    } catch (error) {
      return hasErrors(error);
    }
  }
  /**
   * Make the relation of product model with reviews model
   * @param {*} idProduct
   * @param {*} idReview
   * @returns
   */
  async addReviewToProductById(idProduct, idReview) {
    try {
      const response = await ProductModel.findOneAndUpdate(
        {
          _id: idProduct,
        },
        {
          $push: {
            reviews: idReview,
          },
        },
      );

      return {
        success: true,
        response,
      };
    } catch (error) {
      return hasErrors(error);
    }
  }

  /**
   * Function to pay products
   * @param {*} idUser
   * @param {*} stripeCustomerID
   * @param {*} idProduct
   * @returns
   */
  async pay(idUser, stripeCustomerID, idProduct) {
    try {
      const { product } = await this.getOne(idProduct);
      const price = product.price;

      if (price > 0) {
        const clientSecret = await this.paymentService.createIntent(
          price,
          idUser,
          stripeCustomerID,
        );
        return {
          success: true,
          clientSecret,
        };
      }

      return {
        success: false,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = ProductService;
