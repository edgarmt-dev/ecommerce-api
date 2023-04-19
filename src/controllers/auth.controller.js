const {
  tokenToCookie,
  tokenToCookieLocal,
  deleteCookie,
} = require("../helpers/auth/tokenToCookie");

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login = async (req, res) => {
    const response = await this.authService.logIn(req.body);
    return tokenToCookieLocal(res, response, 401);
  };

  register = async (req, res) => {
    const response = await this.authService.register(req.body);
    return tokenToCookieLocal(res, response, 401);
  };

  validate = (req, res) => {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  };

  logout = async (req, res) => deleteCookie(res);

  loginWhitProvider = async (req, res) => {
    const response = await this.authService.authWithProvider(req.user.profile);
    if (response.success) {
      return tokenToCookie(res, response);
    }
    return res.json(response);
  };
}

module.exports = AuthController;
