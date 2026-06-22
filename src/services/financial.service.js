class FinancialService {
  constructor(databaseService, notificationService) {
    this.db = databaseService;
    this.notifier = notificationService;
  }

  getAccountBalance(accountId) {
    const account = this.db.getAccount(accountId);
    if (!account) {
      throw new Error(`La cuenta '${accountId}' no existe.`);
    }
    return {
      accountId: account.accountAlpha,
      email: account.email,
      balance: account.balance
    };
  }

  executeTransfer(fromAccountId, toAccountId, amount) {
    const sender = this.db.getAccount(fromAccountId);
    if (!sender) {
      throw new Error(`Error de validación: La cuenta origen '${fromAccountId}' no existe en la base de datos.`);
    }

    const receiver = this.db.getAccount(toAccountId);
    if (!receiver) {
      throw new Error(`Error de validación: La cuenta destino '${toAccountId}' no existe en la base de datos.`);
    }

    if (amount <= 0) {
      throw new Error('Error de validación: El monto a transferir debe ser mayor a cero.');
    }

    if (sender.balance < amount) {
      throw new Error(`Saldo insuficiente: La cuenta '${fromAccountId}' tiene $${sender.balance}, requiere $${amount}.`);
    }

    this.db.updateBalance(fromAccountId, -amount);
    this.db.updateBalance(toAccountId, amount);

    const newTransaction = {
      transactionId: `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      from: fromAccountId,
      to: toAccountId,
      amount: amount,
      status: 'COMPLETED',
      timestamp: new Date().toISOString()
    };
    this.db.saveTransaction(newTransaction);

    this.notifier.sendEmail(
      sender.email,
      `Débito por Transferencia Realizada - Fintech SecurePay`,
      `Estimado usuario, se ha debitado de su cuenta ${fromAccountId} el valor de $${amount}.\nSu nuevo saldo disponible es: $${sender.balance}.`
    );

    this.notifier.sendEmail(
      receiver.email,
      `Crédito por Transferencia Recibida - Fintech SecurePay`,
      `Estimado usuario, ha recibido una transferencia de $${amount} de la cuenta ${fromAccountId}.\nSu nuevo saldo disponible es: $${receiver.balance}.`
    );

    return {
      success: true,
      message: 'Transferencia ejecutada con éxito',
      transaction: newTransaction,
      balanceRestante: sender.balance
    };
  }
}

module.exports = FinancialService;
