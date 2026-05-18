const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const {
  getDashboard,
  resolveReport,
  deleteTweet,
} = require("../controllers/admin.controller");

const router = express.Router();

// Not: İleride yetkilendirme eklendiğinde buraya protect middleware'inin yanına
// const { adminGuard } = require("../middlewares/admin.middleware"); eklenebilir.
router.get("/dashboard", protect, getDashboard);
router.patch("/reports/:id/resolve", protect, resolveReport);
router.delete("/tweets/:id", protect, deleteTweet);

module.exports = router;
