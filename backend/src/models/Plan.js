
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


PlanSchema.statics.defaultPlanCreation = async function() {
  const existingPlan = await this.findOne({ name: 'Free' });
  if (!existingPlan) {
    await this.create({
      name: 'Free',
      price: 0,
      stripePriceId: 'price_1Hh1YZ2eZvKYlo2C1Hh1YZ2e',
      limits: {
        maxAiGenerationsPerMonth: 5,
        maxAiImagesPerMonth: 3,
        maxScheduledPostsPerDay: 5,
        bulkScheduling: true,
        autoPilot: true,
        imageGeneration: true,
        teamMemberLimit: 1
      }
    });
  }
};
module.exports = mongoose.model('Plan', PlanSchema);

