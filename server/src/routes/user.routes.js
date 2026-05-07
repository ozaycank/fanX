const express = require("express");
const {
  updateProfile,
  changePassword,
} = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");
const router = express.Router();

router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

module.exports = router;
