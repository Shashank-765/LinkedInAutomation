const AutoPostIndustry = require("../models/AutoPostIndustry");
const User = require("../models/User");
const Post = require("../models/Post");
const axios = require("axios");
const { aiService } = require("../services/geminiServices");
const { postLinkedInCarousel, postLinkedInVideo } = require('../services/linkedin.service.js');


const NEWS_API_KEY = '04e85a9205534f4b9028def15df8473c';
const EVERYTHING_URL = "https://newsapi.org/v2/everything";

 async function industryAutoPostJob() {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const configs = await AutoPostIndustry.find({ enabled: true });
console.log('configs', configs)
  for (const config of configs) {

    const user = await User.findById(config.userId);
    // console.log('user', user);
    if (!user || !user.linkedInConnected) continue;

    for (const slot of config.schedules) {
        console.log('slot', slot);
      if (slot.lastAutoPostDate === todayStr) continue;
        console.log('currentMinutes', currentMinutes)
      const [h, m] = slot.time.split(":").map(Number);
      const slotMinutes = h * 60 + m;
      const WINDOW = 3;

      const isTime =
        currentMinutes >= slotMinutes &&
        currentMinutes < slotMinutes + WINDOW;

        console.log(`Checking slot ${slot.time} for user ${user._id}: isTime=${isTime}`);

      if (!isTime) continue;

      let heading = "";
      let content = "";
      let assetUrl = null;

      const industryQuery = slot.keywords || user.industry || "technology";

      try {
        const newsRes = await axios.get(EVERYTHING_URL, {
          params: {
            apiKey: NEWS_API_KEY,
            q: industryQuery,
            pageSize: 10,
            sortBy: "publishedAt",
            language: "en"
          }
        });

        const articles = newsRes.data.articles || [];
        console.log('articles', articles);

        if (articles.length > 0) {
          const article = articles[Math.floor(Math.random() * 5)];

          heading = article.title;

          content = await aiService.generateLinkedInPost(
            article.title,
            "neutral",
            user
          );

          assetUrl = article.urlToImage;
        }
      } catch (err) {
        console.error('Error fetching news articles:', err);
      }

      if (!content) {
        heading = industryQuery;
        content = await aiService.generateLinkedInPost(industryQuery, "neutral", user);
        assetUrl = await aiService.generateImagesForPost(content, user.industry);
      }

      const post = await Post.create({
        userId: user._id,
        topic: heading,
        content,
        images: assetUrl ? [assetUrl] : [],
        linkedinUrn: config.urn,
        status: "PENDING",
        isAutoPilot: true
      });
      console.log('Created AutoPostIndustry post:', post._id, 'for user:', user._id);
      await deployToLinkedIn(post, user);

      slot.lastAutoPostDate = todayStr;
      await config.save();
    }
  }
};









function removeBrackets(text) {
  return text.replace(/[()]/g, "");
}

async function deployToLinkedIn(post, user) {
  // if (!user || !user.linkedInConnected || !user.linkedInProfile?.accessToken) {
  //   post.status = 'FAILED';
  //   await post.save();
  //   return;
  // }
      try {
        const linkedInAccount = user.linkedInProfile.find(
      (profile) => profile.urn === post.linkedinUrn
    );

    if (!linkedInAccount) {
      throw new Error("LinkedIn account not connected for this URN");
    }

    const accessToken = linkedInAccount.accessToken;
        let response;
        post.content = removeBrackets(post.content)
        if (post.images && post.images.length > 0) {
          post.status = 'PROCESSING';
            // post.postedAt = new Date();
            await post.save();
          console.log('Deploying with images:', post.images);
          response = await postLinkedInCarousel(post.content, post.images, accessToken, post.linkedinUrn);
          post.linkedInPostId = response?.headers['x-linkedin-id'] || response?.headers['x-restli-id'] ;
          }else{
            console.log('hello', post.video)
            post.status = 'PROCESSING';
            // post.postedAt = new Date();
            await post.save();
            response = await postLinkedInVideo(post.content, post.video, accessToken, post.linkedinUrn);
            post.linkedInPostId =  response?.headers['x-restli-id'] || response?.headers['x-linkedin-id'];

        }
        
        console.log('response', response)
        post.status = 'POSTED';
        post.postedAt = new Date();
        await post.save();
      } catch (err) {
        console.log('err', err)
        console.error(`Deployment failed for post ${post._id}:`, err.message);
        post.status = 'FAILED';
        await post.save();
      }
}


module.exports = {
  industryAutoPostJob
};