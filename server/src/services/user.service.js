const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");
const { redisClient } = require("../utils/redis");

exports.getUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username },
    select: {
      username: true,
      displayName: true,
      profilePic: true,
      supportedTeam: true,
      createdAt: true,
    },
  });
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
    console.error("Redis Hatası:", err);
  }

  return updatedUser;
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw { status: 404, message: "Kullanıcı bulunamadı." };
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw { status: 400, message: "Eski parola hatalı." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return true;
};
