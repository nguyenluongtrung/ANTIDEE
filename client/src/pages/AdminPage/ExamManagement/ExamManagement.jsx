import { useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import './ExamManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExam, getAllExams } from '../../../features/exams/examSlice';
import { Spinner } from '../../../components';
import { CreateExam } from './CreateExam/CreateExam';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';

export const ExamManagement = () => {
	const { exams, isLoading } = useSelector((state) => state.exams);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllExams());
	}, [dispatch]);

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
				<section className="table__body">
					<table>
						<thead>
							<tr>
								<th>
									<span>Danh mục</span>{' '}
								</th>
								<th>
									<span>Thời lượng</span>{' '}
								</th>
								<th>
									<span>Điểm để qua bài kiểm tra</span>{' '}
								</th>
								<th>
									<span>Chi tiết</span>{' '}
								</th>
								<th>
									<span>Hành động</span>{' '}
								</th>
							</tr>
						</thead>
						<tbody>
							{exams?.map((exam) => {
								return (
									<tr>
										<td>
											<span>{exam.category}</span>
										</td>
										<td>
											<span>{exam.duration}</span>
										</td>
										<td>
											<span>{exam.passGrade}</span>
										</td>
										<td>
											<p className="status delivered">Delivered</p>
										</td>
										<td>
											<button onClick={() => handleDeleteExam(exam._id)}>
												Xóa
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</section>
			</div>
		</div>
	);
};
