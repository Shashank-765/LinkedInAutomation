
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
console.log('hello')
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'USER'], default: 'USER' },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  companyName: { type: String, default: '' },
  industry: { type: String, default: '' },
  postTypePreference: { type: String, default: 'Educational' },
  
  // LinkedIn OAuth Integration
  linkedInConnected: { type: Boolean, default: false },
  linkedInProfile: {
    urn: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    profilePicture: { type: String },
    accessToken: { type: String } 
  },

  // NEW: Autonomous Configuration
  autoPilotConfig: {
    enabled: { type: Boolean, default: false },
    industryKeywords: { type: String, default: 'technology' },
    calendarEvents: [{
      date: { type: String }, // YYYY-MM-DD
      topic: { type: String },
      isGlobal: { type: Boolean, default: false }
    }],
    lastAutoPostDate: { type: String } // To prevent multiple posts per day
  },

  // Stripe Integration Fields
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  subscriptionStatus: { type: String }, 

  usage: {
    aiGenerationsThisMonth: { type: Number, default: 0 },
    aiImagesThisMonth: { type: Number, default: 0 },
    scheduledToday: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now }
});

//default superadmin

UserSchema.statics.createDefaultAdmin = async function() {
  const existingAdmin = await this.findOne({ email: 'admin@bastionex.com' });

  if (!existingAdmin) {
     const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
    const admin = new this({
      name: 'Admin User',
      email: 'admin@bastionex.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN'
    });
   let data  =  await admin.save();
   console.log('first', data)
   return data;
  }
};

module.exports = mongoose.model('User', UserSchema);
