
const Post = require('../models/Post.js');
const User = require('../models/User.js');
const mongoose = require('mongoose');
const axios = require('axios');
const { 
  postLinkedInCarousel, 
  postLinkedInVideo,
  likeLinkedInPost, 
  commentOnLinkedInPost 
} = require('../services/linkedin.service.js');

// 🔒 HARDCODED NewsAPI config
const NEWS_API_KEY = "04e85a9205534f4b9028def15df8473c";
const EVERYTHING_URL = "https://newsapi.org/v2/everything";

exports.getTrendingTopics = async (req, res) => {
  try {
    const { industry = "technology", page = 1, limit = 25 } = req.query;

    const response = await axios.get(EVERYTHING_URL, {
      params: {
        apiKey: NEWS_API_KEY,
        q: industry,
        searchIn: "title,content",
        language: "en",
        sortBy: "publishedAt",
        page: Number(page),
        pageSize: Number(limit)
      }
    });

    const articles = response.data.articles || [];

    // 🎯 Normalize response for frontend
    const topics = articles.map((article, index) => ({
      topic: article.title,
      image: article.urlToImage || null,
      source: article.source?.name || "News",
      description: article.description,
      publishedAt: article.publishedAt,
      link: article.url,
      score: Math.max(100 - index * 3, 10)
    }));

    res.json({
      success: true,
      industry,
      topics
    });

  } catch (error) {
    console.error("NewsAPI error:", error?.response?.data || error.message);
    res.status(500).json({ success: false, topics: [] });
  }
};



exports.toggleAutoPilot = async (req, res) => {
  try {
    const { urn, enabled } = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        "autoPilotAccounts.urn": urn
      },
      {
        $set: {
          "autoPilotAccounts.$.enabled": enabled
        }
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createAutoPilotAccount = async (req, res) => {
  try {
    const { urn } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          autoPilotAccounts: {
            urn,
            enabled: false,
            industrySchedules: [],
            calendarEvents: []
          }
        }
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//industry schedules are the times when autopilot will check for trending topics and post on linkedin based on keywords defined by user.

exports.addIndustrySchedule = async (req, res) => {
  try {
    const { urn, time, keywords } = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        "autoPilotAccounts.urn": urn
      },
      {
        $push: {
          "autoPilotAccounts.$.industrySchedules": {
            time,
            keywords
          }
        }
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateIndustrySchedule = async (req, res) => {
  try {
    const { urn, scheduleId, time, keywords } = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        "autoPilotAccounts.urn": urn,
        "autoPilotAccounts.industrySchedules._id": scheduleId
      },
      {
        $set: {
          "autoPilotAccounts.$[account].industrySchedules.$[slot].time": time,
          "autoPilotAccounts.$[account].industrySchedules.$[slot].keywords": keywords
        }
      },
      {
        arrayFilters: [
          { "account.urn": urn },
          { "slot._id": scheduleId }
        ],
        new: true
      }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteIndustrySchedule = async (req, res) => {
  try {
    const { urn, scheduleId } = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        "autoPilotAccounts.urn": urn
      },
      {
        $pull: {
          "autoPilotAccounts.$.industrySchedules": {
            _id: scheduleId
          }
        }
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//calendar events are the important dates defined by user on which autopilot will post on linkedin based on topic defined by user.

exports.addCalendarEvent = async (req, res) => {
  try {
    const { urn, date, topic } = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        "autoPilotAccounts.urn": urn
      },
      {
        $push: {
          "autoPilotAccounts.$.calendarEvents": {
            date,
            topic
          }
        }
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteCalendarEvent = async (req, res) => {
  try {
    const { urn, eventId } = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        "autoPilotAccounts.urn": urn
      },
      {
        $pull: {
          "autoPilotAccounts.$.calendarEvents": {
            _id: eventId
          }
        }
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getAutoPilotConfig = async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("autoPilotAccounts");

  res.json(user.autoPilotAccounts);
};



exports.updateAutoPilotConfig = async (req, res) => {
  try {
    console.log('req.body', req.body)
    let { enabled, industryKeywords, calendarEvents } = req.body
    let userData = await User.findOne({_id: req.user.id})
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { autoPilotConfig: {
        enabled:enabled,
        industryKeywords:industryKeywords,
        calendarEvents: calendarEvents,
        urn: userData.activeUrn

      } } },
      { new: true }
    ).select('-password');
    console.log('user', user)
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.savePost = async (req, res) => {
  try {
    const { topic, content, images, imageSource, status, scheduledAt, isAutoPilot, urn } = req.body;
    console.log('req.body', req.body)
    let videoUrl = null;
    console.log("====================>",req.file)
    if(!urn){
      return res.status(400).json({message: "Connect to Linkedin account First"})
        }
    // ✅ If video file uploaded
    if (req.file) {
      videoUrl = `${req.protocol}://${req.get("host")}/uploads/videos/${req.file.filename}`;
    }

    const post = new Post({
      userId: req.user.id,
      topic,
      content,
      images: images ? JSON.parse(JSON.stringify(images)) : [],
      video: videoUrl,
      imageSource: imageSource || 'NONE',
      linkedinUrn: urn,
      status: status || 'PENDING',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      isAutoPilot: !!isAutoPilot
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ message: err.message });
  }
};


exports.deployPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!user.linkedInConnected || !user.activeUrn) {
      return res.status(400).json({ message: "LinkedIn offline" });
    }

    //find accesstoken from as array as per urn 
    // Find matching LinkedIn profile by URN
    const linkedInAccount = user.linkedInProfile.find(
      (profile) => profile.urn === post.linkedinUrn
    );

    if (!linkedInAccount) {
      throw new Error("LinkedIn account not connected for this URN");
    }

    const accessToken = linkedInAccount.accessToken;

        if(post.images && post.images.length > 0){

          // Deploy carousel post
        const liResponse = await postLinkedInCarousel(post.content, post.images, accessToken, post.linkedinUrn);
        post.status = 'POSTED';
        post.postedAt = new Date();
        console.log('liResponse', liResponse)
        post.linkedInPostId = liResponse?.headers['x-linkedin-id'] || liResponse?.headers['x-restli-id'];
        await post.save();

        res.json({ success: true, post });
          } else if(post.video){
          // Deploy video post
          const liResponse = await postLinkedInVideo(post.content, post.video, accessToken, post.linkedinUrn);
          post.status = 'POSTED';
          post.postedAt = new Date();
        console.log('liResponse', liResponse)

          post.linkedInPostId = liResponse?.headers['x-linkedin-id'] || liResponse?.headers['x-restli-id'];
          await post.save();

          res.json({ success: true, post });
        } else {
          return res.status(400).json({ message: "No media to post" });
        }
        
      } catch (err) {
        console.log('Deployment Error:', err);
        res.status(500).json({ message: "Deployment Failed: " + err.message });
      }
};

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = {
      total: await Post.countDocuments({ userId }),
      posted: await Post.countDocuments({ userId, status: 'POSTED' }),
      scheduled: await Post.countDocuments({ userId, status: 'SCHEDULED' }),
      failed: await Post.countDocuments({ userId, status: 'FAILED' })
    };
    const chartData = await Post.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } }, { $limit: 14 }
    ]);
    res.json({ stats, chartData });
  } catch (err) {
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
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
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
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!post || !post.linkedInPostId) return res.status(404).json({ message: "Post not live on LinkedIn" });
    // if (!user.linkedInProfile?.accessToken) return res.status(401).json({ message: "LinkedIn node offline" });
    const linkedInAccount = user.linkedInProfile.find(
      (profile) => profile.urn === post.linkedinUrn
    );

    if (!linkedInAccount) {
      throw new Error("LinkedIn account not connected for this URN");
    }

    const accessToken = linkedInAccount.accessToken;
        await likeLinkedInPost(post.linkedInPostId, accessToken, post.linkedinUrn);
    
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
    // if (!user.linkedInProfile?.accessToken) return res.status(401).json({ message: "LinkedIn node offline" });

    const linkedInAccount = user.linkedInProfile.find(
  (profile) => profile.urn === post.linkedinUrn
  );

  if (!linkedInAccount) {
    throw new Error("LinkedIn account not connected for this URN");
  }

  const accessToken = linkedInAccount.accessToken;

      await commentOnLinkedInPost(post.linkedInPostId, message, accessToken, post.linkedinUrn);
      
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
      const linkedInAccount = user.linkedInProfile.find(
    (profile) => profile.urn === post.linkedinUrn
  );

  if (!linkedInAccount) {
    throw new Error("LinkedIn account not connected for this URN");
  }

  const accessToken = linkedInAccount.accessToken;
      const fullDetails = await getPostFullDetails(post.linkedInPostId, accessToken);
      
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


