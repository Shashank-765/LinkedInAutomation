const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  topic: { type: String, required: true },
  isGlobal: { type: Boolean, default: false }
});

const autoPostCalendarSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  urn: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  events: [calendarEventSchema],
  lastCalendarPostDate: String
}, { timestamps: true });

module.exports = mongoose.model("AutoPostCalendar", autoPostCalendarSchema);
