const express = require("express");
const {
  updateProfile,
  changePassword,
  getUserByUsername,
} = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  updateProfileSchema,
  changePasswordSchema,
} = require("../validations/user.validation");

const router = express.Router();

router.put("/profile", protect, validate(updateProfileSchema), updateProfile);
router.put(
  "/password",
  protect,
  validate(changePasswordSchema),
  changePassword,
);
router.get("/:username", getUserByUsername); // Herkes görüntüleyebilir, protect yok

module.exports = router;
