import './QualificationPage.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllQualifications } from '../../features/qualifications/qualificationSlice';
import { useNavigate } from 'react-router-dom';
import { getAllExams, getMyExamResults } from '../../features/exams/examSlice';
import toast from 'react-hot-toast';
import { errorStyle } from '../../utils/toast-customize';

export const QualificationPage = () => {
	const qualificationImg =
		'https://cdn-icons-png.freepik.com/512/7238/7238706.png';

	const { qualifications, isLoading: qualificationLoading } = useSelector(
		(state) => state.qualifications
	);

	const [results, setResults] = useState();
	const [exams, setExams] = useState();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		Promise.all([
			dispatch(getAllQualifications()),
			dispatch(getAllExams()),
		]).catch(() => {
		});
	}, []);

	async function initiateAllExamResults() {
		const output = await dispatch(getMyExamResults());
		console.log(output.payload)
		setResults(output.payload);
	}

	async function initiateAllExams() {
		const output = await dispatch(getAllExams());
		setExams(output.payload);
	}

	useEffect(() => {
		initiateAllExamResults();
		initiateAllExams();
	}, []);

	const checkEntryExamPassed = (qualificationId) => {
		return results?.find(
			(result) =>
				String(result.examId.category) == 'Kiểm tra đầu vào' &&
				String(result.examId.qualificationId) ===
					String(qualificationId) && result.isPassed 
		)
	}

	const handleClickQualification = (id) => {
		const exam = exams?.find(
			(result) =>
				String(result.category) === 'Kiểm tra đầu vào' &&
				String(result.qualificationId._id) === String(id)
		);

		if (!exam) {
			toast.error(
				'Bài kiểm tra đầu vào của chứng chỉ bạn chọn hiện chưa có!',
				errorStyle
			);
		} else {
			navigate(`/entry-exam/${exam._id}`);
		}
	};

	return (
		<>
			<div className="w-full pt-20 pb-10">
				<h1 className="grid text-green font-bold text-2xl justify-center mb-3">
					DANH SÁCH CÁC CHỨNG CHỈ
				</h1>
				<div className="flex flex-wrap justify-center items-center">
					{qualifications?.map((qualificate, index) => (
						<div
							key={index}
							className="w-80 m-4 transition duration-300 ease-in-out transform hover:scale-110 border-gray-300 shadow-2xl rounded-[15px] hover:cursor-pointer"
							onClick={() => {
								if(checkEntryExamPassed(qualificate._id)){
									return;
								}else{
									handleClickQualification(qualificate._id)
								}
							}}
						>
							<div className="p-4 w-full flex flex-col justify-center items-center relative">
								<p className="text-primary text-lg font-bold opacity-80 mt-1 ">
									{qualificate.name}
								</p>
								<img
									src={qualificationImg}
									alt={qualificate.description}
									className="w-[175px] h-auto object-cover rounded-lg"
								/>
								{checkEntryExamPassed(qualificate._id) && (
									<img
										className="absolute w-48 transform -rotate-45"
										src="https://png.pngtree.com/png-vector/20230923/ourmid/pngtree-passed-stamp-shows-quality-control-approved-satisfied-png-image_10044870.png"
									/>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};
