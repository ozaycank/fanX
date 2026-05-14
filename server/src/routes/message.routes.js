// src/routes/message.routes.js
const router = require("express").Router();
const { protect } = require("../middlewares/auth.middleware");
const {
  getMessages,
  sendMessage,
  getConversations,
} = require("../controllers/message.controller");

router.get("/", protect, getConversations); // Konuşma listesi rotası
router.get("/:receiverId", protect, getMessages);
router.post("/", protect, sendMessage);

module.exports = router;
