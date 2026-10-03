require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const attendanceRoutes = require("./controller/attendanceRoutes");
const authRoutes = require("./controller/authRoutes");
const leaveRoutes = require("./controller/leaveRoutes");
const hrOverviewRoutes = require("./controller/hrOverviewRoutes");
const departmentsRoutes = require("./controller/departmentsRoutes");
const profileRoutes = require("./controller/profileRoutes");
const documentsRoutes = require("./controller/documentsRoutes");
const tasksRoutes = require("./controller/tasksRoutes");
const payrollRoutes = require("./controller/payrollRoutes");
const performanceRoutes = require("./controller/performanceRoutes");
const trainingRoutes = require("./controller/trainingRoutes");
const notificationsRoutes = require("./controller/notificationsRoutes");
const chatRoutes = require("./controller/chatRoutes");
const recruitmentRoutes = require("./controller/recruitmentRoutes");
const dashboardRoutes = require("./controller/dashboardRoutes");
const auditLogsRoutes = require("./controller/auditLogsRoutes");
const settingsRoutes = require("./controller/settingsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount API routes
const router = express.Router();
router.use("/attendance", attendanceRoutes);
router.use("/auth", authRoutes);
router.use("/leave", leaveRoutes);
router.use("/hr-overview", hrOverviewRoutes);
router.use("/departments", departmentsRoutes);
router.use("/profile", profileRoutes);
router.use("/documents", documentsRoutes);
router.use("/tasks", tasksRoutes);
router.use("/payroll", payrollRoutes);
router.use("/performance", performanceRoutes);
router.use("/training", trainingRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/chat", chatRoutes);
router.use("/recruitment", recruitmentRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/audit-logs", auditLogsRoutes);
router.use("/settings", settingsRoutes);

// Mount router under both root and /api for full compatibility
app.use("/api", router);
app.use(router);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "Nexus HR Backend API", timestamp: new Date() });
});

// Global error handling middleware for serverless safety
app.use((err, req, res, next) => {
  console.error("Express Error Handler caught:", err);
  res.status(500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
  });
}

module.exports = app;