const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// Profil Bilgilerini Güncelle
exports.updateProfile = async (req, res) => {
  try {
    const { displayName, supportedTeam, profilePic } = req.body;
    const userId = req.user.id; // auth.middleware'den geliyor

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { displayName, supportedTeam, profilePic },
      select: {
        id: true,
        username: true,
        displayName: true,
        supportedTeam: true,
        profilePic: true,
      }, // Şifreyi geri dönmemek için
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Profil güncellenemedi." });
  }
};

// Parola Güncelle
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Eski şifre doğru mu?
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(400).json({ error: "Eski parola hatalı." });
    }

    // Yeni şifreyi hashle ve kaydet
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
