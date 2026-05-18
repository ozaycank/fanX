const express = require("express");
const { createFeedback } = require("../controllers/feedback.controller");

const router = express.Router();

router.post("/", createFeedback);

module.exports = router;
 