import './QualificationPage.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../components';
import { getAllQualifications } from '../../features/qualifications/qualificationSlice';
import { useNavigate } from 'react-router-dom';
import { getAllExams } from '../../features/exams/examSlice';
import toast from 'react-hot-toast';
import { errorStyle } from '../../utils/toast-customize';

export const QualificationPage = () => {
	const qualificationImg =
		'https://cdn-icons-png.freepik.com/512/7238/7238706.png';

	const { qualifications, isLoading: qualificationLoading } = useSelector(
		(state) => state.qualifications
	);

	const { exams, isLoading: examLoading } = useSelector(
		(state) => state.exams
	);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		Promise.all([
			dispatch(getAllQualifications()),
			dispatch(getAllExams()),
		]).catch((error) => {
			console.error('Error during dispatch:', error);
		});
	}, []);

	const handleClickQualification = (id) => {
		const exam = exams?.find(
			(exam) =>
				String(exam.category) === 'Kiểm tra đầu vào' &&
				String(exam.qualificationId._id) === String(id)
		);
		if (exam) {
			navigate('/entry-exam', { state: { id: exam._id } });
		} else{
			toast.error("Bài kiểm tra đầu vào của chứng chỉ bạn chọn hiện chưa có!", errorStyle);
		}
	};

	if (qualificationLoading || examLoading) {
		return <Spinner />;
	}

	return (
		<>
			<div className="w-full">
				<h1 className="grid text-green font-bold text-2xl justify-center mb-3">
					DANH SÁCH CÁC CHỨNG CHỈ
				</h1>
				<div className="flex flex-wrap justify-center items-center">
					{qualifications?.map((qualificate, index) => (
						<div
							key={index}
							className="w-80 m-4 transition duration-300 ease-in-out transform hover:scale-110 border-gray-300 shadow-2xl rounded-[15px] hover:cursor-pointer"
							onClick={() => handleClickQualification(qualificate._id)}
						>
							<div className="p-4 w-full flex flex-col justify-center items-center">
								<p className="text-primary text-lg font-bold opacity-80 mt-1 ">
									{qualificate.name}
								</p>
								<img
									src={qualificationImg}
									alt={qualificate.description}
									className="w-[175px] h-auto object-cover rounded-lg "
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};
