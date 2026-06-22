const DatabaseService = require('./services/database.service');
const NotificationService = require('./services/notification.service');
const FinancialService = require('./services/financial.service');

const AccountController = require('./controllers/account.controller');
const TransferController = require('./controllers/transfer.controller');

const databaseService = new DatabaseService();
const notificationService = new NotificationService();
const financialService = new FinancialService(databaseService, notificationService);

const accountController = new AccountController(financialService);
const transferController = new TransferController(financialService);

module.exports = {
  accountController,
  transferController
};
