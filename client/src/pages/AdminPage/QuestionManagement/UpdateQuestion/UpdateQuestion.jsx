import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './UpdateQuestion.css';
import { useEffect, useState } from 'react';
import { getAllServices } from '../../../../features/services/serviceSlice';
import { updateQuestion } from '../../../../features/questions/questionSlice';

export const UpdateQuestion = ({
	setIsOpenUpdateQuestion,
	chosenQuestionId,
	handleGetAllQuestions,
}) => {
	const { questions, isLoading: questionLoading } = useSelector(
		(state) => state.questions
	);
	const { services, isLoading: serviceLoading } = useSelector(
		(state) => state.services
	);
	const [chosenQuestion, setChosenQuestion] = useState(
		questions[
			questions.findIndex(
				(question) => String(question._id) == String(chosenQuestionId)
			)
		]
	);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllServices());
	}, []);

	const onSubmit = async (data) => {
		const questionData = {
			...data,
		};
		const result = await dispatch(updateQuestion({ questionData, id: chosenQuestionId }));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Cập nhật câu hỏi thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		setIsOpenUpdateQuestion(false);
		handleGetAllQuestions();
	};

	if (questionLoading || serviceLoading) {
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
					onClick={() => setIsOpenUpdateQuestion(false)}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					CẬP NHẬT CÂU HỎI
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td>
								<span>Dịch vụ</span>
							</td>
							<td>
								<select
									{...register('serviceId')}
									className="ml-6 py-1 create-exam-select hover:cursor-pointer text-center text-sm"
									defaultValue={chosenQuestion?.serviceId._id}
								>
									{services?.map((service) => (
										<option value={service._id}>{service.name}</option>
									))}
								</select>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span>Nội dung</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="text"
									{...register('content')}
                                    defaultValue={chosenQuestion?.content}
									className="create-question-input text-center text-sm w-80"
								/>
							</td>
						</tr>
						<tr>
							<td>
								<span>Các lựa chọn</span>
							</td>
							<td className="pl-6 py-1"></td>
						</tr>
						<tr>
							<td>
								<span>Câu trả lời đúng</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="text"
									{...register('correctAnswer')}
                                    defaultValue={chosenQuestion?.correctAnswer}
									className="create-question-input text-center text-sm w-80"
								/>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span>Giải thích</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="text"
									{...register('explanation')}
                                    defaultValue={chosenQuestion?.explanation}
									className="create-question-input text-center text-sm w-80"
								/>
							</td>
						</tr>
						<tr>
							<td>
								<span>Độ khó</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="radio"
									{...register('difficultyLevel')}
									defaultChecked={chosenQuestion?.difficultyLevel == 'Dễ'}
									value={'Dễ'}
									className="w-5"
								/>{' '}
								<span className="mr-3">Dễ</span>
								<input
									type="radio"
									{...register('difficultyLevel')}
                                    defaultChecked={chosenQuestion?.difficultyLevel == 'Bình thường'}
									value={'Bình thường'}
									className="w-5"
								/>{' '}
								<span>Bình thường</span>
								<input
									type="radio"
									{...register('difficultyLevel')}
                                    defaultChecked={chosenQuestion?.difficultyLevel == 'Khó'}
									value={'Khó'}
									className="w-5"
								/>{' '}
								<span>Khó</span>
							</td>
						</tr>
					</tbody>
				</table>
				<button
					type="submit"
					className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
				>
					Cập nhật câu hỏi
				</button>
			</form>
		</div>
	);
};
