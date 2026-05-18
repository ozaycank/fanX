const express = require("express");
const { register, login, getMe } = require("../controllers/auth.controller.js");
const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

const router = express.Router();

// İstekler controller'a gitmeden önce validate middleware'inde doğrulanır
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);

module.exports = router;
