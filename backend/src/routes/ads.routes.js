
const express = require('express');
const router = express.Router();
const adController = require('../controllers/ad.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const roleMiddleware = require('../middlewares/role.middleware.js');

// Public route for fetching ads (Dashboard/Home)
router.get('/active', adController.getActiveAds);

// Admin routes
router.use(authMiddleware);
router.get('/', roleMiddleware(['ADMIN', 'SUPER_ADMIN']), adController.getAds);
router.post('/', roleMiddleware(['ADMIN', 'SUPER_ADMIN']), adController.createAd);
router.put('/:id', roleMiddleware(['ADMIN', 'SUPER_ADMIN']), adController.updateAd);
router.delete('/:id', roleMiddleware(['ADMIN', 'SUPER_ADMIN']), adController.deleteAd);

module.exports = router;
