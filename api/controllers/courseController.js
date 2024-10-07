const asyncHandler = require("express-async-handler");

const Account = require('../models/accountModel');
const {Course} = require('../models/courseModel');
const {Lesson} = require('../models/courseModel');
//Xóa course xóa luôn lesson trong code
//get lesson của từng course 
const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({})

	res.status(200).json({
		status: 'success',
		data: {
			courses,
		},
	});
});
const getCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      res.status(404);
      throw new Error("Không tìm thấy khóa học");
    }
  
    res.status(200).json({
      status: "success",
      data: {
        course,
      },
    });
});
const createCourse = asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        course,
      },
    });
});
const createLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.create(req.body);

  await Course.findByIdAndUpdate(req.body.courseId, {
    $push: { lessons: lesson._id }
  });

  res.status(201).json({
    status: "success",
    data: {
      lesson,
    },
  });
});
const getAllLessons = asyncHandler(async (req, res) => {
  const lesson = await Lesson.find({})

res.status(200).json({
  status: 'success',
  data: {
    lesson,
  },
});
});
const updateCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId);

  if (!course) {
    res.status(404);
    throw new Error("Không tìm thấy khóa học");
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.courseId,
    req.body,
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedCourse,
    },
  });
});
// const deleteCourse = asyncHandler(async (req, res) => {
//     const course = await Course.findById(req.params.courseId);

//   if (!course) {
//     res.status(404);
//     throw new Error("Không tìm thấy khóa học");
//   }

//   await Course.findByIdAndDelete(req.params.courseId);

//   res.status(200).json({
//     status: "success",
//     data: { id: req.params.courseId },
//   });
// });
const getLessonsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params.courseId;
  const lessons = await Lesson.find({ courseId });

  res.status(200).json({
    status: 'success',
    data: {
      lessons,
    },
  });
});
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    res.status(404);
    throw new Error("Không tìm thấy khóa học");
  }

  // Xóa tất cả các bài học liên quan đến khóa học này
  await Lesson.deleteMany({ _id: { $in: course.lessons } });

  // Xóa khóa học
  await Course.findByIdAndDelete(req.params.courseId);

  res.status(200).json({
    status: "success",
    data: { id: req.params.courseId },
  });
});
module.exports = {
getAllCourses,
getCourse,
createCourse,
updateCourse,
deleteCourse,
getLessonsByCourse,
createLesson,
getAllLessons,
};