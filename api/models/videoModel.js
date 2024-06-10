const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    url: {
      type: String,
    },
    description: {
      type: String,
    },
    videoAccounts: [
      {
        isCompleted: {
          type: Boolean,
          default: false,
        },
        accountId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
