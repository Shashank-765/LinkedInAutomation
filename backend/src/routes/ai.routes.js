const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.post('/suggestions', authMiddleware, aiController.getsuggestions);
router.post('/generate-post', authMiddleware, aiController.generateLinkedinPost);
router.post('/generateImage',authMiddleware,aiController.generateImagesForPost);


module.exports = router;
