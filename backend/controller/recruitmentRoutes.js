const express = require("express");
const router = express.Router();
const recruitmentController = require("./recruitmentController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.use(verifyToken);

router.get("/jobs", recruitmentController.getJobs);
router.get("/job/:id", recruitmentController.getJobDetails);
router.post("/job", requireRole("hr", "admin"), recruitmentController.createJob);
router.get("/candidates", recruitmentController.getCandidates);
router.get("/candidate/:id", recruitmentController.getCandidateDetails);
router.put("/application/stage", requireRole("hr", "admin"), recruitmentController.updateStage);
router.post("/interview", requireRole("hr", "admin"), recruitmentController.scheduleInterview);

module.exports = router;
