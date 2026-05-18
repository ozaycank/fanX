const prisma = require("../utils/prisma");

exports.createFeedback = async (content, userId) => {
  return await prisma.feedback.create({
    data: {
      content,
      userId: userId ? parseInt(userId) : null,
    },
  });
};
