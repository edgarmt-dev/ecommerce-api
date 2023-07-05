const { stripeSK } = require("../../config");
const stripe = require("stripe")(stripeSK);

class BalanceService {
  async getBalance() {
    try {
      const balance = await stripe.balance.retrieve();
      return {
        success: true,
        balance,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
}

module.exports = BalanceService;
