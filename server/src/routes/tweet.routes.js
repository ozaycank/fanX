const express = require("express");
const { createTweet } = require("../controllers/tweet.controller.js");
const { protect } = require("../middlewares/auth.middleware.js");
const router = express.Router();

// Sadece giriş yapmış kullanıcılar tweet atabilir
router.post("/", protect, createTweet);

module.exports = router;
