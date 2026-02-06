
const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.use(authMiddleware);

router.post('/save', postController.savePost);
router.post('/deploy/:id', postController.deployPost);
router.get('/pending', postController.getPendingPosts);
router.get('/status', postController.getScheduledPosts);
router.get('/analytics', postController.getAnalytics);
router.put('/update/:id', postController.updatePostDetails);
router.delete('/delete/:id', postController.deletePost);

// Social & Metrics
router.post('/:id/like', postController.likePost);
router.post('/:id/comment', postController.commentPost);
router.get('/:id/metrics', postController.syncMetrics);

module.exports = router;
