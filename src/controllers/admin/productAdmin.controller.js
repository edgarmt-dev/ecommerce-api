class ProductAdminController {
  #productAdminService = null
  constructor(productAdminService) {
    this.#productAdminService = productAdminService
  }

  updateProduct = async (req, res) => {
    const response = await this.#productAdminService.updateProduct(req?.body)
    return res.status(response.success ? 200 : 400).json(response)
  }
}

module.exports = ProductAdminController