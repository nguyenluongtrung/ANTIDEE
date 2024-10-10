import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import { AiOutlineClose } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const CoursesDetail = ({
	setIsOpenDetailCourse,
	handleGetAllCourse,
    courses,
}) => {
    const navigate = useNavigate();
    const { courseId } = useParams();
	

	const [chosenCourse, setChosenCourse] = useState(
		courses[courses.findIndex((course) => String(course._id) == String(courseId))]
	);

	const dispatch = useDispatch();

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form className="content rounded-md p-5" style={{ width: '35vw' }}>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => {
						setIsOpenDetailCourse(false);
						handleGetAllCourse();
					}}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					XEM CHI TIẾT KHÓA HỌC
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td>
								<span className="font-bold">Tên</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenCourse?.name}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Chứng chỉ</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenCourse?.qualificationId?.name}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Thời gian</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenCourse?.duration} phút
								</p>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span className="font-bold">Số lượng bài học</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{/* {chosenCourse?.lessons} bài */}
								</p>
							</td>
						</tr>
						
					</tbody>
				</table>
			</form>
		</div>
	);
};
