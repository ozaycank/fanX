const prisma = require("../utils/prisma");

exports.createReport = async (tweetId, reporterId, reason) => {
  return await prisma.report.create({
    data: {
      tweetId: parseInt(tweetId),
      reporterId,
      reason,
    },
  });
};
