const prisma = require("../utils/prisma");
const { redisClient } = require("../utils/redis");

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
  const keys = await redisClient.keys("global_feed_*");
  if (keys.length > 0) await redisClient.del(keys);

  return updatedUser;
};
