import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './CreateQuestion.css';
import { useEffect, useState } from 'react';
import { getAllServices } from '../../../../features/services/serviceSlice';
import { createQuestion } from '../../../../features/questions/questionSlice';
import { IoAddCircleOutline } from 'react-icons/io5';

export const CreateQuestion = ({
	setIsOpenCreateQuestion,
	handleGetAllQuestions,
}) => {
	const [choices, setChoices] = useState(['']);
	const { isLoading: questionLoading } = useSelector(
		(state) => state.questions
	);
	const { services, isLoading: serviceLoading } = useSelector(
		(state) => state.services
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
			choices,
		};
		const result = await dispatch(createQuestion(questionData));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Thêm câu hỏi thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		setIsOpenCreateQuestion(false);
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
					onClick={() => setIsOpenCreateQuestion(false)}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					TẠO CÂU HỎI
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td className="w-28">
								<span className='font-bold'>Dịch vụ</span>
							</td>
							<td>
								<select
									{...register('serviceId')}
									className="ml-6 py-1 create-exam-select hover:cursor-pointer text-center text-sm w-80"
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
								<span className='font-bold'>Nội dung</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="text"
									{...register('content')}
									className="create-question-input text-center text-sm w-80"
								/>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Các lựa chọn</span>
							</td>
							<td className="pl-6 py-1">
								{choices.map((choice, index) => (
									<div className="flex mb-2.5" key={index}>
										<input
											type="text"
											className="create-question-input text-center text-sm w-80 mr-2"
											value={choice}
											onChange={(e) => {
												const updatedChoices = [...choices];
												updatedChoices[index] = e.target.value;
												setChoices(updatedChoices);
											}}
											name="choice"
										/>
										{index === choices.length - 1 && (
											<IoAddCircleOutline
												className="hover:cursor-pointer"
												onClick={() => {
													setChoices([...choices, '']);
												}}
											/>
										)}
									</div>
								))}
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Câu trả lời đúng</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="text"
									{...register('correctAnswer')}
									className="create-question-input text-center text-sm w-80"
								/>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Giải thích</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="text"
									{...register('explanation')}
									className="create-question-input text-center text-sm w-80"
								/>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Độ khó</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="radio"
									{...register('difficultyLevel')}
									defaultValue={'Dễ'}
									value={'Dễ'}
									className="w-5"
								/>{' '}
								<span className="mr-3">Dễ</span>
								<input
									type="radio"
									{...register('difficultyLevel')}
									value={'Bình thường'}
									className="w-5"
								/>{' '}
								<span>Bình thường</span>
								<input
									type="radio"
									{...register('difficultyLevel')}
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
					Tạo câu hỏi
				</button>
			</form>
		</div>
	);
};
