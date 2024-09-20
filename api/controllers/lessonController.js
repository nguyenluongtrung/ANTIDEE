const asyncHandler = require("express-async-handler");
const Lesson = require("../models/lessonModel");

const createLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      lesson,
    },
  });
});

const getAllLessons = asyncHandler(async (req, res) => {
  const lessons = await Lesson.find({});

  res.status(200).json({
    status: "success",
    data: {
      lessons,
    },
  });
});

const getLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);

  if (!lesson) {
    res.status(404);
    throw new Error("Không tìm thấy bài học");
  }

  res.status(200).json({
    status: "success",
    data: {
      lesson,
    },
  });
});

const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);

  if (!lesson) {
    res.status(404);
    throw new Error("Không tìm thấy bài học");
  }

  await Lesson.findByIdAndDelete(req.params.lessonId);

  res.status(200).json({
    status: "success",
    data: { id: req.params.lessonId },
  });
});

const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);

  if (!lesson) {
    res.status(404);
    throw new Error("Không tìm thấy bài học");
  }

  const updatedLesson = await Lesson.findByIdAndUpdate(
    req.params.lessonId,
    req.body,
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedLesson,
    },
  });
});



module.exports = {
  createLesson,
  getAllLessons,
  getLesson,
  deleteLesson,
  updateLesson,
};
