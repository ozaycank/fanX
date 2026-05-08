const express = require("express");
const {
  createTweet,
  getFeed,
  upvoteTweet,
  downvoteTweet,
} = require("../controllers/tweet.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// Burası /api/tweets adresine gelen GET isteğini karşılar
router.get("/", getFeed);

// Diğer route'lar
router.post("/", protect, createTweet);
router.post("/:id/upvote", protect, upvoteTweet);
router.post("/:id/downvote", protect, downvoteTweet);

module.exports = router;
