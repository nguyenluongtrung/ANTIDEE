import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './QuestionDetail.css';
import { useEffect, useState } from 'react';
import { getAllServices } from '../../../../features/services/serviceSlice';

export const QuestionDetail = ({
	chosenQuestionId,
	setIsOpenDetailQuestion,
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

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllServices());
	}, []);

	if (questionLoading || serviceLoading) {
		return <Spinner />;
	}

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form className="content rounded-md p-5" style={{ width: '35vw' }}>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => {
						setIsOpenDetailQuestion(false);
						handleGetAllQuestions();
					}}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					XEM CHI TIẾT CÂU HỎI
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td>
								<span className='font-bold'>Dịch vụ</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="" style={{ width: '100%' }}>
									{chosenQuestion?.serviceId?.name}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span className='font-bold'>Nội dung</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="" style={{ width: '100%' }}>
									{chosenQuestion?.content}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Các lựa chọn</span>
							</td>
							<td className="pl-6 py-1 w-80">
								{chosenQuestion?.choices.map((choice, index) => (
									<p className="" style={{ width: '100%' }}>
										{String.fromCharCode(index + 65)}. {choice}
									</p>
								))}
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Câu trả lời đúng</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="" style={{ width: '100%' }}>
									{chosenQuestion?.correctAnswer}{' '}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span className='font-bold'>Giải thích</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="" style={{ width: '100%' }}>
									{chosenQuestion?.explanation}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Độ khó</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="" style={{ width: '100%' }}>
									{chosenQuestion?.difficultyLevel}
								</p>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</div>
	);
};
