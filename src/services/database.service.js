class DatabaseService {
  constructor() {
    this.usersDb = [
      { id: 'usr_001', email: 'estudiante.alpha@espe.edu.ec', accountAlpha: 'ACC-12345', balance: 1500.00 },
      { id: 'usr_002', email: 'docente.beta@espe.edu.ec', accountAlpha: 'ACC-67890', balance: 350.50 }
    ];
    this.transactionsHistory = [];
  }

  getAccount(accountId) {
    return this.usersDb.find(u => u.accountAlpha === accountId);
  }

  updateBalance(accountId, amountChange) {
    const account = this.getAccount(accountId);
    if (account) {
      account.balance += amountChange;
    }
  }

  saveTransaction(transaction) {
    this.transactionsHistory.push(transaction);
  }
}

module.exports = DatabaseService;
