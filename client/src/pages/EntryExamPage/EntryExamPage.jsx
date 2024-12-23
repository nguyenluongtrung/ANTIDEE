import './EntryExamPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from './../../components';
import { useEffect, useState, useRef } from 'react';
import { getAllExams, saveExamResult } from '../../features/exams/examSlice';
import { ScoreNotification } from './ScoreNotification/ScoreNotification';
import { TimerCountDown } from './TimerCountDown/TimerCountDown';
import ConfirmPopup from '../../components/ConfirmPopup/ConfirmPopup';

export const EntryExamPage = () => {
	const { exams, isLoading: examLoading } = useSelector((state) => state.exams);
	const [chosenExam, setChosenExam] = useState(null);
	const [questionList, setQuestionList] = useState([]);
	const [totalScore, setTotalScore] = useState(0);
	const [answers, setAnswers] = useState([]);
	const [isSubmit, setIsSubmit] = useState(false);
	const [isOpenScoreNotification, setIsOpenScoreNotification] = useState(false);
	const [startTime, setStartTime] = useState(null);
	const questionRefs = useRef([]);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { examId } = useParams();
	const [openConfirmSubmitPopup, setOpenConfirmSubmitPopup] = useState(false);
	const submitRef = useRef();

	useEffect(() => {
		const asyncFn = async () => {
			const result = await dispatch(getAllExams());
			const chosenExam = result.payload.find((exam) => exam._id == examId);
			setChosenExam(chosenExam);
			setStartTime(new Date().getTime());
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

	const handleChangeAnswer = (content, questionId, questionNumber) => {
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
					questionNumber,
				},
			]);
		}
	};

	const handleSubmitExam = () => {
		setOpenConfirmSubmitPopup(false);
		answers.map((answer) => {
			const question = questionList.find(
				(question) => question._id == answer.questionId
			);
			if (
				String(question.correctAnswer).trim().toLowerCase() ==
				String(answer.answerContent).trim().toLowerCase()
			) {
				setTotalScore((totalScore) => totalScore + 1);
			}
		});
		setIsSubmit(true);
	};

	const closeConfirmPopup = () => {
		setOpenConfirmSubmitPopup(false);
	};

	useEffect(() => {
		if (!isOpenScoreNotification && isSubmit) {
			const examResult = {
				totalScore,
				duration: Math.round((new Date().getTime() - startTime) / 1000),
				isPassed: totalScore >= chosenExam?.passGrade,
			};
			dispatch(saveExamResult({ examResult, examId: chosenExam?._id }));
		}
	}, [isSubmit]);

	if (!Array.isArray(questionList) || examLoading || !chosenExam) {
		return <Spinner />;
	}

	return (
		<div className="mx-16 pt-20">
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
			{openConfirmSubmitPopup && (
				<ConfirmPopup
					open={openConfirmSubmitPopup}
					onClose={closeConfirmPopup}
					action={handleSubmitExam}
					itemName="nộp bài thi"
				/>
			)}

			<div className="exam-info p-3 rounded-xl bg-light mb-8" ref={submitRef}>
				<p className="text-brown font-bold mb-1">
					Chuyên môn: <span>{chosenExam?.qualificationId?.name}</span>
				</p>
				<p className="mb-1">
					Thời gian còn lại:{' '}
					<span className="text-primary text-sm font-bold">
						<TimerCountDown
							seconds={parseInt(chosenExam?.duration) * 60}
							handleSubmitExam={handleSubmitExam}
							isSubmit={isSubmit}
						/>
					</span>
				</p>
				<p className="mb-1">Câu hỏi:</p>
				<div className="number-list mb-2 flex flex-wrap ">
					{Array.from(
						{ length: questionList.length },
						(_, index) => index + 1
					).map((item, index) => {
						const handleClickQuestion = () => {
							questionRefs.current[index].scrollIntoView({
								behavior: 'smooth',
								block: 'start',
							});
						};
						return (
							<div
								className={`${
									answers.find(
										(answer) => Number(answer.questionNumber) === Number(item)
									) && 'bg-yellow'
								} number-item rounded-md text-center mt-3 mr-3 hover:cursor-pointer`}
								onClick={handleClickQuestion}
							>
								<span>{item}</span>
							</div>
						);
					})}
				</div>
				{!isOpenScoreNotification ? (
					<button
						className="inline text-center mt-0.5 pb-1 rounded-md bg-white text-primary submit-test-btn hover:bg-primary hover:text-white"
						onClick={() => setOpenConfirmSubmitPopup(true)}
					>
						<span>Nộp bài</span>
					</button>
				) : (
					<button
						className="inline text-center mt-0.5 pb-1 rounded-md bg-white text-primary submit-test-btn hover:bg-primary hover:text-white"
						onClick={() => navigate(-1)}
					>
						<span>Quay về</span>
					</button>
				)}
			</div>
			<div className="question-list">
				{questionList?.map((question, customIndex) => {
					return (
						<div
							ref={(ref) => (questionRefs.current[customIndex] = ref)}
							className="question-item rounded-xl p-3 shadow-[-10px_13px_10px_-10px_rgba(0,0,0,0.8)] mb-8"
						>
							<div>
								<span className="font-bold underline">
									Câu {customIndex + 1}:{' '}
								</span>
								<span>{question?.content}</span>
							</div>
							{question?.choices.map((choice, index) => {
								const isWrongAnswer =
									isSubmit &&
									answers.find(
										(answer) =>
											Number(answer.questionNumber) ===
												Number(customIndex + 1) &&
											String(answer.answerContent).trim().toLowerCase() !=
												String(question.correctAnswer).trim().toLowerCase() &&
											String(choice).trim().toLowerCase() ==
												String(answer.answerContent).trim().toLowerCase()
									);
								return (
									<div>
										<input
											type="radio"
											className="w-3 mr-2 radio-answer-item cursor-pointer"
											defaultChecked={false}
											name={question._id}
											value={choice}
											onChange={(e) =>
												handleChangeAnswer(
													e.target.value,
													question._id,
													customIndex + 1
												)
											}
										/>
										<span
											className={`${
												isSubmit &&
												String(choice).trim().toLowerCase() ==
													String(question?.correctAnswer)
														.trim()
														.toLowerCase() &&
												'text-green'
											} ${isWrongAnswer && 'text-red'}`}
										>
											{String.fromCharCode(index + 65)}. {choice}
										</span>
									</div>
								);
							})}
							{isSubmit && (
								<p className="mt-2 text-xs text-gray">
									Giải thích: {question?.explanation}
								</p>
							)}
						</div>
					);
				})}
				<h1
					className="text-center mb-8 font-bold text-anotherRed animate-bounce hover:cursor-pointer"
					onClick={() => {
						submitRef.current?.scrollIntoView({
							block: 'center',
							behavior: 'smooth',
						});
					}}
				>
					*Lướt lên trên để nộp bài
				</h1>
			</div>
		</div>
	);
};
