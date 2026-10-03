const express = require("express");
const router = express.Router();
const notificationsController = require("./notificationsController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.use(verifyToken);

router.get("/", notificationsController.getNotifications);
router.post("/", requireRole("hr", "admin"), notificationsController.createNotification);
router.patch("/read-all", notificationsController.markAllAsRead);
router.patch("/:id/read", notificationsController.markAsRead);
router.delete("/:id", notificationsController.deleteNotification);

module.exports = router;
