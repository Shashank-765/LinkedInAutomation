
const Post = require('../models/Post.js');
const User = require('../models/User.js');
const mongoose = require('mongoose');
const { 
  postLinkedInCarousel, 
  likeLinkedInPost, 
  commentOnLinkedInPost 
} = require('../services/linkedin.service.js');
const { getPostFullDetails } = require('../middlewares/linkedinPost.middleware.js');

exports.savePost = async (req, res) => {
  try {
    const { topic, content, images, imageSource, status, scheduledAt, isAutoPilot } = req.body;
    const post = new Post({
      userId: req.user.id,
      topic,
      content,
      images: images || [],
      imageSource: imageSource || 'NONE',
      status: status || 'PENDING',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      isAutoPilot: !!isAutoPilot
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deployPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!user.linkedInConnected || !user.linkedInProfile?.accessToken) {
      return res.status(400).json({ message: "LinkedIn profile not connected. Visit Settings." });
    }

    const token = user.linkedInProfile.accessToken;
    const authorUrn = user.linkedInProfile.urn;
   // console.log('user', user)
    const liResponse = await postLinkedInCarousel(post.content, post.images, token, authorUrn);
    //console.log('li', liResponse)
    const liId = liResponse.headers['x-linkedin-id'] || liResponse.data.id;

    post.status = 'POSTED';
    post.postedAt = new Date();
    post.linkedInPostId = liId;
    await post.save();

    res.json({ success: true, linkedInId: liId, post });
  } catch (err) {
    console.error("Deployment Error:", err.message);
    res.status(500).json({ message: "Deployment Failed: " + (err.response?.data?.message || err.message) });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!post || !post.linkedInPostId) return res.status(404).json({ message: "Post not live on LinkedIn" });
    if (!user.linkedInProfile?.accessToken) return res.status(401).json({ message: "LinkedIn node offline" });

    await likeLinkedInPost(post.linkedInPostId, user.linkedInProfile.accessToken, user.linkedInProfile.urn);
    
    // Optimistic UI update for metrics
    post.metrics.likes = (post.metrics.likes || 0) + 1;
    await post.save();

    res.json({ success: true, message: "Reaction recorded on LinkedIn" });
  } catch (err) {
    res.status(500).json({ message: err.response?.data?.message || err.message });
  }
};

exports.commentPost = async (req, res) => {
  try {
    const { message } = req.body;
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!post || !post.linkedInPostId) return res.status(404).json({ message: "Post not live" });
    if (!user.linkedInProfile?.accessToken) return res.status(401).json({ message: "LinkedIn node offline" });

    await commentOnLinkedInPost(post.linkedInPostId, message, user.linkedInProfile.accessToken, user.linkedInProfile.urn);
    
    post.metrics.comments = (post.metrics.comments || 0) + 1;
    await post.save();

    res.json({ success: true, message: "Comment published" });
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ message: err.response?.data?.message || err.message });
  }
};

exports.syncMetrics = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id);
    
    if (!post || !post.linkedInPostId) return res.status(404).json({ message: "Post not live" });
    
    // Ensure we use the user's token for the metrics sync
   // console.log('Syncing metrics for post:', post.linkedInPostId);
    //console.log('Using token for user:', user.linkedInProfile.accessToken);
    const fullDetails = await getPostFullDetails(post.linkedInPostId, user.linkedInProfile.accessToken);
    
    post.metrics = {
      likes: fullDetails.stats.likes,
      comments: fullDetails.stats.comments,
      shares: post.metrics.shares || 0,
      impressions: post.metrics.impressions || 0,
      lastUpdated: new Date()
    };
    await post.save();

    res.json({ success: true, metrics: post.metrics });
  } catch (err) {
    console.error("Sync Metrics Error:", err.message);
    res.status(500).json({ message: "Failed to sync metrics from LinkedIn API." });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. Basic Stats
    const total = await Post.countDocuments({ userId });
    const posted = await Post.countDocuments({ userId, status: 'POSTED' });
    const scheduled = await Post.countDocuments({ userId, status: 'SCHEDULED' });
    const failed = await Post.countDocuments({ userId, status: 'FAILED' });

    // 2. Chart Data (Group by date)
    const chartData = await Post.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } },
      { $limit: 14 } // Last 2 weeks
    ]);

    res.json({
      stats: { total, posted, scheduled, failed },
      chartData
    });
  } catch (err) {
    console.error("Analytics Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getScheduledPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id }).sort({ scheduledAt: 1, createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id, status: 'PENDING' }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePostDetails = async (req, res) => {
  try {
    const { status, scheduledAt, content } = req.body;
    const update = {};
    if (status) update.status = status;
    if (content) update.content = content;
    if (scheduledAt) update.scheduledAt = new Date(scheduledAt);
    
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      update,
      { new: true }
    );
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Post Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
