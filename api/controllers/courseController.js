const asyncHandler = require('express-async-handler');

const { Course } = require('../models/courseModel');
const { Lesson } = require('../models/courseModel');
const AccountExam = require('../models/accountExamModel');
const AccountVideo = require('../models/accountVideoModel');

const getAllCourses = asyncHandler(async (req, res) => {
	const courses = await Course.find({})
		.populate('lessons qualificationId')
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
	const results = await AccountExam.find({
		accountId: req.account._id,
		isPassed: true,
	}).populate('examId');

	const entryExamResults = results.filter(
		(exam) => exam.examId?.category == 'Kiểm tra đầu vào'
	);

	const updatedCourses = await Promise.all(
		courses.map(async (course) => {
			const updatedLessons = await Promise.all(
				course.lessons.map(async (lesson) => {
					const updatedContent = await Promise.all(
						lesson.content.map(async (content) => {
							if (content.contentType === 'Exam') {
								const examByAccountId = await AccountExam.findOne({
									accountId: req.account._id,
									examId: content.examId,
								}).sort({ createdAt: -1 });

								return {
									...content.toObject(),
									isPassed: examByAccountId ? examByAccountId.isPassed : false,
								};
							} else {
								const videoByAccountId = await AccountVideo.findOne({
									accountId: req.account._id,
									videoId: content.videoId,
								});

								return {
									...content.toObject(),
									isPassed: videoByAccountId ? true : false,
								};
							}
						})
					);
					return {
						...lesson.toObject(),
						content: updatedContent,
					};
				})
			);

			const isCoursePassed = updatedLessons.every((lesson) =>
				lesson.content.every((content) => content.isPassed)
			);
			const isEligible = entryExamResults.find(
				(result) =>
					String(result.examId.qualificationId) ==
					String(course.qualificationId._id)
			);

			return {
				...course.toObject(),
				lessons: updatedLessons,
				passed: course.lessons.length > 0 ? isCoursePassed : false,
				isEligible: isEligible ? true : false,
			};
		})
	);

	res.status(200).json({
		status: 'success',
		data: {
			courses: updatedCourses,
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

	await Promise.all(
		course.lessons.map(async (lessonId) => {
			await Lesson.findByIdAndDelete(lessonId);
		})
	);

	const courseData = req.body;
	const lessonIds = await Promise.all(
		courseData.lessons.map(async (lesson) => {
			const createdLesson = await Lesson.create(lesson);
			return createdLesson._id;
		})
	);

	const newCourseData = { ...courseData, lessons: lessonIds };

	const updatedCourse = await Course.findByIdAndUpdate(
		req.params.courseId,
		newCourseData,
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

	let numOfContent = 0;
	let numOfPassedContent = 0;

	const newLessons = await Promise.all(
		course.lessons.map(async (lesson) => {
			const updatedContent = await Promise.all(
				lesson.content.map(async (content) => {
					if (content.contentType === 'Exam') {
						const examByAccountId = await AccountExam.findOne({
							accountId: req.account._id,
							examId: content.examId,
						}).sort({ createdAt: -1 });

						if (examByAccountId && examByAccountId.isPassed) {
							numOfPassedContent += 1;
						}

						return {
							...content.toObject(),
							isPassed: examByAccountId ? examByAccountId.isPassed : false,
						};
					} else {
						const videoByAccountId = await AccountVideo.findOne({
							accountId: req.account._id,
							videoId: content.videoId,
						});

						if (videoByAccountId) {
							numOfPassedContent += 1;
						}

						return {
							...content.toObject(),
							isPassed: videoByAccountId ? true : false,
						};
					}
				})
			);
			numOfContent += updatedContent.length;
			return {
				...lesson.toObject(),
				content: updatedContent,
			};
		})
	);

	res.status(200).json({
		status: 'success',
		data: {
			lessons: newLessons,
			learningProgress: (100.0 * numOfPassedContent) / numOfContent || 0,
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

	const newContent = await Promise.all(
		lesson.content.map(async (content) => {
			if (content.contentType === 'Exam') {
				const examByAccountId = await AccountExam.findOne({
					accountId: req.account._id,
					examId: content.examId,
				});

				return {
					...content.toObject(),
					isPassed: examByAccountId ? examByAccountId.isPassed : false,
				};
			}
			return content;
		})
	);

	res.status(200).json({
		status: 'success',
		data: {
			lesson: { ...lesson.toObject(), content: newContent },
		},
	});
});

const deleteLesson = asyncHandler(async (req, res) => {
	const { courseId, lessonId } = req.params;

	const course = await Course.findById(courseId);
	if (!course) {
		res.status(404);
		throw new Error('Không tìm thấy khóa học');
	}
	const lessonIndex = course.lessons.indexOf(lessonId);
	if (lessonIndex === -1) {
		res.status(404);
		throw new Error('Không tìm thấy bài học trong khóa học');
	}
	await Lesson.findByIdAndDelete(lessonId);
	course.lessons.splice(lessonIndex, 1);
	await course.save();

	res.status(200).json({
		status: 'success',
		message: 'Đã xóa bài học',
	});
});

const updateLesson = asyncHandler(async (req, res) => {
	const { lessonId } = req.params;
	const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, req.body, {
		new: true,
	});

	if (!updatedLesson) {
		res.status(404);
		throw new Error('Không tìm thấy bài học');
	}

	res.status(200).json({
		status: 'success',
		data: {
			updatedLesson,
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
	deleteLesson,
	updateLesson,
};
