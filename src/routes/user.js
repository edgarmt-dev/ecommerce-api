const { Router } = require("express");
const authValidation = require("../middlewares/auth");
const User = require("../services/user");

function user(app) {
  const router = Router();
  app.use("/api/users", router);
  const userService = new User();

  router.get("/", authValidation(2), async (req, res) => {
    const result = await userService.getAll();
    return res.json(result);
  });
}

module.exports = user;
