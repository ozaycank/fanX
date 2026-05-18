const prisma = require("../utils/prisma");

exports.getChatMessages = async (senderId, receiverId) => {
  return await prisma.message.findMany({
    where: {
      OR: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });
};

exports.createMessage = async (senderId, receiverId, content) => {
  return await prisma.message.create({
    data: {
      content,
      senderId,
      receiverId,
    },
  });
};

exports.getUserConversations = async (userId) => {
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

  const conversationsMap = new Map();

  messages.forEach((msg) => {
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

  return Array.from(conversationsMap.values());
};
