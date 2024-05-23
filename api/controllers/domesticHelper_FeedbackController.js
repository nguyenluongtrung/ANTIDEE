const DomesticHelperFeedback = require("../models/domesticHelper_FeedbackModel");

const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await DomesticHelperFeedback.find({});
    res.status(200).json({
      success: true,
      data: { feedbacks },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const createFeedback = async (req, res) => {
  try {
    const feedback = await DomesticHelperFeedback.create(req.body);
    res.status(201).json({
      success: true,
      data: {feedback},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const replyToFeedback = async (req, res) => {
  const feedback = await DomesticHelperFeedback.findById(req.params.feedbackId);

  if (!feedback) {
    return res.status(404).json({
      success: false,
      error: "Feedback not found",
    });
  }
  feedback.reply.push(req.body);
  await feedback.save();

  res.status(200).json({
    success: true,
    data: {
      feedback,
    },
  });

};

const getFeedbackById = async (req, res) => {
  try {
    const feedback = await DomesticHelperFeedback.findById(req.params.feedbackId);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: "Feedback not found",
      });
    }
    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const feedback = await DomesticHelperFeedback.findByIdAndDelete(req.params.feedbackId);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: "Feedback not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        id: req.params.feedbackId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  getAllFeedbacks,
  createFeedback,
  deleteFeedback,
  getFeedbackById,
  replyToFeedback,

};