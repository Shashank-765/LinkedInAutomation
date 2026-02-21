const mongoose = require("mongoose");

const industryScheduleSchema = new mongoose.Schema({
  time: { type: String, required: true }, // HH:mm
  keywords: { type: String, default: "technology" },
  lastAutoPostDate: String
});

const autoPostIndustrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  urn: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  schedules: [industryScheduleSchema]
}, { timestamps: true });

module.exports = mongoose.model("AutoPostIndustry", autoPostIndustrySchema);
