const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");

exports.registerUser = async (username, email, password) => {
  // Prisma benzersizlik hatasına düşmeden önce manuel kontrol (Daha anlamlı hata mesajı için)
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existingUser) {
    const error = new Error("Bu email veya kullanıcı adı zaten kullanımda.");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });
};

exports.loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Hatalı email veya şifre ❌");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return { user, token };
};

exports.getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      supportedTeam: true,
      profilePic: true,
    },
  });

  if (!user) {
    const error = new Error("Kullanıcı bulunamadı.");
    error.statusCode = 404;
    throw error;
  }

  return user;
};
