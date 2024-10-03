const mongoose = require("mongoose");

const replySchema = mongoose.Schema(
  {
    content: {
      type: String,
      maxLength: 255,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  {
    timestamps: true,
  }
);

const domesticHelperFeedbackSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Account",
    },
    domesticHelperId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Account",
    },
    jobPostId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "JobPost",
    },
    rating: {
      type: Number,
      required: true,
      default: 5.0,
    },
    content: {
      type: String,
      maxLength: 255,
    },
    feedbackFrom:{
      type:String,
      enum:["Khách hàng","Người giúp việc"],
      required:true,
    },
    reply: [replySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DomesticHelperFeedback",
  domesticHelperFeedbackSchema
);
