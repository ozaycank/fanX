const prisma = require("../utils/prisma");
const { redisClient } = require("../utils/redis");

const CACHE_PREFIX = "global_feed_";

exports.getTweets = async (sort) => {
  const cacheKey = `${CACHE_PREFIX}${sort || "newest"}`;

  // Cache kontrolü
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) return JSON.parse(cachedData);

  // DB Sorgusu
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

  // Cache'le (5 dakika)
  await redisClient.setEx(cacheKey, 300, JSON.stringify(tweets));
  return tweets;
};

exports.clearFeedCache = async () => {
  const keys = await redisClient.keys(`${CACHE_PREFIX}*`);
  if (keys.length > 0) await redisClient.del(keys);
};

// upvote/downvote mantığını da buraya taşıyabilirsin...
