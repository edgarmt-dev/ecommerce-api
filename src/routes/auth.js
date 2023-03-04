const { Router } = require("express");
const {
  tokenToCookie,
  deleteCookie,
  tokenToCookieLocal,
} = require("../helpers/auth/tokenToCookie");
const Auth = require("../services/auth");
const passport = require("passport");
const authValidation = require("../middlewares/auth");

function auth(app) {
  const router = Router();
  app.use("/api/auth", router);
  const authService = new Auth();

  router.post("/login", async (req, res) => {
    const result = await authService.logIn(req.body);
    return tokenToCookieLocal(res, result, 401);
  });

  router.post("/register", async (req, res) => {
    const result = await authService.register(req.body);
    console.log(result);
    return tokenToCookieLocal(res, result, 401);
  });

  router.get("/validate", authValidation(1), (req, res) => {
    return res.json({
      success: true,
      user: req.user,
    });
  });

  router.get("/logout", (req, res) => {
    return deleteCookie(res);
  });

  router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["email", "profile"],
    })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/",
    }),
    async (req, res) => {
      const result = await authService.authWithProvider(req.user.profile);
      return tokenToCookie(res, result);
    }
  );

  router.get(
    "/facebook",
    passport.authenticate("facebook", {
      scope: ["email"],
    })
  );

  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
      session: false,
      failureRedirect: "/",
    }),
    async (req, res) => {
      const result = await authService.authWithProvider(req.user.profile);
      if (result.success) {
        return tokenToCookie(res, result);
      }
      return res.json(result);
    }
  );

  router.get(
    "/github",
    passport.authenticate("github", {
      scope: ["user:email"],
    })
  );

  router.get(
    "/github/callback",
    passport.authenticate("github", {
      failureRedirect: "/",
      session: false,
    }),
    async (req, res) => {
      const result = await authService.authWithProvider(req.user.profile);
      if (result.success) {
        return tokenToCookie(res, result);
      }
      return res.json(result);
    }
  );
}

module.exports = auth;
