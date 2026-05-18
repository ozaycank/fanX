const userService = require("../services/user.service");

exports.getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { displayName, supportedTeam, profilePic } = req.body;
    const userId = req.user.id;

    const updatedUser = await userService.updateProfile(userId, {
      displayName,
      supportedTeam,
      profilePic,
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    await userService.changePassword(userId, oldPassword, newPassword);

    res.json({ message: "Parolanız başarıyla güncellendi 🔒" });
  } catch (error) {
    // Service'den gelen kontrollü hataları (400 Bad Request) yakala
    if (error.status === 400 || error.status === 404) {
      return res.status(error.status).json({ error: error.message });
    }

    next(error);
  }
};
