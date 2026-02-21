const AutoPostCalendar = require("../models/AutoPostCalendar");


/*
==================================================
CREATE CALENDAR CONFIG (per URN)
==================================================
*/
exports.createCalendarConfig = async (req, res) => {
  try {
    const { urn, events, enabled } = req.body;

    if (!urn) {
      return res.status(400).json({ message: "URN required" });
    }

    const exists = await AutoPostCalendar.findOne({
      userId: req.user.id,
      urn
    });

    if (exists) {
      return res.status(400).json({
        message: "Calendar config already exists for this URN"
      });
    }

    const config = await AutoPostCalendar.create({
      userId: req.user.id,
      urn,
      events: events || [],
      enabled: enabled ?? true
    });

    res.json(config);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/*
==================================================
GET USER CALENDAR CONFIGS
==================================================
*/
exports.getCalendarConfigs = async (req, res) => {
  try {
    const data = await AutoPostCalendar.find({
      userId: req.user.id
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/*
==================================================
UPDATE CALENDAR CONFIG
==================================================
*/
exports.updateCalendarConfig = async (req, res) => {
  try {
    const { id } = req.params;

    const config = await AutoPostCalendar.findOneAndUpdate(
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
DELETE CALENDAR CONFIG
==================================================
*/
exports.deleteCalendarConfig = async (req, res) => {
  try {
    const { id } = req.params;

    await AutoPostCalendar.deleteOne({
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
ADD EVENT
==================================================
*/
exports.addCalendarEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, topic, isGlobal } = req.body;

    if (!date || !topic) {
      return res.status(400).json({
        message: "date and topic required"
      });
    }

    const config = await AutoPostCalendar.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        $push: {
          events: { date, topic, isGlobal }
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
DELETE EVENT
==================================================
*/
exports.deleteCalendarEvent = async (req, res) => {
  try {
    const { configId, eventId } = req.params;

    const config = await AutoPostCalendar.findOneAndUpdate(
      { _id: configId, userId: req.user.id },
      {
        $pull: {
          events: { _id: eventId }
        }
      },
      { new: true }
    );

    res.json(config);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
