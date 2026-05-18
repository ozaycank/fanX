const prisma = require("../utils/prisma");
const { redisClient } = require("../utils/redis");

const CACHE_PREFIX = "global_feed_";

exports.clearFeedCache = async () => {
  try {
    const keys = await redisClient.keys(`${CACHE_PREFIX}*`);
    if (keys.length > 0) await redisClient.del(keys);
  } catch (err) {
    console.error("Redis temizleme hatası:", err);
  }
};

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

exports.createTweet = async (tweetData, authorId) => {
  const tweet = await prisma.tweet.create({
    data: {
      content: tweetData.content,
      sportCategory: tweetData.sportCategory,
      tags: tweetData.tags,
      authorId,
    },
    include: { author: { select: { username: true, displayName: true } } },
  });

  await this.clearFeedCache();
  return tweet;
};

exports.upvoteTweet = async (tweetId, userId) => {
  const updatedTweet = await prisma.tweet.update({
    where: { id: tweetId },
    data: {
      downvoters: { disconnect: { id: userId } },
      upvoters: { connect: { id: userId } },
    },
  });

  await this.clearFeedCache();
  return updatedTweet;
};

exports.downvoteTweet = async (tweetId, userId) => {
  const updatedTweet = await prisma.tweet.update({
    where: { id: tweetId },
    data: {
      upvoters: { disconnect: { id: userId } },
      downvoters: { connect: { id: userId } },
    },
  });

  await this.clearFeedCache();
  return updatedTweet;
};
