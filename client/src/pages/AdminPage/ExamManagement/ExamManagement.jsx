import { useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import './ExamManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExam, getAllExams } from '../../../features/exams/examSlice';
import { Spinner } from '../../../components';
import { CreateExam } from './CreateExam/CreateExam';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { BiEdit, BiTrash } from 'react-icons/bi';

export const ExamManagement = () => {
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
				<CreateExam />
				<table className="w-full border-b border-gray">
					<thead>
						<tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
							<td className="py-2 px-4 text-center font-bold">STT</td>
							<td className="py-2 px-4 text-center font-bold">Danh mục</td>
							<td className="py-2 px-4 text-center font-bold">Thời lượng</td>
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
										<span>{exam.passGrade} / {exam.questions.numOfQuestions}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span></span>
									</td>
									<td className="">
										<div className="flex items-center justify-center">
											<button className="flex items-center justify-center hover:rounded-md py-3 hover:bg-green text-xl">
												<BiEdit className="text-green group-hover:text-white" />
											</button>
											<button className="flex items-center justify-center hover:rounded-md py-3 hover:bg-red text-xl">
												<BiTrash
													className="text-red group-hover:text-white"
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
