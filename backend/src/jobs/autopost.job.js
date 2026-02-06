
const Post = require('../models/Post.js');
const User = require('../models/User.js');
const axios = require('axios');
const { postLinkedInCarousel } = require('../services/linkedin.service.js');
const {aiService} = require('../services/geminiServices.js');

// 🔒 NewsAPI Config
const NEWS_API_KEY = "04e85a9205534f4b9028def15df8473c";
const EVERYTHING_URL = "https://newsapi.org/v2/everything";

async function autoPostJob() {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // 1. Standard Queue Process
    const pendingPosts = await Post.find({
      status: { $in: ['SCHEDULED'] },
      scheduledAt: { $lte: now }
    }).populate('userId');

    for (const post of pendingPosts) {
      await deployToLinkedIn(post, post.userId);
    }

    // 2. Autonomous Engine (AutoPilot)
    const autoPilotUsers = await User.find({
      'autoPilotConfig.enabled': true,
      'autoPilotConfig.lastAutoPostDate': { $ne: todayStr },
      linkedInConnected: true
    });
    console.log(`AutoPilot: Found ${autoPilotUsers.length} users to process.`);
    for (const user of autoPilotUsers) {
      let finalTopic = '';
      let assetUrl = null;
      let heading = ''

      // Scenario A: Calendar Check (Festivals/Events)
      const calendarEvent = user.autoPilotConfig.calendarEvents?.find(e => e.date === todayStr);
      
      if (calendarEvent) {
        heading = `Calendar Event Found: ${calendarEvent.topic}`;
        finalTopic = await aiService.generateLinkedInPost(calendarEvent.topic,tone = "neutral", user);
        assetUrl = await aiService.generateImagesForPost(finalTopic, user.industry);
        console.log(`AutoPilot [A]: Triggered for user ${user._id} - Event: ${calendarEvent.topic}`);
      } else {
        // Scenario B: News Fetch (Industry Signals)
        try {
          const industryQuery = user.autoPilotConfig.industryKeywords || user.industry || 'technology';
          const newsRes = await axios.get(EVERYTHING_URL, {
            params: {
              apiKey: NEWS_API_KEY,
              q: industryQuery,
              pageSize: 10,
              sortBy: 'publishedAt',
              language: 'en'
            }
          });

          const articles = newsRes.data.articles || [];
          if (articles.length > 0) {
            // Pick a random top article to keep feed fresh
            const randomIdx = Math.floor(Math.random() * Math.min(5, articles.length));
            const article = articles[randomIdx];
            heading = `News Article Selected: ${article.title}`;
            finalTopic = await aiService.generateLinkedInPost(article.title,tone = "neutral", user);
            assetUrl = article.urlToImage;
            console.log(`AutoPilot [B]: Triggered for user ${user._id} - News: ${article.title}`);
          }
        } catch (err) {
          console.warn(`AutoPilot [B] Error for user ${user._id}:`, err.message);
        }
      }

      if (finalTopic) {
        // Build Autonomous Post via specialized logic (Simulation of AI logic here)
        const autonomousContent = `[AUTOPILOT SYNC]\n\n${finalTopic}\n\nAnalyzing how this shifts the landscape for ${user.companyName || 'our industry'}. The pace of change is accelerating. What's your take?\n\n#AutoPilot #${user.industry?.replace(/\s+/g, '')} #FutureOfWork`;
        console.log('assetUrl', assetUrl)
        const newAutoPost = new Post({
          userId: user._id,
          topic: heading,
          content: finalTopic,
          images: assetUrl ? assetUrl : [],
          imageSource: assetUrl ? 'AI' : 'NONE',
          status: 'PENDING',
          isAutoPilot: true
        });

        await newAutoPost.save();
        console.log('newAutoPost', newAutoPost);
        await deployToLinkedIn(newAutoPost, user);
        
        // Finalize state
        user.autoPilotConfig.lastAutoPostDate = todayStr;
        await user.save();
      }
    }
  } catch (error) {
    console.error("Master AutoPost Job Internal Error:", error);
  }
}

async function deployToLinkedIn(post, user) {
  if (!user || !user.linkedInConnected || !user.linkedInProfile?.accessToken) {
    post.status = 'FAILED';
    await post.save();
    return;
  }
  try {
    const response = await postLinkedInCarousel(post.content, post.images, user.linkedInProfile.accessToken, user.linkedInProfile.urn);
    post.linkedInPostId = response.headers['x-linkedin-id'] || response.data.id;
    post.status = 'POSTED';
    post.postedAt = new Date();
    await post.save();
  } catch (err) {
    console.error(`Deployment failed for post ${post._id}:`, err.message);
    post.status = 'FAILED';
    await post.save();
  }
}

module.exports = { autoPostJob };
