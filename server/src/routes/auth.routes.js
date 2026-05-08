const express = require("express");
const { register, login, getMe } = require("../controllers/auth.controller.js");
const { protect } = require("../middlewares/auth.middleware"); // Token koruması
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
