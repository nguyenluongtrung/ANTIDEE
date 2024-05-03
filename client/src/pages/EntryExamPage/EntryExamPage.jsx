import './EntryExamPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from './../../components';
import { useEffect, useState } from 'react';
import { getAllExams } from '../../features/exams/examSlice';

export const EntryExamPage = () => {
	const { exams, isLoading: examLoading } = useSelector((state) => state.exams);
	const [chosenExam, setChosenExam] = useState(null);
	const [questionList, setQuestionList] = useState([]);
	const dispatch = useDispatch();

	useEffect(() => {
		const asyncFn = async () => {
			await dispatch(getAllExams());
			const chosenExam = exams.find(
				(exam) => exam._id === '66344b624efd284146530f4b'
			);
			setChosenExam(chosenExam);
		};
		asyncFn();
	}, []);

	useEffect(() => {
		if (chosenExam) {
			const questions = [
				...(chosenExam?.questions?.easyQuestion?.easyQuestionList || []),
				...(chosenExam?.questions?.mediumQuestion?.mediumQuestionList || []),
				...(chosenExam?.questions?.hardQuestion?.hardQuestionList || []),
			];
			setQuestionList(questions);
		}
	}, [chosenExam]);

	if (!Array.isArray(questionList) || examLoading) {
		return <Spinner />;
	}

	return (
		<div className="mx-16">
			<h1 className=" grid text-green font-bold text-2xl justify-center mb-5">
				{chosenExam?.category}
			</h1>
			<div className="exam-info p-3 rounded-xl bg-light mb-8">
				<p className="text-brown font-bold mb-1">
					Chuyên môn: <span>{chosenExam?.serviceId?.name}</span>
				</p>
				<p className="mb-1">
					Thời gian còn lại:{' '}
					<span className="text-primary text-sm font-bold">
						{chosenExam?.duration}
					</span>
				</p>
				<p className="mb-1">Câu hỏi:</p>
				<div className="number-list mb-2 flex">
					{Array.from(
						{ length: questionList.length },
						(_, index) => index + 1
					).map((item) => {
						return (
							<div className="number-item rounded-md text-center mr-3">
								<span>{item}</span>
							</div>
						);
					})}
				</div>
				<button className="inline bg-white text-center pb-1 rounded-md submit-test-btn">
					<span className="text-primary">Nộp bài</span>
				</button>
			</div>
			<div className="question-list">
				{questionList?.map((question, index) => {
					return (
						<div className="question-item rounded-xl p-3 shadow-[-10px_13px_10px_-10px_rgba(0,0,0,0.8)] mb-8">
							<div>
								<span className="font-bold underline">Câu {index + 1}: </span>
								<span>{question?.content}</span>
							</div>
							{question?.choices.map((choice, index) => {
								return (
									<div>
										<input
											type="radio"
											className="w-3 mr-2 radio-answer-item"
											name="chosen-answer"
										/>
										<span>
											{String.fromCharCode(index + 65)}. {choice}
										</span>
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
			<button className="block mx-auto bg-white text-center pb-1 rounded-md next-test-btn hover:bg-green text-green hover:text-white">
				<span className="">Tiếp theo</span>
			</button>
		</div>
	);
};
