const { PrismaClient } = require("@prisma/client");
const { redisClient } = require("../utils/redis");

const prisma = new PrismaClient();

// Yardımcı Fonksiyon: Tüm feed cache'lerini temizle
const clearFeedCache = async () => {
  try {
    const keys = ["global_feed_newest", "global_feed_up", "global_feed_down"];
    await redisClient.del(keys);
  } catch (err) {
    console.error(
      "Redis temizleme hatası (Önemli değil, sistem çalışır):",
      err,
    );
  }
};

exports.createTweet = async (req, res) => {
  try {
    const { content, sportCategory, tags } = req.body;
    const authorId = req.user.id;

    const tweet = await prisma.tweet.create({
      data: {
        content,
        sportCategory: sportCategory || null,
        tags: tags || null,
        authorId,
      },
      include: {
        author: {
          select: {
            username: true,
            displayName: true,
            profilePic: true,
            supportedTeam: true,
          },
        },
        upvoters: { select: { id: true } },
        downvoters: { select: { id: true } },
      },
    });

    // Yeni tweet atıldığında tüm sıralama cache'lerini geçersiz kıl
    await clearFeedCache();

    res.status(201).json(tweet);
  } catch (error) {
    console.error("CREATE TWEET HATASI:", error);
    res.status(500).json({ error: "Tweet atılamadı 🚫" });
  }
};

exports.upvoteTweet = async (req, res) => {
  try {
    const tweetId = parseInt(req.params.id);
    const userId = req.user.id;

    const updatedTweet = await prisma.tweet.update({
      where: { id: tweetId },
      data: {
        downvoters: { disconnect: { id: userId } },
        upvoters: { connect: { id: userId } },
      },
      include: { upvoters: true, downvoters: true },
    });

    // Oylama değişince sıralama değişebileceği için cache'i temizle
    await clearFeedCache();

    res.json({
      message: "Upvoted",
      upvotes: updatedTweet.upvoters.length,
      downvotes: updatedTweet.downvoters.length,
    });
  } catch (error) {
    res.status(500).json({ error: "İşlem başarısız" });
  }
};

exports.downvoteTweet = async (req, res) => {
  try {
    const tweetId = parseInt(req.params.id);
    const userId = req.user.id;

    const updatedTweet = await prisma.tweet.update({
      where: { id: tweetId },
      data: {
        upvoters: { disconnect: { id: userId } },
        downvoters: { connect: { id: userId } },
      },
      include: { upvoters: true, downvoters: true },
    });

    await clearFeedCache();

    res.json({
      message: "Downvoted",
      upvotes: updatedTweet.upvoters.length,
      downvotes: updatedTweet.downvoters.length,
    });
  } catch (error) {
    res.status(500).json({ error: "İşlem başarısız" });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const { sort } = req.query;
    const cacheKey = `global_feed_${sort || "newest"}`;

    // Redis bağlantısı varsa cache'e bak
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) return res.json(JSON.parse(cachedData));
    } catch (redisErr) {
      console.log("Redis meşgul veya kapalı, DB'den devam ediliyor...");
    }

    let orderByClause = { createdAt: "desc" };

    if (sort === "up") {
      orderByClause = { upvoters: { _count: "desc" } };
    } else if (sort === "down") {
      orderByClause = { downvoters: { _count: "desc" } };
    }

    const tweets = await prisma.tweet.findMany({
      orderBy: orderByClause,
      include: {
        author: {
          select: {
            username: true,
            displayName: true,
            profilePic: true,
            supportedTeam: true,
          },
        },
        upvoters: { select: { id: true } },
        downvoters: { select: { id: true } },
      },
    });

    // Cache'e yaz (Redis hatası ihtimaline karşı try-catch içinde)
    try {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(tweets));
    } catch (e) {}

    res.json(tweets);
  } catch (error) {
    console.error("GET FEED HATASI:", error);
    res.status(500).json({ error: "Akış yüklenemedi 🚫" });
  }
};
