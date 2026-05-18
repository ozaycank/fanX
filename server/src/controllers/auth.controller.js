const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

// asyncHandler sayesinde try-catch blokları temizlendi
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await authService.registerUser(username, email, password);

  res.status(201).json({
    success: true,
    message: "Kullanıcı başarıyla oluşturuldu ⚽",
    userId: user.id,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);

  res.json({
    success: true,
    token,
    user: { id: user.id, username: user.username },
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.id);
  res.json({ success: true, user });
});
