import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import './ExamManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExam, getAllExams } from '../../../features/exams/examSlice';
import { Spinner } from '../../../components';
import { CreateExam } from './CreateExam/CreateExam';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { UpdateExam } from './UpdateExam/UpdateExam';
export const ExamManagement = () => {
	const [isOpenCreateExam, setIsOpenCreateExam] = useState(false);
	const [isOpenUpdateExam, setIsOpenUpdateExam] = useState(false);
	const [chosenExamId, setChosenExamId] = useState('');
	const { exams, isLoading } = useSelector((state) => state.exams);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllExams());
	}, []);

	const handleDeleteExam = async (id) => {
		const result = await dispatch(deleteExam(id));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Xoá bài kiểm tra thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<div className="w-full min-h-screen bg-white flex flex-row">
			<AdminSidebar />
			<div className="flex-1 px-10 pt-5">
				<Toaster>
					{(t) => (
						<ToastBar
							toast={t}
							style={{
								...t.style,
								animation: t.visible
									? 'custom-enter 1s ease'
									: 'custom-exit 1s ease',
							}}
						/>
					)}
				</Toaster>

				{isOpenCreateExam && (
					<CreateExam setIsOpenCreateExam={setIsOpenCreateExam} />
				)}
				{isOpenUpdateExam && (
					<UpdateExam setIsOpenUpdateExam={setIsOpenUpdateExam} chosenExamId={chosenExamId}/>
				)}

				<div className="flex">
					<div className="flex-1 pt-2">
						<span>Hiển thị </span>
						<select
							className="rounded-md p-1 mx-1 hover:cursor-pointer"
							style={{ backgroundColor: '#E0E0E0' }}
						>
							<option>10</option>
							<option>20</option>
							<option>30</option>
						</select>
						<span> hàng</span>
					</div>
					<button
						className="bg-pink text-white py-2 rounded-md block mx-auto"
						style={{ width: '100px' }}
						onClick={() => setIsOpenCreateExam(true)}
					>
						<span>Thêm đề thi</span>
					</button>
				</div>
				<table className="w-full border-b border-gray mt-3">
					<thead>
						<tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
							<td className="py-2 px-4 text-center font-bold">STT</td>
							<td className="py-2 px-4 text-center font-bold">Danh mục</td>
							<td className="py-2 px-4 text-center font-bold">Thời gian</td>
							<td className="py-2 px-4 text-center font-bold">Điểm cần đạt</td>
							<td className="py-2 px-4 text-center font-bold">Chi tiết</td>
							<td className="py-2 px-4 text-center font-bold">Hành Động</td>
						</tr>
					</thead>
					<tbody>
						{exams?.map((exam, index) => {
							return (
								<tr className="hover:bg-light_purple transition-colors group odd:bg-light_purple hover:cursor-pointer">
									<td className="font-medium text-center text-gray p-3">
										<span>{index + 1}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>{exam.category}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>{exam.duration} phút</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>
											{exam.passGrade} / {exam.questions.numOfQuestions}
										</span>
									</td>
									<td className="font-medium text-center text-gray">
										<button className="hover:cursor-pointer text-xl pt-1.5">
											<MdOutlineRemoveRedEye className="block mx-auto" />
										</button>
									</td>
									<td className="">
										<div className="flex items-center justify-center">
											<button
												className="flex items-center justify-end py-3 pr-2 text-xl"
												onClick={() => {
													setIsOpenUpdateExam(true);
													setChosenExamId(exam._id);
												}}
											>
												<BiEdit className="text-green" />
											</button>
											<button className="flex items-center justify-start py-3 pl-2 text-xl">
												<BiTrash
													className="text-red"
													onClick={() => handleDeleteExam(exam._id)}
												/>
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};
