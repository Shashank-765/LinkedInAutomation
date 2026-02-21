
const Post = require('../models/Post.js');
const User = require('../models/User.js');
const axios = require('axios');
const { postLinkedInCarousel, postLinkedInVideo } = require('../services/linkedin.service.js');
// const {aiService} = require('../services/geminiServices.js');


async function scheduledPostJob() {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // 1. Standard Queue Process
    const pendingPosts = await Post.find({
      status: { $in: ['SCHEDULED'] },
      scheduledAt: { $lte: now }
    }).populate('userId');
    console.log('pendingPosts', pendingPosts)
    for (const post of pendingPosts) {
      await deployToLinkedIn(post, post.userId);
    }

  } catch (error) {
    console.error("Master AutoPost Job Internal Error:", error);
  }
}















function removeBrackets(text) {
  return text.replace(/[()]/g, "");
}

async function deployToLinkedIn(post, user) {
  // if (!user || !user.linkedInConnected || !user.linkedInProfile?.accessToken) {
  //   post.status = 'FAILED';
  //   await post.save();
  //   return;
  // }

  console.log('post', post)
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

module.exports = { scheduledPostJob };
