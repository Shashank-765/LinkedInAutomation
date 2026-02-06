
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String },
  content: { type: String, required: true },
  images: [{ type: String }], 
  imageSource: { 
    type: String, 
    enum: ['AI', 'UPLOAD', 'NONE'], 
    default: 'NONE' 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'SCHEDULED', 'POSTED', 'FAILED'], 
    default: 'PENDING' 
  },
  
  // LinkedIn Deployment Data
  linkedInPostId: { type: String }, // Store the 'urn:li:share:xxx' or post ID
  metrics: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    lastUpdated: { type: Date }
  },

  scheduledAt: { type: Date },
  postedAt: { type: Date },
  retryCount: { type: Number, default: 0 },
  isAutoPilot: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
