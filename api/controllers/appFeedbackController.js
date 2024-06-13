const AppFeedback = require("../models/appFeedbackModel");

const getAllAppFeedbacks = async (req, res) => {
  try {
    const appFeedbacks = await AppFeedback.find({});
    res.status(200).json({
      success: true,
      data: { appFeedbacks },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const createAppFeedback = async (req, res) => {
  try {
    const appFeedback = await AppFeedback.create(req.body);
    res.status(201).json({
      success: true,
      data: {appFeedback},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const replyToAppFeedback = async (req, res) => {
  const appFeedback = await AppFeedback.findById(req.params.appFeedbackId);

  if (!appFeedback) {
    return res.status(404).json({
      success: false,
      error: "Feedback not found",
    });
  }
  appFeedback.reply.push(req.body);
  await appFeedback.save();

  res.status(200).json({
    success: true,
    data: {
      appFeedback,
    },
  });

};

const getAppFeedbackById = async (req, res) => {
  try {
    const appFeedback = await AppFeedback.findById(req.params.appFeedbackId);
    if (!appFeedback) {
      return res.status(404).json({
        success: false,
        error: "Feedback not found",
      });
    }
    res.status(200).json({
      success: true,
      data: appFeedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteAppFeedback = async (req, res) => {
  try {
    const appFeedback = await AppFeedback.findByIdAndDelete(req.params.appFeedbackId);

    if (!appFeedback) {
      return res.status(404).json({
        success: false,
        error: "Feedback not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        id: req.params.appFeedbackId,
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
  getAllAppFeedbacks,
  createAppFeedback,
  deleteAppFeedback,
  getAppFeedbackById,
  replyToAppFeedback,

};