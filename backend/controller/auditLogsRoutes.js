const express = require("express");
const router = express.Router();
const auditLogsController = require("./auditLogsController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.use(verifyToken);
router.use(requireRole("admin"));

router.get("/", auditLogsController.getAuditLogs);

module.exports = router;
