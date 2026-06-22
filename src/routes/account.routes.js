const express = require('express');
const router = express.Router();
const { accountController } = require('../di');
const authMiddleware = require('../middlewares/auth.middleware');

// GET /v1/account-alpha/balance
router.get('/balance', authMiddleware, accountController.getBalance);

module.exports = router;
