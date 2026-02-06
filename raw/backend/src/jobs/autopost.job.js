
const Post = require('../models/Post.js');
const { postLinkedInCarousel } = require('../services/linkedin.service.js');

/**
 * Job that finds posts scheduled for "now" or earlier and publishes them
 */
async function autoPostJob() {
  try {
    const now = new Date();
    // Find posts that are SCHEDULED or POSTING and whose time has passed, populate user for LinkedIn details
      const pendingPosts = await Post.find({
  status: { $in: ['SCHEDULED', 'POSTING'] },
  $or: [
    { status: 'POSTING' }, // post immediately
    { scheduledAt: { $lte: now } } // scheduled posts
  ]
}).populate('userId');

    console.log(`🤖 AutoPost: Processing ${pendingPosts.length} posts...`);

    for (const post of pendingPosts) {
      const user = post.userId;
      
      if (!user || !user.linkedInConnected || !user.linkedInProfile?.accessToken) {
        console.warn(`⚠️ Skipping post ${post._id}: User not connected to LinkedIn`);
        post.status = 'FAILED';
        await post.save();
        continue;
      }

      try {
        const token = user.linkedInProfile.accessToken;
        const urn = user.linkedInProfile.urn;

        // Using your original sophisticated carousel function
        const response = await postLinkedInCarousel(post.content, post.images, token, urn);
        //console.log(`LinkedIn API Response for post ${post._id}:`, response.data,response);
        // Store the LinkedIn reference for future likes/comments/metrics
        post.linkedInPostId = response.headers['x-linkedin-id'] || response.data.id;
        post.status = 'POSTED';
        post.postedAt = new Date();
        //console.log('post', post)
        await post.save();
        
        console.log(`✅ Successfully posted ${post._id} to LinkedIn account: ${user.email}`);
      } catch (postError) {
        console.error(`❌ Failed to post ${post._id}:`, postError.message);
        post.status = 'FAILED';
        post.retryCount += 1;
        await post.save();
      }
    }
  } catch (error) {
    console.error("❌ AutoPost Job Error:", error);
  }
}

module.exports = { autoPostJob };
