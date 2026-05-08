const express = require("express");
const {
  updateProfile,
  changePassword,
  getUserByUsername,
} = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");
const router = express.Router();

router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);
router.get("/:username", getUserByUsername);

module.exports = router;
