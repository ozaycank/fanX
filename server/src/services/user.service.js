const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");
const { redisClient } = require("../utils/redis");

exports.getUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      username: true,
      displayName: true,
      profilePic: true,
      supportedTeam: true,
      createdAt: true,
    },
  });

  if (!user) {
    const error = new Error("Kullanıcı bulunamadı.");
    error.statusCode = 404;
    throw error; // Controller'daki asyncHandler bunu yakalayıp global error middleware'e iletecek
  }

  return user;
};

exports.updateProfile = async (userId, data) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      username: true,
      displayName: true,
      supportedTeam: true,
      profilePic: true,
    },
  });

  // Profil bilgileri değiştiği için feed cache'ini temizle
  try {
    const keys = await redisClient.keys("global_feed_*");
    if (keys.length > 0) await redisClient.del(keys);
  } catch (err) {
    console.error("Redis Hatası (User Service):", err);
  }

  return updatedUser;
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    const error = new Error("Kullanıcı bulunamadı.");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    const error = new Error("Eski parola hatalı.");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return true;
};
