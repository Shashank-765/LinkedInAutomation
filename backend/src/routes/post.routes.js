
const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const multer = require("multer");
const fs = require("fs");
const path = require("path");


const videoDir = path.join(__dirname, "../../uploads/videos");

if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, videoDir),
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


const upload = multer({ storage });

const conditionalVideoUpload = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";
    console.log('contentType', contentType)
  // Only invoke multer if multipart/form-data (file upload)
  if (contentType.includes("multipart/form-data")) {
      console.log('done')

    upload.single("video")(req, res, function (err) {
    if (err) return next(err);

    // multer completed successfully (with or without file)
    next();
  });
  }


  // No file upload → skip multer
  next();
};


router.use(authMiddleware);

router.post('/save',conditionalVideoUpload, postController.savePost);
router.post('/deploy/:id', postController.deployPost);
router.get('/pending', postController.getPendingPosts);
router.get('/status', postController.getScheduledPosts);
router.get('/analytics', postController.getAnalytics);
router.put('/update/:id', postController.updatePostDetails);
router.delete('/delete/:id', postController.deletePost);

// Autonomous & Intelligence
router.get('/trending-topics', postController.getTrendingTopics);
router.put('/autopilot/config', postController.updateAutoPilotConfig);

// Social & Metrics
router.post('/:id/like', postController.likePost);
router.post('/:id/comment', postController.commentPost);
router.get('/:id/metrics', postController.syncMetrics);

module.exports = router;
