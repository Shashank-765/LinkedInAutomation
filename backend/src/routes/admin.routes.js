
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const roleMiddleware = require('../middlewares/role.middleware.js');

// Protect all admin routes
router.use(authMiddleware);
// router.use(roleMiddleware(['SUPER_ADMIN', 'ADMIN'])); // Restricted to Admin/SuperAdmin

// User Management
router.get('/users',roleMiddleware(['SUPER_ADMIN', 'ADMIN']), adminController.getAllUsers);
router.post('/users', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), adminController.createUser);
router.put('/users/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), adminController.updateUser);
router.delete('/users/:id', roleMiddleware(['SUPER_ADMIN', 'ADMIN']), adminController.deleteUser);

// Plan Management
router.post('/plans', roleMiddleware(['ADMIN','SUPER_ADMIN']), adminController.createPlan);
router.get('/getplans', roleMiddleware(['ADMIN','USER','SUPER_ADMIN']),adminController.getPlans);
router.put('/plans/:id', roleMiddleware(['ADMIN','SUPER_ADMIN']), adminController.updatePlan);
router.delete('/plans/:id', roleMiddleware(['ADMIN','SUPER_ADMIN']), adminController.deletePlan);

// System Analytics
router.get('/analytics', adminController.getSystemAnalytics);

module.exports = router;
