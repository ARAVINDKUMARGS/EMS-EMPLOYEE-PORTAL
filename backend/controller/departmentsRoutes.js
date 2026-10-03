const express = require("express");
const router = express.Router();

const {
  getAllDepartments,
  createDepartment,
  updateDepartment,
} = require("../controller/departmentsController");

const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.get("/", verifyToken, requireRole("hr", "admin"), getAllDepartments);
router.post("/", verifyToken, requireRole("hr", "admin"), createDepartment);
router.put("/:id", verifyToken, requireRole("hr", "admin"), updateDepartment);

module.exports = router;