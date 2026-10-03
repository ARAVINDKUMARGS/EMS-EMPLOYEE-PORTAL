const express = require("express");
const router = express.Router();
const payrollController = require("./payrollController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.use(verifyToken);

router.get("/my", payrollController.getMyPayroll);
router.get("/admin", requireRole("hr", "admin"), payrollController.getAdminPayroll);
router.post("/run", requireRole("hr", "admin"), payrollController.runPayroll);

module.exports = router;
