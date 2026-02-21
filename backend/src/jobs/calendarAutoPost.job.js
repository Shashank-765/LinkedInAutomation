const AutoPostCalendar = require("../models/AutoPostCalendar");
const User = require("../models/User");
const Post = require("../models/Post");
const { postLinkedInCarousel, postLinkedInVideo } = require('../services/linkedin.service.js');

const { aiService } = require("../services/geminiServices");



async function calendarAutoPostJob() {

  const todayStr = new Date().toISOString().split("T")[0];

  const configs = await AutoPostCalendar.find({
    enabled: true,
    lastCalendarPostDate: { $ne: todayStr }
  });

  for (const config of configs) {

    const user = await User.findById(config.userId);
    if (!user || !user.linkedInConnected) continue;

    const event = config.events.find(e => e.date === todayStr);
    if (!event) continue;

    const content = await aiService.generateLinkedInPost(
      event.topic,
      "neutral",
      user
    );

    const image = await aiService.generateImagesForPost(content, user.industry);

    const post = await Post.create({
      userId: user._id,
      topic: event.topic,
      content,
      images: image ? image : [],
      linkedinUrn: config.urn,
      status: "PENDING",
      isAutoPilot: true
    });

    await deployToLinkedIn(post, user);

    config.lastCalendarPostDate = todayStr;
    await config.save();
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
  calendarAutoPostJob
};
