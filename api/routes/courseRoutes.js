const express = require("express");
const { protect, restrict } = require("../middleware/accountMiddleware");
const {
  createCourse,
  getAllCourses,
  getCourse,
  deleteCourse,
  updateCourse,
  createLesson,
  getLessonsByCourse,
  getLessonByCourseAndLessonId,
} = require("../controllers/courseController");

const router = express.Router();

router
  .route("/")
  .post(protect, restrict("Admin"), createCourse)
  .get(getAllCourses);
router
  .route("/:courseId")
  .get(protect, restrict("Admin"), getCourse)
  .delete(protect, restrict("Admin"), deleteCourse)
  .patch(protect, restrict("Admin"), updateCourse);
  router.post('/:courseId/lessons', createLesson);
router.get('/:courseId/lessons', getLessonsByCourse);
router.get('/:courseId/lessons/:lessonId', getLessonByCourseAndLessonId);
module.exports = router;
