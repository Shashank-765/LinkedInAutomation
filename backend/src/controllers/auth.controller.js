
const User = require('../models/User.js');
const Plan = require('../models/Plan.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { 
  getLinkedInProfile, 
  getAuthorizationUrl, 
  exchangeCodeForToken 
} = require('../services/linkedin.service.js');

const JWT_SECRET = process.env.JWT_SECRET || 'postpilot_secret_key_2025';

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, companyName, industry, postTypePreference } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || "password", salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'USER',
      companyName,
      industry,
      postTypePreference: postTypePreference || 'Educational'
    });

    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('first', email, password)
    let user = await User.findOne({ email }).populate('planId');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    console.log('user', user)
    console.log(Array.isArray(user.linkedInProfile))
     if (!Array.isArray(user.linkedInProfile)) {
       user.linkedInProfile = [user.linkedInProfile]
      await User.findByIdAndUpdate({_id: user._id}, 
       ...user
      )
     }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    user.linkedInProfile = user.linkedInProfile.find((d)=> d.urn === user.activeUrn)

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ token, user: userResponse });
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('planId')
      .select('-password')
      .lean();   // 🔥 important
    console.log('user', user)
    const activeProfile = user.linkedInProfile?.find(
      (d) => d.urn === user.activeUrn
    );

    // 👇 Override only in response (NOT DB)
    user.linkedInProfile = activeProfile || null;

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Returns the redirect URL for the frontend to open
exports.getLinkedInLink = async (req, res) => {
  try {
    const url = getAuthorizationUrl();
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Exchanges a code for a real LinkedIn token and saves it to the DB
exports.connectLinkedIn = async (req, res) => {
  try {
    const { code } = req.body;

    const accessToken = code 
      ? await exchangeCodeForToken(code) 
      : "AQV_MOCKED_TOKEN_" + Math.random().toString(36).substring(7);

    const profile = await getLinkedInProfile(accessToken);

    const user = await User.findById(req.user.id);
console.log("user", user)
    // 🔥 Normalize old data
    if (!Array.isArray(user.linkedInProfile)) {
      if (user.linkedInProfile) {
        user.linkedInProfile = [user.linkedInProfile];
      } else {
        user.linkedInProfile = [];
      }
    }

    const existingIndex = user.linkedInProfile.findIndex(
      (p) => p.urn === profile.urn
    );
    console.log('existingIndex', existingIndex)

    if (existingIndex !== -1) {
      user.linkedInProfile[existingIndex] = {
        ...profile,
        accessToken
      };
    } else {
      user.linkedInProfile.push({
        ...profile,
        accessToken
      });
    }

    user.activeUrn = profile.urn;
    user.linkedInConnected = true;

   let data =  await User.findByIdAndUpdate({_id: user._id}, {...user});
   console.log('data', data)

    const updatedUser = await User.findById(req.user.id)
      .select("-password")
      .lean();

    updatedUser.linkedInProfile = updatedUser.linkedInProfile[existingIndex]

    res.json({
      success: true,
      user: {
        ...updatedUser,
        
      }
    });

  } catch (err) {
    console.log('err', err);
    res.status(500).json({
      message: 'LinkedIn Handshake Failed: ' + err.message
    });
  }
};


exports.disconnectLinkedIn = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          linkedInConnected: false,
          activeUrn: ''
          // linkedInProfile: undefined
        }
      },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: {
         planId: plan._id, 
         usage: {
                   aiGenerationsThisMonth: 0,
                   aiImagesThisMonth: 0
                   },
        } },
      { new: true }
    ).populate('planId').select('-password');
    user.linkedInProfile = user.linkedInProfile.find((d)=> d.urn === user?.activeUrn)

    res.json(user);
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ message: err.message });
  }
};
