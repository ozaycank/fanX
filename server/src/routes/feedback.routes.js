const router = require("express").Router();
const prisma = require("../utils/prisma");

router.post("/", async (req, res) => {
  const { content, userId } = req.body;
  try {
    const feedback = await prisma.feedback.create({
      data: { content, userId: userId || null },
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: "Mesaj iletilemedi." });
  }
});

module.exports = router;
