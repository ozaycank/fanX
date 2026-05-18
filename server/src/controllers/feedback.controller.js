const feedbackService = require("../services/feedback.service");

exports.createFeedback = async (req, res, next) => {
  try {
    const { content, userId } = req.body;

    const feedback = await feedbackService.createFeedback(content, userId);

    res.status(201).json(feedback);
  } catch (error) {
    error.statusCode = 500;
    error.message = "Mesaj iletilemedi.";
    next(error);
  }
};
