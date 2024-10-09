import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getLessonsByCourse } from '../../../features/courses/courseSlice';

export const LessonsPage = () => {
	const [openLessons, setOpenLessons] = useState([]);
	const [lessons, setLessons] = useState([]);
	const dispatch = useDispatch();
	const { courseId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchLessons = async () => {
			const response = await dispatch(getLessonsByCourse(courseId));
			if (response.type.endsWith('fulfilled')) {
				setLessons(response.payload);
			} else {
				setLessons([]);
			}
		};
		fetchLessons();
	}, [courseId, dispatch]);

	const toggleLesson = (lessonId) => {
		if (openLessons.includes(lessonId)) {
			setOpenLessons(openLessons.filter((id) => id !== lessonId));
		} else {
			setOpenLessons([...openLessons, lessonId]);
		}
	};

	const handleContentClick = (content) => {
		if (content.contentType == 'Video') {
			navigate(`/video-detail/${content.videoId._id}`);
		} else {
			navigate(`/entry-exam/${content.examId._id}`);
		}
	};

	console.log(lessons)

	return (
		<div className="flex flex-col h-screen bg-gray-50 pt-14 mb-28">
			<div className="bg-white shadow-lg p-6 top-0 z-10">
				<h1 className="text-3xl font-bold text-gray-900 ml-10">
					Nội dung khóa học
				</h1>
			</div>
			<div className="flex flex-grow pl-10">
				<div className="flex-[3] bg-gray-50 p-6 overflow-y-auto">
					<ul className="space-y-4">
						{lessons.map((lesson, index) => (
							<li key={lesson._id}>
								<div
									className={`p-4 bg-white rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-100 transition ${
										openLessons.includes(lesson._id) ? 'bg-indigo-100' : ''
									}`}
									onClick={() => toggleLesson(lesson._id)}
								>
									<span className="text-gray-800 font-medium">
										Bài học {index + 1}: {lesson.title}
									</span>
									{openLessons.includes(lesson._id) ? (
										<FaChevronUp className="text-gray-500" />
									) : (
										<FaChevronDown className="text-gray-500" />
									)}
								</div>
								{openLessons.includes(lesson._id) && (
									<ul className="mt-2 pl-6 space-y-2">
										{lesson.content.map((content) => (
											<li
												key={content._id}
												className={`p-2 bg-white rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-100 transition`}
												onClick={(e) => {
													e.stopPropagation();
													handleContentClick(content);
												}}
											>
												{content.contentType == 'Exam' && (
													<span className="text-gray-800">
														Bài kiểm tra: {content.examId.name}
													</span>
												)}
												{content.contentType == 'Video' && (
													<span className="text-gray-800">
														Video: {content.videoId.title}
													</span>
												)}
											</li>
										))}
									</ul>
								)}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
