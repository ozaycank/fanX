const router = require("express").Router();
const prisma = require("../utils/prisma");
const auth = require("../middleware/auth.middleware.js");

// İki kullanıcı arasındaki mesajları getir (Gizlilik burada sağlanır)
router.get("/:receiverId", auth, async (req, res) => {
  const senderId = req.user.id;
  const receiverId = parseInt(req.params.receiverId);

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Mesajlar yüklenemedi." });
  }
});

// Yeni mesaj gönder
router.post("/", auth, async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.id; // Token'dan gelir, manipüle edilemez.

  try {
    const message = await prisma.message.create({
      data: { content, senderId, receiverId: parseInt(receiverId) },
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Mesaj gönderilemedi." });
  }
});

module.exports = router;
