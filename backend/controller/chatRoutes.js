const express = require("express");
const router = express.Router();
const chatController = require("./chatController");
const { verifyToken } = require("../middleware/authMiddleware");

router.use(verifyToken);

router.get("/contacts", chatController.getContacts);
router.get("/messages/:contactId", chatController.getMessages);
router.post("/message", chatController.sendMessage);
router.delete("/conversation/:contactId", chatController.clearConversation);

module.exports = router;
