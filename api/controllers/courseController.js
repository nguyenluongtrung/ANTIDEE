const asyncHandler = require('express-async-handler');

const Account = require('../models/accountModel');
const { Course } = require('../models/courseModel');
const { Lesson } = require('../models/courseModel');
const getAllCourses = asyncHandler(async (req, res) => {
	const courses = await Course.find({});

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
		throw new Error('Không tìm thấy khóa học');
	}

	res.status(200).json({
		status: 'success',
		data: {
			course,
		},
	});
});
const createCourse = asyncHandler(async (req, res) => {
	const { lessons, ...courseData } = req.body;
	const course = await Course.create(courseData);
	if (lessons && lessons.length > 0) {
		const createdLessons = await Lesson.insertMany(lessons);
		course.lessons.push(...createdLessons.map((lesson) => lesson._id));
		await course.save();
	}

	res.status(201).json({
		status: 'success',
		data: {
			course,
		},
	});
});

const createLesson = asyncHandler(async (req, res) => {
	const lesson = await Lesson.create(req.body);

	await Course.findByIdAndUpdate(req.body.courseId, {
		$push: {
			lessons: lesson._id,
		},
	});

	res.status(201).json({
		status: 'success',
		data: {
			lesson,
		},
	});
});
const getAllLessons = asyncHandler(async (req, res) => {
	const lesson = await Lesson.find({});

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
		throw new Error('Không tìm thấy khóa học');
	}

	const updatedCourse = await Course.findByIdAndUpdate(
		req.params.courseId,
		req.body,
		{
			new: true,
		}
	);

	res.status(200).json({
		status: 'success',
		data: {
			updatedCourse,
		},
	});
});

const getLessonsByCourse = asyncHandler(async (req, res) => {
	const { courseId } = req.params;

	const course = await Course.findById(courseId)
		.populate('lessons')
		.populate({
			path: 'lessons',
			populate: {
				path: 'content.examId',
				model: 'Exam',
			},
		})
		.populate({
			path: 'lessons',
			populate: {
				path: 'content.videoId',
				model: 'Video',
			},
		});

	if (!course) {
		res.status(404);
		throw new Error('Không tìm thấy khóa học');
	}

	res.status(200).json({
		status: 'success',
		data: {
			lessons: course.lessons,
		},
	});
});

const deleteCourse = asyncHandler(async (req, res) => {
	const course = await Course.findById(req.params.courseId);

	if (!course) {
		res.status(404);
		throw new Error('Không tìm thấy khóa học');
	}
	await Lesson.deleteMany({
		_id: {
			$in: course.lessons,
		},
	});
	await Course.findByIdAndDelete(req.params.courseId);

	res.status(200).json({
		status: 'success',
		data: {
			id: req.params.courseId,
		},
	});
});
const getLessonByCourseAndLessonId = asyncHandler(async (req, res) => {
	const { courseId, lessonId } = req.params;

	const course = await Course.findById(courseId).populate('lessons');

	if (!course) {
		res.status(404);
		throw new Error('Không tìm thấy khóa học');
	}

	const lesson = course.lessons.find(
		(lesson) => lesson._id.toString() === lessonId
	);

	if (!lesson) {
		res.status(404);
		throw new Error('Không tìm thấy bài học trong khóa học');
	}

	res.status(200).json({
		status: 'success',
		data: {
			lesson,
		},
	});
});

module.exports = {
	getAllCourses,
	getCourse,
	createCourse,
	updateCourse,
	deleteCourse,
	getLessonsByCourse,
	getLessonByCourseAndLessonId,
	createLesson,
	getAllLessons,
};
