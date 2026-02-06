
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller.js');

// Webhook requires raw body - this will be handled in server.js
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
