const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  sendLoginOtp,
  verifyLoginOtp,
  getPendingApprovals,
  getAllEmployees,
  reviewSignup,
} = require("../controller/authController");

const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/send-login-otp", sendLoginOtp);
router.post("/verify-login-otp", verifyLoginOtp);

router.get("/pending-approvals", verifyToken, requireRole("hr", "admin"), getPendingApprovals);
router.get("/employees", verifyToken, requireRole("hr", "admin"), getAllEmployees);
router.post("/review/:id", verifyToken, requireRole("hr", "admin"), reviewSignup);

module.exports = router;