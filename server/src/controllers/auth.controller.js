const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    res
      .status(201)
      .json({ message: "Kullanıcı başarıyla oluşturuldu ⚽", userId: user.id });
  } catch (error) {
    res.status(400).json({
      error: "Kayıt başarısız. Kullanıcı adı veya email alınmış olabilir.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Hatalı email veya şifre ❌" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: "Giriş işlemi sırasında bir hata oluştu." });
  }
};
// Diğer fonksiyonların yanına ekleyin
exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        supportedTeam: true,
        profilePic: true,
      },
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Kullanıcı bilgisi alınamadı." });
  }
};
