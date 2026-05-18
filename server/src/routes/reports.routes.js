const express = require("express");
const { createReport } = require("../controllers/report.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", protect, createReport);

module.exports = router;
