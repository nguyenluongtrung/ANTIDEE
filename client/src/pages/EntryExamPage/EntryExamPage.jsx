import './EntryExamPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { Spinner } from './../../components';
import { useEffect, useState, useRef } from 'react';
import { getAllExams } from '../../features/exams/examSlice';
import { ScoreNotification } from './ScoreNotification/ScoreNotification';

export const EntryExamPage = () => {
	const { exams, isLoading: examLoading } = useSelector((state) => state.exams);
	const [chosenExam, setChosenExam] = useState(null);
	const [questionList, setQuestionList] = useState([]);
	const [totalScore, setTotalScore] = useState(0);
	const [answers, setAnswers] = useState([]);
	const [isSubmit, setIsSubmit] = useState(false);
	const [isOpenScoreNotification, setIsOpenScoreNotification] = useState(false);
	const questionRefs = useRef([]);
	const dispatch = useDispatch();
	const navigate = useNavigate();

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

	const handleChangeAnswer = (content, questionId) => {
		const answer = answers.find((answer) => answer.questionId == questionId);
		if (answer) {
			answer.answerContent = content;
			setAnswers(answers);
		} else {
			setAnswers([
				...answers,
				{
					questionId,
					answerContent: content,
				},
			]);
		}
	};

	const handleSubmitExam = () => {
		answers.map((answer) => {
			const question = questionList.find(
				(question) => question._id == answer.questionId
			);
			if (question.correctAnswer == answer.answerContent) {
				setTotalScore((totalScore) => totalScore + 1);
			}
		});
		setIsSubmit(true);
	};

	if (!Array.isArray(questionList) || examLoading) {
		return <Spinner />;
	}

	return (
		<div className="mx-16">
			<h1 className=" grid text-green font-bold text-2xl justify-center mb-5">
				{chosenExam?.category}
			</h1>
			{isSubmit && !isOpenScoreNotification && (
				<ScoreNotification
					setIsOpenScoreNotification={setIsOpenScoreNotification}
					setIsSubmit={setIsSubmit}
					totalScore={totalScore}
					totalQuestions={questionList.length}
					passGrade={chosenExam?.passGrade}
				/>
			)}
			<div className="exam-info p-3 rounded-xl bg-light mb-8">
				<p className="text-brown font-bold mb-1">
					Chuyên môn: <span>{chosenExam?.serviceId?.name}</span>
				</p>
				<p className="mb-1">
					Thời gian còn lại:{' '}
					<span className="text-primary text-sm font-bold">
						{chosenExam?.duration} phút
					</span>
				</p>
				<p className="mb-1">Câu hỏi:</p>
				<div className="number-list mb-2 flex">
					{Array.from(
						{ length: questionList.length },
						(_, index) => index + 1
					).map((item, index) => {
						const handleClickQuestion = () => {
						  questionRefs.current[index].scrollIntoView({
							behavior: 'smooth',
							block: 'start'
						  });
						};

						return (
							<div className="number-item rounded-md text-center mr-3 hover:cursor-pointer" onClick={handleClickQuestion}>
								<span>{item}</span>
							</div>
						);
					})}
				</div>
				{!isOpenScoreNotification ? (
					<button
						className="inline text-center mt-0.5 pb-1 rounded-md bg-white text-primary submit-test-btn hover:bg-primary hover:text-white"
						onClick={handleSubmitExam}
					>
						<span>Nộp bài</span>
					</button>
				) : (
					<button
						className="inline text-center mt-0.5 pb-1 rounded-md bg-white text-primary submit-test-btn hover:bg-primary hover:text-white"
						onClick={() => navigate('/become-helper')}
					>
						<span>Quay về</span>
					</button>
				)}
			</div>
			<div className="question-list">
				{questionList?.map((question, index) => {
					return (
						<div ref={(ref) => (questionRefs.current[index] = ref)} className="question-item rounded-xl p-3 shadow-[-10px_13px_10px_-10px_rgba(0,0,0,0.8)] mb-8">
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
											defaultChecked={false}
											name={question._id}
											value={choice}
											onChange={(e) =>
												handleChangeAnswer(e.target.value, question._id)
											}
										/>
										<span>
											{String.fromCharCode(index + 65)}. {choice}
										</span>
									</div>
								);
							})}
							{isSubmit && (
								<p className="mt-2 text-xs text-green">
									Đáp án đúng: {question?.correctAnswer}
								</p>
							)}
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
