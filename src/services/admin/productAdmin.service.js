const ProductService = require('../product.service')

class ProductAdminService {

  constructor() {
    this.product = new ProductService()
  }

  async updateProduct(data) {
    try {
      const result = await this.product.updateProduct(data)
      return result
    } catch (error) {
      return error
    }
  }
}

module.exports = ProductAdminService