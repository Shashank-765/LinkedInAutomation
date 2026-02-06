
const User = require('../models/User.js');
const Plan = require('../models/Plan.js');
const Post = require('../models/Post.js');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('planId').select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, planId, companyName, industry, postTypePreference } = req.body;
    console.log('req.body', req.body)
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    console.log('password', password ||`${name.split(" ")[0]}123`)
    const hashedPassword = await bcrypt.hash(password ||`${name.split(" ")[0]}123`, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'USER',
      planId: planId || null,
      companyName: companyName || '',
      industry: industry || '',
      postTypePreference: postTypePreference || 'Educational'
    });

    await newUser.save();
    const userResponse = await User.findById(newUser._id).populate('planId').select('-password');
    res.status(201).json(userResponse);
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Extract all potential fields
    const { 
      name, 
      email, 
      role, 
      planId, 
      status, 
      companyName, 
      industry, 
      postTypePreference,
      usage 
    } = req.body;

    // Create an update object, allowing nulls or empty strings where applicable
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (planId !== undefined) updateData.planId = planId === "" ? null : planId;
    if (status !== undefined) updateData.status = status;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (industry !== undefined) updateData.industry = industry;
    if (postTypePreference !== undefined) updateData.postTypePreference = postTypePreference;
    if (usage !== undefined) updateData.usage = usage;
    console.log('updateData', updateData);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('planId').select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSystemAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const postedCount = await Post.countDocuments({ status: 'POSTED' });
    const pendingCount = await Post.countDocuments({ status: 'PENDING' });

    res.json({
      totalUsers,
      totalPosts,
      statusBreakdown: {
        posted: postedCount,
        pending: pendingCount
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ message: 'Plan tier not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan tier not found' });
    res.json({ message: 'Plan tier successfully decommissioned' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
