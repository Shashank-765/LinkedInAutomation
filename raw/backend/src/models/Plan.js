
const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stripePriceId: { type: String }, // Used to map Stripe events back to this plan
  limits: {
    maxAiGenerationsPerMonth: { type: Number, default: 10 },
    maxAiImagesPerMonth: { type: Number, default: 5 },
    maxScheduledPostsPerDay: { type: Number, default: 3 },
    bulkScheduling: { type: Boolean, default: false },
    autoPilot: { type: Boolean, default: false },
    imageGeneration: { type: Boolean, default: false },
    teamMemberLimit: { type: Number, default: 1 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', PlanSchema);
