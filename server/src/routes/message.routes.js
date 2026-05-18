const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  getMessages,
  sendMessage,
  getConversations,
} = require("../controllers/message.controller");

const router = express.Router();

router.get("/", protect, getConversations);
router.get("/:receiverId", protect, getMessages);
router.post("/", protect, sendMessage);

module.exports = router;
