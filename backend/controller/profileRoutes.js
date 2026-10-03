const express = require("express");
const router = express.Router();

const {
  getProfile,
  updatePersonal,
  updateEmployment,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getEmergencyContacts,
  saveEmergencyContacts,
} = require("../controller/profileController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/:employeeId", verifyToken, getProfile);
router.put("/:employeeId/personal", verifyToken, updatePersonal);
router.put("/:employeeId/employment", verifyToken, updateEmployment);

router.get("/:employeeId/skills", verifyToken, getSkills);
router.post("/:employeeId/skills", verifyToken, addSkill);
router.put("/:employeeId/skills/:skillId", verifyToken, updateSkill);
router.delete("/:employeeId/skills/:skillId", verifyToken, deleteSkill);

router.get("/:employeeId/emergency", verifyToken, getEmergencyContacts);
router.put("/:employeeId/emergency", verifyToken, saveEmergencyContacts);

module.exports = router;