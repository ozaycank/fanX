const { PrismaClient } = require("@prisma/client");
const { redisClient } = require("../utils/redis");

const prisma = new PrismaClient();

exports.getGlobalFeed = async (req, res) => {
  try {
    // 1. Önce Redis Cache'e bak
    const cachedFeed = await redisClient.get("global_feed");
    if (cachedFeed) {
      return res.json(JSON.parse(cachedFeed)); // Cache'te varsa hemen dön (O(1) hızında)
    }

    // 2. Cache'te yoksa DB'den son 50 spor tweetini çek
    const tweets = await prisma.tweet.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { author: { select: { username: true } } },
    });

    // 3. Sonucu Redis'e kaydet (10 dakika süreyle)
    await redisClient.setEx("global_feed", 600, JSON.stringify(tweets));

    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: "Feed yüklenemedi." });
  }
};
