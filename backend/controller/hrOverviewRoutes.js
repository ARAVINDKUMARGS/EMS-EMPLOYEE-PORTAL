const express = require("express");
const router = express.Router();

const {
  summary,
  attendanceByDepartment,
  headcountByDepartment,
  pendingLeaves,
} = require("../controller/hrOverviewController");

const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.use(verifyToken, requireRole("hr", "admin"));

router.get("/summary", summary);
router.get("/attendance-by-department", attendanceByDepartment);
router.get("/headcount-by-department", headcountByDepartment);
router.get("/pending-leaves", pendingLeaves);

module.exports = router;