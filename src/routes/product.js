const { Router } = require("express");
const authValidation = require("../middlewares/auth");
const Product = require("../services/product");

function product(app) {
  const router = Router();
  app.use("/api/products", router);
  const productService = new Product();

  router.get("/", async (req, res) => {
    const { page, limit } = req.query;
    const numberPage = parseInt(page);
    const products = await productService.getAll(limit, numberPage);
    return res.json(products);
  });

  router.get("/category", (req, res) => {
    const name = req.query.name;
    const isAuthor = req.query.isAuthor;

    return res.json({
      name,
      isAuthor,
    });
  });

  router.get("/:id", async (req, res) => {
    const product = await productService.getOne(req.params.id);
    return res.json(product);
  });

  router.post("/", authValidation(1), async (req, res) => {
    const result = await productService.createProduct(req.body);
    return res.status(result.code ? result.code : 200).json(result);
  });

  router.post("/add-review", authValidation(1), async (req, res) => {
    console.log(req.body);
    const response = await productService.addReview(req.body);
    return res.status(response.code ? response.code : 200).json(response);
  });

  router.get("/pay/:idProduct", authValidation(1), async (req, res) => {
    const result = await productService.pay(
      req.user.id,
      req.user.stripeCustomerID,
      req.params.idProduct
    );
    return res.status(result.code ? result.code : 200).json(result);
  });
}

module.exports = product;
