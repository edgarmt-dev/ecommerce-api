class CustomerController {
  #customerService = null
  constructor(customerService) {
    this.#customerService = customerService
  }

  getAllCustomers = async (req, res) => {
    const response = await this.#customerService.getAllCustomers()
    return res.status(response.success ? 200 : 400).json(response)
  }
}

module.exports = CustomerController