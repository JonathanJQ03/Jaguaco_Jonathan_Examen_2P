const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transfer.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// POST /v1/transfer-beta/execute
router.post('/execute', authMiddleware, transferController.executeTransfer);

module.exports = router;
