const prisma = require("../utils/prisma");

const getMessages = async (req, res) => {
  const senderId = req.user.id;
  const receiverId = parseInt(req.params.receiverId);

  if (isNaN(receiverId)) {
    return res.status(400).json({ error: "Geçersiz kullanıcı ID." });
  }

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
};

const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.id;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Mesaj içeriği boş olamaz." });
  }

  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId: parseInt(receiverId),
      },
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Mesaj gönderilemedi." });
  }
};

module.exports = { getMessages, sendMessage };

const getConversations = async (req, res) => {
  const userId = req.user.id;

  try {
    // Kullanıcının dahil olduğu tüm mesajları çekiyoruz
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profilePic: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profilePic: true,
          },
        },
      },
    });

    // Mesajları karşı tarafa göre gruplayıp her konuşmanın sadece son mesajını tutuyoruz
    const conversationsMap = new Map();

    messages.forEach((msg) => {
      // Karşı taraftaki kullanıcının bilgilerini seç
      const chatPartner = msg.senderId === userId ? msg.receiver : msg.sender;

      if (!conversationsMap.has(chatPartner.id)) {
        conversationsMap.set(chatPartner.id, {
          id: chatPartner.id,
          username: chatPartner.username,
          displayName: chatPartner.displayName,
          profilePic: chatPartner.profilePic,
          lastMessage: msg.content,
          createdAt: msg.createdAt,
        });
      }
    });

    res.json(Array.from(conversationsMap.values()));
  } catch (err) {
    res.status(500).json({ error: "Konuşmalar yüklenemedi." });
  }
};

module.exports = { getMessages, sendMessage, getConversations };
