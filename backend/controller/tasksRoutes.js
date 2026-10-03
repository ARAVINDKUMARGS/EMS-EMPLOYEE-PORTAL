const express = require("express");
const router = express.Router();
const tasksController = require("./tasksController");
const { verifyToken } = require("../middleware/authMiddleware");

router.use(verifyToken);

router.get("/", tasksController.getTasks);
router.post("/", tasksController.createTask);
router.put("/:id", tasksController.updateTask);
router.patch("/:id/toggle", tasksController.toggleTaskComplete);
router.delete("/:id", tasksController.deleteTask);

module.exports = router;
