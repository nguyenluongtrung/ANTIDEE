import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getLessonsByCourse } from '../../../features/courses/courseSlice';
import examIcon from '../../../assets/img/quiz.png';
import videoIcon from '../../../assets/img/video.png';
import { FaCircleCheck } from 'react-icons/fa6';
import { GoDotFill } from 'react-icons/go';
import { MdOutlineOndemandVideo } from 'react-icons/md';
import { MdOutlineQuiz } from 'react-icons/md';
import { GrNotes } from 'react-icons/gr';

export const LessonsPage = () => {
	const [openLessons, setOpenLessons] = useState([]);
	const [lessons, setLessons] = useState([]);
	const [learningProgress, setLearningProgress] = useState(0);
	const dispatch = useDispatch();
	const { courseId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchLessons = async () => {
			const response = await dispatch(getLessonsByCourse(courseId));
			console.log(response.payload);
			if (response.type.endsWith('fulfilled')) {
				setLessons(response.payload.lessons);
				setLearningProgress(response.payload.learningProgress);
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

	const getNumberOfVideos = (lessons) => {
		let result = 0;
		lessons.forEach((lesson) => {
			const lessonContent = lesson.content;
			lessonContent.forEach((content) => {
				if (content.contentType == 'Video') {
					result += 1;
				}
			});
		});
		return result;
	};

	return (
		<div className="flex flex-col h-screen bg-gray-50 pt-14 mb-28">
			<div className="bg-white p-6 top-0 z-10">
				<h1 className="text-3xl font-bold text-gray-900 ml-10">
					Nội dung khóa học
				</h1>
			</div>

			<div className="border-[1px] border-light_gray rounded-sm w-[92%] mx-auto">
				<div className="flex gap-5 py-3 pl-6">
					<p>Bao gồm: </p>
					<div className="flex items-center gap-1">
						<GrNotes />
						<p>{lessons.length} bài học</p>
					</div>
					<div className="flex items-center gap-1">
						<MdOutlineQuiz />
						<p>{lessons.length - getNumberOfVideos(lessons)} bài kiểm tra</p>
					</div>
					<div className="flex items-center gap-1">
						<MdOutlineOndemandVideo />
						<p>{getNumberOfVideos(lessons)} video</p>
					</div>
				</div>
				<p className="border-b-[1px] border-light_gray pl-6 pb-3">
					Hoàn thành:{' '}
					<span
						className={`${
							learningProgress !== 100 ? 'text-red' : 'text-green'
						}`}
					>
						{learningProgress}%
					</span>{' '}
				</p>
				<div className="flex flex-grow">
					<div className="flex-[3] bg-gray-50 p-6 overflow-y-auto">
						<ul className="space-y-4">
							{lessons.map((lesson, index) => {
								return (
									<li key={lesson._id}>
										<div
											className={`p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition ${
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
														className={`p-2 bg-white rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:bg-light_primary transition`}
														onClick={(e) => {
															if (content.isPassed) {
																e.stopPropagation();
																return;
															}
															handleContentClick(content);
														}}
													>
														<div className="flex w-full px-3 justify-between items-center">
															<div className="flex justify-between items-center gap-2">
																<img
																	className="w-[50px]"
																	src={
																		content.contentType == 'Video'
																			? videoIcon
																			: examIcon
																	}
																	alt=""
																/>
																<div>
																	<p className="text-gray-800">
																		{content.contentType == 'Exam'
																			? content.examId.name
																			: content.videoId.title}
																	</p>
																	<div className="flex items-center text-gray">
																		<p className="mr-2 text-xs">
																			{content.contentType == 'Exam'
																				? 'Bài kiểm tra'
																				: 'Video'}
																		</p>
																		{content.contentType == 'Exam' && (
																			<>
																				<GoDotFill size={8} />
																				<p className="ml-2 text-xs">
																					{content.examId.duration} phút
																				</p>
																			</>
																		)}
																	</div>
																</div>
															</div>

															{content.isPassed && (
																<FaCircleCheck size={20} color="green" />
															)}
														</div>
													</li>
												))}
											</ul>
										)}
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
