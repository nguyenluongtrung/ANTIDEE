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
import { IoAddCircleOutline } from 'react-icons/io5';

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
		if (!data.content.trim()) {
			toast.error('Vui lòng nhập "Nội dung"', errorStyle);
			return;
		}
		if (chosenQuestion?.choices.length < 2) {
			toast.error('Vui lòng nhập hơn 2 lựa chọn', errorStyle);
			return;
		}
		if (!data.correctAnswer.trim()) {
			toast.error('Vui lòng nhập "Câu trả lời đúng"', errorStyle);
			return;
		}
		if (!chosenQuestion?.choices?.includes(data.correctAnswer.trim())) {
			toast.error('Câu trả lời đúng phải nằm trong các lựa chọn', errorStyle);
			return;
		}
		if (!data.explanation.trim()) {
			toast.error('Vui lòng nhập "Giải thích"', errorStyle);
			return;
		}
		const questionData = {
			...data,
			choices: chosenQuestion?.choices,
		};
		const result = await dispatch(
			updateQuestion({ questionData, id: chosenQuestionId })
		);
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
								<span className="font-bold">Dịch vụ</span>
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
								<span className="font-bold">Nội dung</span>
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
								<span className="font-bold">Các lựa chọn</span>
							</td>
							<td className="pl-6 py-1">
								{chosenQuestion?.choices.map((choice, index) => (
									<div className="flex mb-2.5" key={index}>
										<input
											type="text"
											className="create-question-input text-center text-sm w-80 mr-2"
											value={choice}
											required
											onInvalid={(e) => {
												e.target.setCustomValidity('Vui lòng nhập lựa chọn');
											}}
											onInput={(e) => {
												e.target.setCustomValidity('');
											}}
											onChange={(e) => {
												const updatedChoices = chosenQuestion.choices.map((c, i) =>
												  i === index ? e.target.value : c
												);
												setChosenQuestion(prevQuestion => ({
												  ...prevQuestion,
												  choices: updatedChoices.filter(choice => choice.trim() !== '')
												}));
											  }}
											name="choice"
										/>
										{index === chosenQuestion.choices.length - 1 && (
											<IoAddCircleOutline
												className="hover:cursor-pointer"
												onClick={() => {
													setChosenQuestion((prevQuestion) => ({
														...prevQuestion,
														choices: [...prevQuestion.choices, ''],
													}));
												}}
											/>
										)}
									</div>
								))}
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Câu trả lời đúng</span>
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
								<span className="font-bold">Giải thích</span>
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
								<span className="font-bold">Độ khó</span>
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
									defaultChecked={
										chosenQuestion?.difficultyLevel == 'Bình thường'
									}
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
