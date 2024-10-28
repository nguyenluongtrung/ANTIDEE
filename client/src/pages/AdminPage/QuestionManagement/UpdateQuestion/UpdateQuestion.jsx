import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './UpdateQuestion.css';
import { useEffect, useState } from 'react';
import { getAllServices } from '../../../../features/services/serviceSlice';
import {
	getQuestion,
	updateQuestion,
} from '../../../../features/questions/questionSlice';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';

export const UpdateQuestion = () => {
	const { isLoading: questionLoading } = useSelector(
		(state) => state.questions
	);
	const { services, isLoading: serviceLoading } = useSelector(
		(state) => state.services
	);
	const [chosenQuestion, setChosenQuestion] = useState();
	const navigate = useNavigate();
	const params = useParams();
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
		if (!data.explanation.trim()) {
			toast.error('Vui lòng nhập "Giải thích"', errorStyle);
			return;
		}
		const questionData = {
			...data,
			choices: chosenQuestion?.choices,
		};
		console.log(questionData);
		const result = await dispatch(
			updateQuestion({ questionData, id: chosenQuestion._id })
		);
		if (result.type.endsWith('fulfilled')) {
			toast.success('Cập nhật câu hỏi thành công', successStyle);
			navigate('/admin-question');
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
	};

	useEffect(() => {
		const fetchQuestions = async () => {
			const response = await dispatch(getQuestion(params.questionId));
			setChosenQuestion(response.payload);
		};
		fetchQuestions();
	}, []);

	if (questionLoading || serviceLoading) {
		return <Spinner />;
	}

	if (chosenQuestion) {
		return (
			<div className="w-full min-h-screen bg-white flex flex-row">
				<AdminSidebar />
				<div className="w-full p-10">
					<div className="flex mb-10 text-2xl font-bold">
						Đang <p className="text-primary text-2xl px-2">Cập nhật</p> câu hỏi{' '}
					</div>
					<form onSubmit={handleSubmit(onSubmit)} className="content">
						<div className="flex gap-2 mb-5">
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Dịch vụ</div>
								<select
									{...register('serviceId')}
									className="shadow border py-3 px-3 rounded"
									defaultValue={chosenQuestion?.serviceId._id}
								>
									{services?.map((service) => (
										<option value={service._id}>{service.name}</option>
									))}
								</select>
							</div>
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Nội dung</div>
								<input
									type="text"
									{...register('content')}
									defaultValue={chosenQuestion?.content}
									className="shadow  border py-3 px-3 rounded"
								/>
							</div>
						</div>
						<div className="flex gap-2 mb-5">
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Câu trả lời đúng</div>
								<input
									type="text"
									{...register('correctAnswer')}
									defaultValue={chosenQuestion?.correctAnswer}
									className="shadow border py-3 px-3 rounded"
								/>
							</div>
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Giải thích</div>
								<input
									type="text"
									{...register('explanation')}
									defaultValue={chosenQuestion?.explanation}
									className="shadow  border py-3 px-3 rounded"
								/>
							</div>
						</div>
						<div className="flex gap-2 mb-5 items-center">
							<div className="text-gray mb-1">Độ khó</div>
							<input
								type="radio"
								{...register('difficultyLevel')}
								defaultChecked={chosenQuestion?.difficultyLevel == 'Dễ'}
								value={'Dễ'}
								className="w-3"
							/>{' '}
							<span className="mr-3">Dễ</span>
							<input
								type="radio"
								{...register('difficultyLevel')}
								defaultChecked={
									chosenQuestion?.difficultyLevel == 'Bình thường'
								}
								value={'Bình thường'}
								className="w-3"
							/>{' '}
							<span>Bình thường</span>
							<input
								type="radio"
								{...register('difficultyLevel')}
								defaultChecked={chosenQuestion?.difficultyLevel == 'Khó'}
								value={'Khó'}
								className="w-3"
							/>{' '}
							<span>Khó</span>
						</div>
						<div className="flex flex-col w-full col-span-1 lg:col-span-8">
							<div className="text-gray mb-2">Các lựa chọn</div>
							{chosenQuestion?.choices.map((choice, index) => (
								<div className="flex mb-2.5" key={index}>
									<input
										type="text"
										className="create-question-input text-center text-sm !w-[600px] mb-2 mr-2"
										value={choice}
										required
										onInvalid={(e) => {
											e.target.setCustomValidity('Vui lòng nhập lựa chọn');
										}}
										onInput={(e) => {
											e.target.setCustomValidity('');
										}}
										onChange={(e) => {
											const updatedChoices = chosenQuestion.choices.map(
												(c, i) => (i === index ? e.target.value : c)
											);
											setChosenQuestion((prevQuestion) => ({
												...prevQuestion,
												choices: updatedChoices.filter(
													(choice) => choice.trim() !== ''
												),
											}));
										}}
										name="choice"
									/>
									{index === chosenQuestion.choices.length - 1 && (
										<IoAddCircleOutline
											size={20}
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
						</div>
						<button
							type="submit"
							className="block w-[200px] bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
						>
							Cập nhật câu hỏi
						</button>
					</form>
				</div>
			</div>
		);
	}
};
