const express = require("express");
const { getGlobalFeed } = require("../controllers/feed.controller.js");
const router = express.Router();

router.get("/", getGlobalFeed);

module.exports = router;
