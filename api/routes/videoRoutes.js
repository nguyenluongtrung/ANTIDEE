const express = require("express");
const { protect, restrict } = require("../middleware/accountMiddleware");
const {
  createVideo,
  getAllVideos,
  getVideo,
  deleteVideo,
  updateVideo,
} = require("../controllers/videoController");

const router = express.Router();

router
  .route("/")
  .post(protect, restrict("Admin"), createVideo)
  .get(getAllVideos);
router
  .route("/:videoId")
  .get(protect, restrict("Admin"), getVideo)
  .delete(protect, restrict("Admin"), deleteVideo)
  .patch(protect, restrict("Admin"), updateVideo);

module.exports = router;
