
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.put('/plan', authMiddleware, authController.updatePlan);

// LinkedIn OAuth Flow
router.get('/linkedin/get-link', authMiddleware, authController.getLinkedInLink);
router.post('/linkedin/connect', authMiddleware, authController.connectLinkedIn);
router.post('/linkedin/disconnect', authMiddleware, authController.disconnectLinkedIn);

module.exports = router;
