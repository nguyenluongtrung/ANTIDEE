import { useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import './ExamManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAllExams } from '../../../features/exams/examSlice';
import { Spinner } from '../../../components';

export const ExamManagement = () => {
	const { exams, isLoading } = useSelector((state) => state.exams);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllExams());
	}, [dispatch]);

    if(isLoading){
        return <Spinner />
    }

	return (
		<div className="w-full min-h-screen bg-white flex flex-row">
			<AdminSidebar />
			<div className="flex-1 px-10 pt-5">
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
