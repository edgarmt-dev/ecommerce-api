const { Router } = require("express");
const authValidation = require("../middlewares/auth");
const ProductService = require("../services/product.service");
const ProductController = require("../controllers/product.controller");
const upload = require("../libs/multer");
const uploadFiles = require("../libs/uploadFiles");

function product(app) {
  const router = Router();
  const productService = new ProductService();
  const productController = new ProductController(productService);

  app.use("/api/products", router);

  router.get("/", productController.getAll);
  router.get("/:id", productController.getOneById);
  router.get("/categories/type", productController.getByCategory);
  router.post("/create", authValidation(10), productController.create);
  router.post("/add-review", authValidation(1), productController.addReview);
  router.get(
    "/pay/:idProduct",
    authValidation(1),
    productController.payProduct
  );

  router.post("/files", upload.single("img"), async (req, res) => {
    const { file } = req;
    console.log(file);
    const response = await uploadFiles(file.path);

    return res.json({ status: "Ready", response });
  });
}

module.exports = product;
