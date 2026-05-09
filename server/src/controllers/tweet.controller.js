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

exports.getFeed = async (req, res, next) => {
  try {
    const tweets = await tweetService.getTweets(req.query.sort);
    res.json(tweets);
  } catch (error) {
    next(error); // Hata middleware'ine gönder
  }
};

exports.createTweet = async (req, res, next) => {
  try {
    const { content, sportCategory, tags } = req.body;
    const tweet = await prisma.tweet.create({
      data: { content, sportCategory, tags, authorId: req.user.id },
      include: { author: { select: { username: true, displayName: true } } },
    });

    await tweetService.clearFeedCache();
    res.status(201).json(tweet);
  } catch (error) {
    next(error);
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
