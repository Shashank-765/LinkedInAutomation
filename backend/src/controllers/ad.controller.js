
const Ad = require('../models/Ads.js');

exports.getAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getActiveAds = async (req, res) => {
  try {
    const { location } = req.query;
    const query = { status: 'active' };
    if (location) query.location = location;
    
    const ads = await Ad.find(query).sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAd = async (req, res) => {
  try {
    const ad = new Ad(req.body);
    await ad.save();
    res.status(201).json(ad);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAd = async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ad removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
