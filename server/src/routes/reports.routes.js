const router = require("express").Router();
const prisma = require("../utils/prisma");
const { protect } = require("../middlewares/auth.middleware");

router.post("/", protect, async (req, res) => {
  const { tweetId, reason } = req.body;
  const reporterId = req.user.id;

  try {
    const report = await prisma.report.create({
      data: {
        tweetId: parseInt(tweetId),
        reporterId,
        reason,
      },
    });
    res.status(201).json({ message: "Bildirim başarıyla alındı.", report });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ error: "Bu gönderiyi zaten bildirdiniz." });
    }
    res.status(500).json({ error: "Bildirim gönderilemedi." });
  }
});

module.exports = router;
