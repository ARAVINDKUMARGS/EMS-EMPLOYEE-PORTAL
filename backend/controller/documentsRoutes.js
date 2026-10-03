const express = require("express");
const router = express.Router();

const {
  uploadDocument,
  getMyDocuments,
  getDocumentsForEmployee,
  deleteDocument,
} = require("../controller/documentsController");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("", verifyToken, getMyDocuments);
router.get("/employee/:employeeId", verifyToken, getDocumentsForEmployee);
router.post("", verifyToken, upload.single("file"), uploadDocument);
router.delete("/:id", verifyToken, deleteDocument);

module.exports = router;