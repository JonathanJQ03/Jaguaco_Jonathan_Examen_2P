class AccountController {
  constructor(financialService) {
    this.financialService = financialService;
  }

  getBalance = (req, res) => {
    try {
      const accountId = req.query.accountId;
      
      if (!accountId) {
        return res.status(400).json({
          error: 'Petición incorrecta',
          message: 'Debe proporcionar un parámetro accountId por query string (ej: ?accountId=ACC-12345).'
        });
      }

      const accountInfo = this.financialService.getAccountBalance(accountId);
      return res.status(200).json(accountInfo);
    } catch (error) {
      return res.status(404).json({
        error: 'Recurso no encontrado',
        message: error.message
      });
    }
  }
}

module.exports = AccountController;
