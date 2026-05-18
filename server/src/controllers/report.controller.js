const reportService = require("../services/report.service");

exports.createReport = async (req, res, next) => {
  try {
    const { tweetId, reason } = req.body;
    const reporterId = req.user.id;

    const report = await reportService.createReport(
      tweetId,
      reporterId,
      reason,
    );

    res.status(201).json({ message: "Bildirim başarıyla alındı.", report });
  } catch (error) {
    // Prisma benzersizlik kısıtlaması hatası (P2002) kontrolü
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Bu gönderiyi zaten bildirdiniz." });
    }

    // Diğer beklenmedik sunucu hatalarını merkezi hata middleware'ine ilet
    error.statusCode = 500;
    error.message = "Bildirim gönderilemedi.";
    next(error);
  }
};
