import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './UpdateExam.css';
import { updateExam } from '../../../../features/exams/examSlice';
import { useEffect, useState } from 'react';
import { getAllQualifications } from '../../../../features/qualifications/qualificationSlice';

export const UpdateExam = ({ setIsOpenUpdateExam, chosenExamId, handleGetAllExams }) => {
	const { exams, isLoading: examLoading } = useSelector((state) => state.exams);
	const { qualifications, isLoading: qualificationLoading } = useSelector((state) => state.qualifications);
	const [chosenExam, setChosenExam] = useState(
		exams[exams.findIndex((exam) => exam._id == chosenExamId)]
	);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllQualifications());
	}, []);

	const onSubmit = async (data) => {
		const examData = {
			...data,
			numOfQuestions:
				Number(data.numOfHardQuestion) +
				Number(data.numOfMediumQuestion) +
				Number(data.numOfEasyQuestion),
		};
		const result = await dispatch(updateExam({ examData, id: chosenExamId }));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Cập nhật bài kiểm tra thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		setIsOpenUpdateExam(false);
		handleGetAllExams();
	};

	if (examLoading || qualificationLoading) {
		return <Spinner />;
	}

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="content rounded-md p-5"
				style={{ width: '35vw' }}
			>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => setIsOpenUpdateExam(false)}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					CẬP NHẬT ĐỀ THI
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td>
								<span className='font-bold'>Chứng chỉ</span>
							</td>
							<td>
								<select
									{...register('qualificationId')}
									className="ml-6 py-1 create-exam-select hover:cursor-pointer text-center text-sm"
									defaultValue={chosenExam?.qualificationId._id}
								>
									{qualifications?.map((qualification) => (
										<option value={qualification._id}>{qualification.name}</option>
									))}
								</select>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span className='font-bold'>Danh mục</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="radio"
									{...register('category')}
									defaultChecked={chosenExam?.category == 'Kiểm tra đầu vào'}
									value={'Kiểm tra đầu vào'}
									className="w-5"
								/>{' '}
								<span className="mr-3">Kiểm tra đầu vào</span>
								<input
									type="radio"
									{...register('category')}
									defaultChecked={chosenExam?.category == 'Kiểm tra training'}
									value={'Kiểm tra training'}
									className="w-5"
								/>{' '}
								<span>Kiểm tra training</span>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Thời gian</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="number"
									{...register('duration')}
									defaultValue={chosenExam?.duration}
									className="create-exam-input text-center"
								/>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Điểm cần đạt</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="number"
									{...register('passGrade')}
									defaultValue={chosenExam?.passGrade}
									className="create-exam-input text-center"
								/>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span className='font-bold'>Số lượng câu dễ</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="number"
									{...register('numOfEasyQuestion')}
									defaultValue={
										chosenExam?.questions?.easyQuestion?.numOfEasyQuestion
									}
									className="create-exam-input text-center"
								/>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Số lượng câu bình thường</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="number"
									{...register('numOfMediumQuestion')}
									defaultValue={
										chosenExam?.questions?.mediumQuestion?.numOfMediumQuestion
									}
									className="create-exam-input text-center"
								/>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Số lượng câu khó</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="number"
									{...register('numOfHardQuestion')}
									defaultValue={
										chosenExam?.questions?.hardQuestion?.numOfHardQuestion
									}
									className="create-exam-input text-center"
								/>
							</td>
						</tr>
					</tbody>
				</table>
				<button
					type="submit"
					className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
				>
					Cập nhật bài thi
				</button>
			</form>
		</div>
	);
};
