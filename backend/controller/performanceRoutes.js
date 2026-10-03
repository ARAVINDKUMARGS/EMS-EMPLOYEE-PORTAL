const express = require("express");
const router = express.Router();
const performanceController = require("./performanceController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.use(verifyToken);

router.get("/my", performanceController.getMyPerformance);
router.get("/all", requireRole("hr", "admin"), performanceController.getAllPerformance);
router.post("/review", requireRole("hr", "admin"), performanceController.createReview);
router.post("/goal", performanceController.createGoal);
router.put("/goal/:id", performanceController.updateGoal);

module.exports = router;
