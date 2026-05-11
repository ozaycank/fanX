const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await authService.registerUser(username, email, password);

    res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu ⚽",
      userId: user.id,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);

    if (!user) {
      const error = new Error("Hatalı email veya şifre ❌");
      error.statusCode = 401;
      throw error;
    }

    const token = authService.generateToken(user);

    res.json({
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
