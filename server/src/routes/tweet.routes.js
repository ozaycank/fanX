const express = require("express");
const { createTweet } = require("../controllers/tweet.controller.js");
const { protect } = require("../middlewares/auth.middleware.js");
const router = express.Router();
const {
  upvoteTweet,
  downvoteTweet,
} = require("../controllers/tweet.controller");

// Sadece giriş yapmış kullanıcılar tweet atabilir
router.post("/", protect, createTweet);
router.post("/:id/upvote", protect, upvoteTweet);
router.post("/:id/downvote", protect, downvoteTweet);

module.exports = router;
