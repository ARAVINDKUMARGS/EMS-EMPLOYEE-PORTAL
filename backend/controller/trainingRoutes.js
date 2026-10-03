const express = require("express");
const router = express.Router();
const trainingController = require("./trainingController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.use(verifyToken);

router.get("/courses", trainingController.getCourses);
router.get("/courses/:id", trainingController.getCourseDetails);
router.post("/enroll", trainingController.enrollCourse);
router.put("/progress", trainingController.updateProgress);
router.post("/course", requireRole("hr", "admin"), trainingController.createCourse);

module.exports = router;
