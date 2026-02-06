
const User = require('../models/User.js');
const Plan = require('../models/Plan.js');

const checkPlanLimit = (limitType) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('planId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.planId) return res.status(403).json({ message: 'No active plan assigned' });

    const limits = user.planId.limits;

    if (limitType === 'AI_GENERATION') {
      if (user.usage.aiGenerationsThisMonth >= limits.maxAiGenerationsPerMonth) {
        return res.status(403).json({ message: 'Monthly AI generation limit reached' });
      }
    }
    if (limitType === 'AI_IMAGE') {
      if (user.usage.aiImagesThisMonth >= limits.maxAiImagesPerMonth) {
        return res.status(403).json({ message: 'Monthly AI image generation limit reached' });
      }
    }
    if (limitType === 'SCHEDULE') {
      if (user.usage.scheduledToday >= limits.maxScheduledPostsPerDay) {
        return res.status(403).json({ message: 'Daily scheduling limit reached' });
      }
    }

    next();
  } catch (err) {
    res.status(500).json({ message: 'Plan enforcement error' });
  }
};

module.exports = checkPlanLimit;
