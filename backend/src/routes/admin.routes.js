
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const roleMiddleware = require('../middlewares/role.middleware.js');

// Protect all admin routes
// router.use(authMiddleware);
// router.use(roleMiddleware(['SUPER_ADMIN', 'ADMIN'])); // Restricted to Admin/SuperAdmin

// User Management
router.get('/users',authMiddleware, roleMiddleware(['SUPER_ADMIN', 'ADMIN']), adminController.getAllUsers);
router.post('/users', authMiddleware, roleMiddleware(['SUPER_ADMIN', 'ADMIN']), adminController.createUser);
router.put('/users/:id', authMiddleware, roleMiddleware(['SUPER_ADMIN', 'ADMIN']), adminController.updateUser);
router.delete('/users/:id', authMiddleware, roleMiddleware(['SUPER_ADMIN', 'ADMIN']), adminController.deleteUser);

// Plan Management
router.post('/plans', authMiddleware, roleMiddleware(['ADMIN','SUPER_ADMIN']), adminController.createPlan);
router.get('/getplans',  adminController.getPlans);
router.put('/plans/:id', authMiddleware, roleMiddleware(['ADMIN','SUPER_ADMIN']), adminController.updatePlan);
router.delete('/plans/:id', authMiddleware, roleMiddleware(['ADMIN','SUPER_ADMIN']), adminController.deletePlan);

// System Analytics
router.get('/analytics', authMiddleware, adminController.getSystemAnalytics);

module.exports = router;
