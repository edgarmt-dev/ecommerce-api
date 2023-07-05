class BalanceController {
  #balanceService = null;
  constructor(balanceService) {
    this.#balanceService = balanceService;
  }

  getBalance = async (req, res) => {
    const response = await this.#balanceService.getBalance();
    return res.status(response.success ? 200 : 400).json(response);
  };
}

module.exports = BalanceController;
