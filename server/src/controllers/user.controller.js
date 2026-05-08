const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { redisClient } = require("../utils/redis");
const prisma = new PrismaClient();

// Herhangi bir kullanıcıyı adına göre getir (Profil görüntüleme için)
exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
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

    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { displayName, supportedTeam, profilePic } = req.body;
    const userId = req.user.id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { displayName, supportedTeam, profilePic },
      select: {
        id: true,
        username: true,
        displayName: true,
        supportedTeam: true,
        profilePic: true,
      },
    });

    // Önemli: Cache temizleme (Önceki mesajda eklediğimiz mantık)
    try {
      const keys = await redisClient.keys("global_feed_*");
      if (keys.length > 0) await redisClient.del(keys);
    } catch (err) {
      console.error("Redis Hatası:", err);
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Profil güncellenemedi." });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) return res.status(400).json({ error: "Eski parola hatalı." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Parolanız başarıyla güncellendi 🔒" });
  } catch (error) {
    res.status(500).json({ error: "Parola güncellenemedi." });
  }
};
