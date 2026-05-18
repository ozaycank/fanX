const userService = require("../services/user.service");
const asyncHandler = require("../utils/asyncHandler");

exports.getUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await userService.getUserByUsername(username);

  res.json({ success: true, user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { displayName, supportedTeam, profilePic } = req.body;
  const userId = req.user.id;

  const updatedUser = await userService.updateProfile(userId, {
    displayName,
    supportedTeam,
    profilePic,
  });

  res.json({ success: true, user: updatedUser });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  await userService.changePassword(userId, oldPassword, newPassword);

  res.json({ success: true, message: "Parolanız başarıyla güncellendi 🔒" });
});
