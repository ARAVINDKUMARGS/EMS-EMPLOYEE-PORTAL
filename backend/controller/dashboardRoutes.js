const express = require("express");
const router = express.Router();
const dashboardController = require("./dashboardController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.use(verifyToken);

router.get("/employee", dashboardController.getEmployeeDashboard);
router.get("/analytics", requireRole("admin"), dashboardController.getAdminAnalytics);

module.exports = router;
