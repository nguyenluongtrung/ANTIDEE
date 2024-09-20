const express = require("express");
const { protect, restrict } = require("../middleware/accountMiddleware");
const {
  createLesson,
  getAllLessons,
  getLesson,
  deleteLesson,
  updateLesson,
} = require("../controllers/lessonController");

const router = express.Router();

router
  .route("/")
  .post(protect, restrict("Admin"), createLesson)
  .get(getAllLessons);
router
  .route("/:lessonId")
  .get(protect, restrict("Admin"), getLesson)
  .delete(protect, restrict("Admin"), deleteLesson)
  .patch(protect, restrict("Admin"), updateLesson);

module.exports = router;
