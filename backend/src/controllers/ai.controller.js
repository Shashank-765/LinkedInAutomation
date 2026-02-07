const {aiService} = require('../services/geminiServices.js');

exports.getsuggestions = async (req, res) => {
  try {
    const {industry,company, postType} = req.body
   let data = await aiService.suggestTopics(industry,company,postType)
   res.json(data)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.generateLinkedinPost = async (req,res) => {
    try {
        const {topic, tone, userProfile} = req.body
            // const userProfile = await User.findById(req.user.id).populate('planId').select('-password');

        let data = await aiService.generateLinkedInPost(topic, tone, userProfile)
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.generateImagesForPost = async (req,res) => {
    try {
        const { topic, industry } = req.body
        let data = await aiService.generateImagesForPost(topic, industry, 1)
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}