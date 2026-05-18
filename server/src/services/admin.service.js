const prisma = require("../utils/prisma");
const { redisClient } = require("../utils/redis");

exports.getDashboardData = async () => {
  // Prisma $transaction ile tüm sorguları paralel (Promise.all mantığıyla) çalıştırıp hızı artırıyoruz
  const [
    userCount,
    tweetCount,
    feedbackCount,
    pendingReports,
    recentFeedbacks,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.tweet.count(),
    prisma.feedback.count(),
    prisma.report.findMany({
      where: { status: "BEKLIYOR" },
      include: {
        tweet: {
          select: {
            id: true,
            content: true,
            author: { select: { username: true, displayName: true } },
          },
        },
        reporter: {
          select: { username: true, displayName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 20, // Arayüzü yormamak için son 20 geri bildirimi alıyoruz
    }),
  ]);

  return {
    stats: {
      userCount,
      tweetCount,
      feedbackCount,
      pendingReportCount: pendingReports.length,
    },
    pendingReports,
    recentFeedbacks,
  };
};

exports.updateReportStatus = async (reportId, status) => {
  return await prisma.report.update({
    where: { id: reportId },
    data: { status },
  });
};

exports.deleteReportedTweet = async (tweetId) => {
  // Yabancı anahtar (Foreign Key) kısıtlamasına takılmamak için önce raporları, sonra tweeti siliyoruz
  await prisma.$transaction([
    prisma.report.deleteMany({ where: { tweetId } }),
    prisma.tweet.delete({ where: { id: tweetId } }),
  ]);

  // Tweet silindiği için global akış önbelleğini (Redis) temizliyoruz
  try {
    const keys = await redisClient.keys("global_feed_*");
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error("Redis Cache Temizleme Hatası (Admin):", err);
  }
};
