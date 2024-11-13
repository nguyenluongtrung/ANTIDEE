import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import { AiOutlineClose } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { getCourseById, getLessonsByCourse } from '../../../../features/courses/courseSlice';
import LessonComponent from '../components/LessonComponent';
import { MdDriveFileRenameOutline, MdOutlineAccessTime, MdOutlineContentPasteGo } from 'react-icons/md';
import { BiCreditCardAlt } from 'react-icons/bi';
import { IoImageOutline } from 'react-icons/io5';
import { getAllQualifications } from '../../../../features/qualifications/qualificationSlice';

export const CoursesDetail = () => {
	const params = useParams();
	const [qualifications, setQualifications] = useState([])

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: '',
		description: '',
		duration: 60,
		qualificationId: '',
		image: '',
		lessons: [
			{
				title: '',
				content: [],
			},
		],
	})

	useEffect(() => {
		const fetchCourse = async () => {
			const resultFetchCourse = await dispatch(getCourseById(params.courseId))

			if (resultFetchCourse.type.endsWith('fulfilled')) {
				const course = resultFetchCourse.payload.course;
				setFormData({
					name: course.name,
					description: course.description,
					duration: course.duration,
					qualificationId: course.qualificationId,
					image: course.image
				})
				setImageUrl(course.image)
			}
		}

		const fetchLessons = async () => {
			const resultFetchLessons = await dispatch(getLessonsByCourse(params.courseId))
			if (resultFetchLessons.type.endsWith('fulfilled')) {
				setFormData(prevState => ({
					...prevState,
					lessons: resultFetchLessons.payload.lessons
				}));
			}
		}

		const handleFetchQualifications = async () => {
			const resultFetchQualificate = await dispatch(getAllQualifications());
			setQualifications(resultFetchQualificate.payload)
		}

		fetchCourse()
		fetchLessons()
		handleFetchQualifications()
	}, [params.courseId])

	const haveNameQualificatiion = () => {
		const qualification = qualifications.find(q => q._id === formData.qualificationId);
		return qualification ? qualification.name : null;
	}

	return (
		<div className="w-full min-h-screen bg-white flex flex-row">
			<div>
				<AdminSidebar />
			</div>

			<div className="w-full p-10">
				{console.log(formData)}
				<div className='flex items-center w-full my-3'>
					<div className='flex-grow border-t border-gray opacity-50'></div>
					<div className='px-5 font-bold text-2xl text-'>Xem chi tiết khoá học</div>
					<div className='flex-grow border-t border-gray opacity-50'></div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-x-10 gap-y-5 my-6'>
					<div className="flex flex-col w-full col-span-1 lg:col-span-4">
						<div className="text-gray mb-2 flex items-center gap-x-2"><MdDriveFileRenameOutline />Tên khoá học</div>
						<input
							disabled
							className="shadow appearance-none border py-3 px-3 rounded"
							value={formData.name}
						/>
					</div>
					<div className="flex flex-col w-full col-span-1 lg:col-span-4">
						<div className="text-gray mb-2 flex items-center gap-x-2"><BiCreditCardAlt />Chứng chỉ khoá học</div>
						<input
							disabled
							className="shadow appearance-none border py-3 px-3 rounded"
							value={haveNameQualificatiion()}
						/>
					</div>
					<div className="flex flex-col w-full col-span-1 lg:col-span-4">
						<div className="text-gray mb-2 flex items-center gap-x-2"><MdOutlineAccessTime />Thời gian ước tính hoàn thành (giờ)</div>
						<input
							disabled
							className="shadow appearance-none border py-3 px-3 rounded"
							value={formData.duration}
						/>
					</div>
					<div className="flex flex-col w-full col-span-1 lg:col-span-8">
						<div className="text-gray mb-2 flex items-center gap-x-2"><MdOutlineContentPasteGo />Mô tả khoá học</div>
						<textarea
							disabled
							className="shadow appearance-none border py-3 px-3 rounded h-32"
							value={formData.description}
						/>
					</div>
					<div className='w-full col-span-1 lg:col-span-4'>
						<div className="text-gray mb-2 flex items-center gap-x-2 "><IoImageOutline />Hình ảnh khoá học</div>
						<img src={formData.image} alt="" className='rounded h-48 w-auto mt-2 mx-auto' />
					</div>
				</div>

				<div className='flex items-center w-full my-3'>
					<div className='flex-grow border-t border-gray opacity-50'></div>
					<div className='px-5 font-bold text-2xl'>Xem chi tiết bài học</div>
					<div className='flex-grow border-t border-gray opacity-50'></div>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-10 mt-4'>
					{formData.lessons?.map((lesson, index) => (
						<div key={index} className="flex flex-col w-full col-span-1 lg:col-span-4 bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
							<div className="p-4">
								<div className="bg-white text-primary p-2 font-bold text-lg text-center rounded-sm border-b-2">{lesson.title}</div>
								<div className='p-2 text-center font-semibold text-gray'>Nội dung bài học</div>

								{lesson.content?.map((content, index) => (
									<div key={index} className="mb-2 p-2 border-b border-gray border-opacity-50">
										<div className="flex items-center">
											{content.contentType === "Video" ? (
												<>
													<span className="text-pink">{index + 1}. Video: {content.videoId.title}</span>
												</>
											) : (
												<>
													<span className="text-blue">{index + 1}. Bài kiểm tra: {content.examId.name}</span>
												</>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
				<div className="flex justify-center items-center">
					<Link to={`/admin-course`} className="bg-green my-10 p-2 rounded text-white text-center font-bold w-[400px] fea-item hover:bg-primary_dark">
						Quay lại danh sách khoá học
					</Link>
				</div>
			</div>
		</div>
	);
};
