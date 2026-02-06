
const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Base64 or URL
  linkUrl: { type: String, required: true },
  location: { 
    type: String, 
    enum: ['HOME', 'DASHBOARD'], 
    default: 'DASHBOARD' 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ad', AdSchema);
