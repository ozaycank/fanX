const messageService = require("../services/message.service");

exports.getMessages = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const receiverId = parseInt(req.params.receiverId);

    if (isNaN(receiverId)) {
      return res.status(400).json({ error: "Geçersiz kullanıcı ID." });
    }

    const messages = await messageService.getChatMessages(senderId, receiverId);
    res.json(messages);
  } catch (error) {
    error.statusCode = 500;
    error.message = "Mesajlar yüklenemedi.";
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Mesaj içeriği boş olamaz." });
    }

    const parsedReceiverId = parseInt(receiverId);
    if (isNaN(parsedReceiverId)) {
      return res.status(400).json({ error: "Geçersiz alıcı ID." });
    }

    const message = await messageService.createMessage(
      senderId,
      parsedReceiverId,
      content,
    );
    res.status(201).json(message);
  } catch (error) {
    error.statusCode = 500;
    error.message = "Mesaj gönderilemedi.";
    next(error);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const conversations = await messageService.getUserConversations(userId);
    res.json(conversations);
  } catch (error) {
    error.statusCode = 500;
    error.message = "Konuşmalar yüklenemedi.";
    next(error);
  }
};
