const { Router } = require("express");
const authValidation = require("../middlewares/auth");
const ProductService = require("../services/product.service");
const ProductController = require("../controllers/product.controller");

function product(app) {
  const router = Router();
  app.use("/api/products", router);
  const productService = new ProductService();
  const productController = new ProductController(productService);

  router.get("/", productController.getAll);
  router.get("/:id", productController.getOneById);
  router.get("/category", productController.getByCategory);
  router.post("/create", authValidation(1), productController.create);
  router.post("/add-review", authValidation(1), productController.addReview);
  router.get(
    "/pay/:idProduct",
    authValidation(1),
    productController.payProduct
  );
}

module.exports = product;
