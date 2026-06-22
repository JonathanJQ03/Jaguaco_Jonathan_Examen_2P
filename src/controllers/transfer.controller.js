const Sentry = require('@sentry/node');

class TransferController {
  constructor(financialService) {
    this.financialService = financialService;
  }

  executeTransfer = (req, res, next) => {
    try {
      const { fromAccountId, toAccountId, amount, triggerError } = req.body;

      if (triggerError === true) {
        throw new Error("Conexión interrumpida con el Clúster de Datos SecurePay");
      }

      if (!fromAccountId || !toAccountId || amount === undefined) {
        return res.status(400).json({
          error: 'Petición incorrecta',
          message: 'Los campos fromAccountId, toAccountId y amount son requeridos en el cuerpo de la petición.'
        });
      }

      const result = this.financialService.executeTransfer(fromAccountId, toAccountId, Number(amount));
      return res.status(200).json(result);
    } catch (error) {
      if (error.message === "Conexión interrumpida con el Clúster de Datos SecurePay") {
        Sentry.captureException(error, {
          tags: {
            user_id: req.user ? req.user.sub : 'unknown'
          }
        });
        return next(error);
      }

      return res.status(400).json({
        error: 'Error en la transacción',
        message: error.message
      });
    }
  }
}

module.exports = TransferController;
