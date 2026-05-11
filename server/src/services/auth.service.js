const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");

exports.registerUser = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });
};

exports.loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
};

exports.generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
};

exports.getUserById = async (id) => {
  return await prisma.user.findUnique({
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
};
