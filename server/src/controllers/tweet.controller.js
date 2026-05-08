const { PrismaClient } = require("@prisma/client");
const { redisClient } = require("../utils/redis");
const prisma = new PrismaClient();

// Tüm feed cache'lerini temizleyen yardımcı fonksiyon
const clearAllFeedCache = async () => {
  try {
    const keys = await redisClient.keys("global_feed_*");
    if (keys.length > 0) await redisClient.del(keys);
  } catch (err) {
    console.error("Redis temizleme hatası:", err);
  }
};

exports.getFeed = async (req, res) => {
  try {
    const { sort } = req.query; // newest, up, down
    const cacheKey = `global_feed_${sort || "newest"}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return res.json(JSON.parse(cachedData));

    let orderBy = { createdAt: "desc" };
    if (sort === "up") orderBy = { upvoters: { _count: "desc" } };
    if (sort === "down") orderBy = { downvoters: { _count: "desc" } };

    const tweets = await prisma.tweet.findMany({
      orderBy,
      include: {
        author: {
          select: {
            username: true,
            displayName: true,
            profilePic: true,
            supportedTeam: true,
          },
        },
        _count: { select: { upvoters: true, downvoters: true } },
        upvoters: { select: { id: true } },
        downvoters: { select: { id: true } },
      },
    });

    await redisClient.setEx(cacheKey, 300, JSON.stringify(tweets));
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: "Feed yüklenemedi" });
  }
};

exports.createTweet = async (req, res) => {
  try {
    const { content, sportCategory, tags } = req.body;
    const tweet = await prisma.tweet.create({
      data: { content, sportCategory, tags, authorId: req.user.id },
      include: {
        author: {
          select: { username: true, displayName: true, profilePic: true },
        },
      },
    });

    await clearAllFeedCache(); // Cache temizlenmezse F5 atınca yeni tweet görünmez
    res.status(201).json(tweet);
  } catch (error) {
    res.status(500).json({ error: "Tweet atılamadı" });
  }
};

exports.upvoteTweet = async (req, res) => {
  try {
    const tweetId = parseInt(req.params.id);
    await prisma.tweet.update({
      where: { id: tweetId },
      data: {
        downvoters: { disconnect: { id: req.user.id } },
        upvoters: { connect: { id: req.user.id } },
      },
    });
    await clearAllFeedCache(); // Sıralamanın değişmesi için cache temizlenmeli
    res.json({ message: "Upvoted" });
  } catch (error) {
    res.status(500).json({ error: "Hata" });
  }
};

exports.downvoteTweet = async (req, res) => {
  try {
    const tweetId = parseInt(req.params.id);
    await prisma.tweet.update({
      where: { id: tweetId },
      data: {
        upvoters: { disconnect: { id: req.user.id } },
        downvoters: { connect: { id: req.user.id } },
      },
    });
    await clearAllFeedCache();
    res.json({ message: "Downvoted" });
  } catch (error) {
    res.status(500).json({ error: "Hata" });
  }
};
