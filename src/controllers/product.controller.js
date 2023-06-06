class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  getAll = async (req, res) => {
    const { limit, page } = req.query;
    const numberPage = parseInt(page);
    const response = await this.productService.getAll(limit, numberPage);
    return this.returnResponse(res, response);
  };

  getOneById = async (req, res) => {
    const response = await this.productService.getOne(req.params.id);
    return this.returnResponse(res, response);
  };

  getByCategory = async (req, res) => {
    const { cat } = req.query;
    const response = await this.productService.getProductsByCategory(cat);
    return this.returnResponse(res, response);
  };

  create = async (req, res) => {
    console.log(req.body);
    const response = await this.productService.createProduct(req.body);
    console.log(response);
    return this.returnResponse(res, response);
  };

  addReview = async (req, res) => {
    const response = await this.productService.addReview(req.body);
    return this.returnResponse(res, response);
  };

  payProduct = async (req, res) => {
    const result = await this.productService.pay(
      req.user.id,
      req.user.stripeCustomerID,
      req.params.idProduct
    );
    return res.status(result.code ? result.code : 200).json(result);
  };

  returnResponse = (res, response) =>
    res.status(response.success ? 200 : 401).json(response);
}

module.exports = ProductController;
