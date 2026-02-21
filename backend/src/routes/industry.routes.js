const router = require("express").Router();
const ctrl = require("../controllers/autoPostIndustry.controller.js");
const auth = require("../middlewares/auth.middleware.js");

router.post("/", auth, ctrl.createIndustryConfig);
router.get("/", auth, ctrl.getIndustryConfigs);
router.put("/:id", auth, ctrl.updateIndustryConfig);
router.delete("/:id", auth, ctrl.deleteIndustryConfig);

router.post("/:id/slot", auth, ctrl.addIndustrySlot);
router.delete("/:configId/slot/:slotId", auth, ctrl.deleteIndustrySlot);

module.exports = router;
