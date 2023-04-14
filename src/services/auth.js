const User = require("./user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

class Auth {
  constructor() {
    this.userService = new User();
  }

  /**
   * Make a authentication process to some user by credentials(email, password)
   * @param {*} credentials
   * @returns
   */
  async logIn(credentials) {
    try {
      const { email, password } = credentials;
      const result = await this.userService.getOneByEmail(email);
      if (!result.user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      const compare = await this.#compare(password, result.user.password);

      if (!compare) {
        return {
          success: false,
          message: ["Invalid credentials"],
        };
      }
      const resp = this.#buildUserData(result.user);
      return resp;
    } catch (error) {
      return error;
    }
  }

  /**
   * Register a new user with request data from front app
   * @param {*} user
   * @returns
   */
  async register(data) {
    if (data && data.password) {
      data.password = await this.#encrypt(data.password);
    }
    data.provider = {
      local: true,
    };
    const result = await this.userService.create(data);

    if (!result.success) {
      return result;
    }
    return this.#buildUserData(result.user);
  }

  async authWithProvider(data) {
    const user = {
      id: data.id,
      provider: data.provider,
      profilePic: data.photos[0].value,
      email: data.emails[0].value,
      name: data.displayName,
    };
    const result = await this.userService.getOrCreateByProvider(user);
    if (result.success) {
      return this.#buildUserData(result);
    }
    return result;
  }

  /**
   * Build structure data to response
   * @param {*} user
   * @returns
   */
  #buildUserData(user) {
    const data = {
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      provider: user.provider,
      idProvider: user.idProvider,
      stripeCustomerID: user.stripeCustomerID,
      country: user.country,
    };
    return this.#getToken(data);
  }

  /**
   * Encrypt password to save in db
   * @param {string} password
   * @returns
   */
  async #encrypt(password) {
    const salt = await bcrypt.genSalt(10);
    const res = await bcrypt.hash(password, salt);
    return res;
  }

  /**
   * The function compare a encypt password with password from client
   * @param {string} password
   * @param {string} passwordEncrypt
   * @returns
   */
  async #compare(password, passwordEncrypt) {
    const res = await bcrypt.compare(password, passwordEncrypt);
    return res;
  }

  /**
   * Create a token to auth users
   * @param {*} user
   * @returns
   */
  #getToken(user) {
    const token = jwt.sign(user, jwtSecret, {
      expiresIn: "2d",
    });
    return {
      success: true,
      user,
      token,
    };
  }
}

module.exports = Auth;
