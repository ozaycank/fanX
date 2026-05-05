const jwt = require("jsonwebtoken");

// Kullanıcının giriş yapıp yapmadığını kontrol eden koruyucu (guard) middleware
const protect = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // "Bearer TOKEN" formatı

  if (!token) {
    return res.status(401).json({ message: "Yetkisiz erişim, token eksik." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Token geçerliyse user id'sini request nesnesine ekle
    next();
  } catch (error) {
    res.status(401).json({ message: "Geçersiz token." });
  }
};

module.exports = { protect };
