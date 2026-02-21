const AutoPostIndustry = require("../models/AutoPostIndustry");

/*
==================================================
CREATE INDUSTRY AUTOPILOT CONFIG (per URN)
==================================================
*/
exports.createIndustryConfig = async (req, res) => {
  try {
    const { urn, schedules, enabled } = req.body;

    if (!urn) {
      return res.status(400).json({ message: "URN required" });
    }

    const exists = await AutoPostIndustry.findOne({
      userId: req.user.id,
      urn
    });

    if (exists) {
      return res.status(400).json({
        message: "Industry config already exists for this URN"
      });
    }

    const config = await AutoPostIndustry.create({
      userId: req.user.id,
      urn,
      schedules: schedules || [],
      enabled: enabled ?? true
    });

    res.json(config);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/*
==================================================
GET ALL INDUSTRY CONFIGS FOR USER
==================================================
*/
exports.getIndustryConfigs = async (req, res) => {
  try {
    const data = await AutoPostIndustry.find({
      userId: req.user.id
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/*
==================================================
UPDATE INDUSTRY CONFIG (FULL UPDATE)
==================================================
*/
exports.updateIndustryConfig = async (req, res) => {
  try {
    const { id } = req.params;

    const config = await AutoPostIndustry.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }

    res.json(config);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/*
==================================================
DELETE INDUSTRY CONFIG
==================================================
*/
exports.deleteIndustryConfig = async (req, res) => {
  try {
    const { id } = req.params;

    await AutoPostIndustry.deleteOne({
      _id: id,
      userId: req.user.id
    });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/*
==================================================
ADD TIME SLOT TO EXISTING CONFIG
==================================================
*/
exports.addIndustrySlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { time, keywords } = req.body;

    if (!time) {
      return res.status(400).json({ message: "Time required" });
    }

    const config = await AutoPostIndustry.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        $push: {
          schedules: {
            time,
            keywords
          }
        }
      },
      { new: true }
    );

    res.json(config);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/*
==================================================
DELETE TIME SLOT
==================================================
*/
exports.deleteIndustrySlot = async (req, res) => {
  try {
    const { configId, slotId } = req.params;

    const config = await AutoPostIndustry.findOneAndUpdate(
      { _id: configId, userId: req.user.id },
      {
        $pull: {
          schedules: { _id: slotId }
        }
      },
      { new: true }
    );

    res.json(config);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
