const express = require("express");
const router = express.Router();
const settingsController = require("./settingsController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.use(verifyToken);
router.use(requireRole("admin"));

router.get("/", settingsController.getSettings);
router.post("/", settingsController.saveSettings);

module.exports = router;
