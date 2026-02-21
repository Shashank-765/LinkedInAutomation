const router = require("express").Router();
const ctrl = require("../controllers/autoPostCalendar.controller");
const auth = require("../middlewares/auth.middleware.js");

router.post("/", auth, ctrl.createCalendarConfig);
router.get("/", auth, ctrl.getCalendarConfigs);
router.put("/:id", auth, ctrl.updateCalendarConfig);
router.delete("/:id", auth, ctrl.deleteCalendarConfig);

router.post("/:id/event", auth, ctrl.addCalendarEvent);
router.delete("/:configId/event/:eventId", auth, ctrl.deleteCalendarEvent);

module.exports = router;
