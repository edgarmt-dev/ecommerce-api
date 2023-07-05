class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  getAll = async (req, res) => {
    const response = await this.cartService.getItems(req.user.id);
    return this.returnResponse(res, response);
  };

  addItem = async (req, res) => {
    const { idProduct, amount } = req.body;
    const response = await this.cartService.addToCart(
      req.user.id,
      idProduct,
      amount,
    );
    return this.returnResponse(res, response);
  };

  removeItem = async (req, res) => {
    const { idProduct } = req.body;
    const response = await this.cartService.removeFromCart(
      req.user.id,
      idProduct,
    );
    return this.returnResponse(res, response);
  };

  clearCart = async (req, res) => {
    const { id } = req.user;
    const response = await this.cartService.clearOut(id);
    return this.returnResponse(res, response);
  };

  payCart = async (req, res) => {
    const response = await this.cartService.pay(
      req.user.id,
      req.user.stripeCustomerID,
    );
    return this.returnResponse(res, response);
  };

  returnResponse = (res, response) =>
    res.status(response.success ? 200 : 401).json(response);
}

module.exports = CartController;
