const express = require("express");
const {
  protect,
  restrict,
  restrictToOwner,
} = require("../middleware/accountMiddleware");
const {
  getAllForumPosts,
  createForumPost,
  updateForumPost,
  deleteForumPost,
  getForumPost,
  saveForumPost,
  getForumRepositories,
  hideForumPost,
  unhideForumPost,
  commentForumPost,
} = require("../controllers/forumPostController");
const router = express.Router();

router.route("/").get(protect, getAllForumPosts).post(protect, createForumPost);
router.route("/repositories").get(protect, getForumRepositories);
router
  .route("/:forumPostId")
  .get(getForumPost)
  .patch(protect, restrictToOwner, updateForumPost)
  .delete(protect, restrictToOwner, deleteForumPost);

router.route("/comment/:forumPostId").post(protect, commentForumPost);
router.route("/save-forum-post/:forumPostId").post(protect, saveForumPost);
router.route("/:forumPostId/hide").patch(protect, hideForumPost);

router.patch("/:forumPostId/unhide", protect, unhideForumPost);
module.exports = router;
