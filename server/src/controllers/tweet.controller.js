const { PrismaClient } = require("@prisma/client");
const { redisClient } = require("../utils/redis");

const prisma = new PrismaClient();

exports.createTweet = async (req, res) => {
  try {
    const { content, sportCategory, tags } = req.body;
    const authorId = req.user.id; // Middleware'den geliyor

    // 1. Tweet'i veritabanına kaydet
    const tweet = await prisma.tweet.create({
      data: { content, sportCategory, tags, authorId },
      include: { author: { select: { username: true } } },
    });

    // 2. Cache'i temizle (Basit yöntem: Genel feed cache'ini sileriz ki güncellensin)
    await redisClient.del("global_feed");

    res.status(201).json(tweet);
  } catch (error) {
    res.status(500).json({ error: "Tweet atılamadı 🚫" });
  }
};
