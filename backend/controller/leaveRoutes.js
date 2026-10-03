const express = require("express");
const router = express.Router();

const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  reviewLeave,
} = require("../controller/leaveController");

const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.post("/apply", applyLeave);
router.get("/my/:employeeId", getMyLeaves);

router.get("/all", verifyToken, requireRole("hr", "admin"), getAllLeaves);
router.post("/review/:id", verifyToken, requireRole("hr", "admin"), reviewLeave);

module.exports = router;