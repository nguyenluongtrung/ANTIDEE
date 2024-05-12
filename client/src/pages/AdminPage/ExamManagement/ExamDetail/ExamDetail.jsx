import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import { AiOutlineClose } from 'react-icons/ai';
import './ExamDetail.css';
import { useEffect, useState } from 'react';
import { getAllQualifications } from '../../../../features/qualifications/qualificationSlice';

export const ExamDetail = ({ chosenExamId, setIsOpenDetailExam, handleGetAllExams }) => {
	const { exams, isLoading: examLoading } = useSelector((state) => state.exams);
	const { qualifications, isLoading: qualificationLoading } = useSelector(
		(state) => state.qualifications
	);
	const [chosenExam, setChosenExam] = useState(
		exams[exams.findIndex((exam) => String(exam._id) == String(chosenExamId))]
	);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllQualifications());
	}, []);

	if (examLoading || qualificationLoading) {
		return <Spinner />;
	}

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form className="content rounded-md p-5" style={{ width: '35vw' }}>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => {setIsOpenDetailExam(false) ; handleGetAllExams()}}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					XEM CHI TIẾT ĐỀ THI
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td>
								<span className='font-bold'>Chứng chỉ</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenExam?.qualificationId?.name}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span className='font-bold'>Danh mục</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenExam?.category}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Thời gian</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenExam?.duration} phút
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Điểm cần đạt</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenExam?.passGrade} /{' '}
									{Number(
										chosenExam?.questions?.easyQuestion?.numOfEasyQuestion
									) +
										Number(
											chosenExam?.questions?.mediumQuestion?.numOfMediumQuestion
										) +
										Number(
											chosenExam?.questions?.hardQuestion?.numOfHardQuestion
										)}{' '}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span className='font-bold'>Số lượng câu dễ</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenExam?.questions?.easyQuestion?.numOfEasyQuestion} câu
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Số lượng câu bình thường</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenExam?.questions?.mediumQuestion?.numOfMediumQuestion}{' '}
									câu
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Số lượng câu khó</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenExam?.questions?.hardQuestion?.numOfHardQuestion} câu
								</p>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</div>
	);
};
