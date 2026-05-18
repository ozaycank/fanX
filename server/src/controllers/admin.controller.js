const adminService = require("../services/admin.service");
const asyncHandler = require("../utils/asyncHandler"); // Global utility kullanımı

exports.getDashboard = asyncHandler(async (req, res) => {
  const data = await adminService.getDashboardData();
  res.json({ success: true, data });
});

exports.resolveReport = asyncHandler(async (req, res) => {
  const reportId = parseInt(req.params.id);

  if (isNaN(reportId)) {
    const error = new Error("Geçersiz rapor ID'si.");
    error.statusCode = 400;
    throw error;
  }

  await adminService.updateReportStatus(reportId, "INCELENDI");
  res.json({ success: true, message: "Şikayet incelendi olarak işaretlendi." });
});

exports.deleteTweet = asyncHandler(async (req, res) => {
  const tweetId = parseInt(req.params.id);

  if (isNaN(tweetId)) {
    const error = new Error("Geçersiz tweet ID'si.");
    error.statusCode = 400;
    throw error;
  }

  await adminService.deleteReportedTweet(tweetId);
  res.json({ success: true, message: "Tweet ve ilgili şikayetler silindi." });
});
