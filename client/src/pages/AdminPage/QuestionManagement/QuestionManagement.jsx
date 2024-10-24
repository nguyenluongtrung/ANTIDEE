import toast, { ToastBar, Toaster } from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import {
	deleteQuestion,
	getAllQuestions,
} from '../../../features/questions/questionSlice';
import { Spinner } from '../../../components';
import { CreateQuestion } from './CreateQuestion/CreateQuestion';
import { QuestionDetail } from './QuestionDetail/QuestionDetail';
import { UpdateQuestion } from './UpdateQuestion/UpdateQuestion';
import { calculateTotalPages, getPageItems, nextPage, previousPage } from '../../../utils/pagination';

export const QuestionManagement = () => {
	const [isOpenCreateQuestion, setIsOpenCreateQuestion] = useState(false);
	const [isOpenDetailQuestion, setIsOpenDetailQuestion] = useState(false);
	const [isOpenUpdateQuestion, setIsOpenUpdateQuestion] = useState(false);
	const [chosenQuestionId, setChosenQuestionId] = useState('');
	const { isLoading } = useSelector((state) => state.questions);
	const [questions, setQuestions] = useState([]);
	const dispatch = useDispatch();

	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	async function initialQuestions() {
		let output = await dispatch(getAllQuestions());
		setQuestions(output.payload);
	}
	useEffect(() => {
		initialQuestions();
	}, [])

	useEffect(() => {
		dispatch(getAllQuestions());
	}, []);

	const handleGetAllQuestions = () => {
		Promise.all([dispatch(getAllQuestions())]).catch((error) => {
			console.error('Error during dispatch:', error);
		});
	};

	const handleDeleteQuestion = async (id) => {
		const result = await dispatch(deleteQuestion(id));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Xoá câu hỏi thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
	};

	const handleRowsPerPageChange = (e) => {
		setRowsPerPage(Number(e.target.value));
		setCurrentPage(1);
	};


	const totalPages = calculateTotalPages(questions.length, rowsPerPage);
	const selectedQuestions = getPageItems(questions, currentPage, rowsPerPage);

	const handleNextPage = () => {
		setCurrentPage(nextPage(currentPage, totalPages));
	};

	const handlePreviousPage = () => {
		setCurrentPage(previousPage(currentPage));
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<div className="w-full min-h-screen bg-white flex flex-row">
			<AdminSidebar />
			<div className="flex-1 px-10 pt-5">
				<Toaster>
					{(t) => (
						<ToastBar
							toast={t}
							style={{
								...t.style,
								animation: t.visible
									? 'custom-enter 1s ease'
									: 'custom-exit 1s ease',
							}}
						/>
					)}
				</Toaster>

				{isOpenCreateQuestion && (
					<CreateQuestion
						setIsOpenCreateQuestion={setIsOpenCreateQuestion}
						handleGetAllQuestions={handleGetAllQuestions}
					/>
				)}

				{isOpenDetailQuestion && (
					<QuestionDetail
						chosenQuestionId={chosenQuestionId}
						setIsOpenDetailQuestion={setIsOpenDetailQuestion}
						handleGetAllQuestions={handleGetAllQuestions}
					/>
				)}

				{isOpenUpdateQuestion && (
					<UpdateQuestion
						chosenQuestionId={chosenQuestionId}
						setIsOpenUpdateQuestion={setIsOpenUpdateQuestion}
						handleGetAllQuestions={handleGetAllQuestions}
					/>
				)}

				<div className="flex">
					<div className="flex-1 pt-2">
						<span>Hiển thị </span>
						<select
							className="rounded-md p-1 mx-1 hover:cursor-pointer"
							style={{ backgroundColor: '#E0E0E0' }}
							value={rowsPerPage}
							onChange={handleRowsPerPageChange}
						>
							<option>10</option>
							<option>20</option>
							<option>30</option>
						</select>
						<span> hàng</span>
					</div>
					<button
						className="bg-pink text-white py-2 rounded-md block mx-auto"
						style={{ width: '100px' }}
						onClick={() => setIsOpenCreateQuestion(true)}
					>
						<span>Thêm câu hỏi</span>
					</button>
				</div>
				<table className="w-full border-b border-gray mt-3">
					<thead>
						<tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
							<td className="py-2 px-4 text-center font-bold">STT</td>
							<td className="py-2 px-4 text-center font-bold">Dịch vụ</td>
							<td className="py-2 px-4 text-center font-bold">Nội dung</td>
							<td className="py-2 px-4 text-center font-bold">Độ khó</td>
							<td className="py-2 px-4 text-center font-bold">Chi tiết</td>
							<td className="py-2 px-4 text-center font-bold">Hành Động</td>
						</tr>
					</thead>
					<tbody>
						{selectedQuestions && selectedQuestions
							.filter((question) => question != undefined)
							?.map((question, index) => {
								return (
									<tr className="hover:bg-light_purple transition-colors group odd:bg-light_purple hover:cursor-pointer">
										<td className="font-medium text-center text-gray p-3">
											<span>{index + 1}</span>
										</td>
										<td className="font-medium text-center text-gray">
											<span>{question?.serviceId?.name}</span>
										</td>
										<td className="font-medium text-gray">
											<span>{question.content}</span>
										</td>
										<td className="font-medium text-center text-gray">
											<span>{question.difficultyLevel}</span>
										</td>
										<td className="font-medium text-center text-gray">
											<button
												className="hover:cursor-pointer text-xl pt-1.5"
												onClick={() => {
													setIsOpenDetailQuestion(true);
													setChosenQuestionId(question._id);
												}}
											>
												<MdOutlineRemoveRedEye className="block mx-auto" />
											</button>
										</td>
										<td className="">
											<div className="flex items-center justify-center">
												<button
													className="flex items-center justify-end py-3 pr-2 text-xl"
													onClick={() => {
														setIsOpenUpdateQuestion(true);
														setChosenQuestionId(question._id);
													}}
												>
													<BiEdit className="text-green" />
												</button>
												<button className="flex items-center justify-start py-3 pl-2 text-xl">
													<BiTrash
														className="text-red"
														onClick={() => handleDeleteQuestion(question._id)}
													/>
												</button>
											</div>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
				<div className="flex justify-center items-center mt-4 space-x-2">
					<button 
						className="bg-light_gray hover:bg-gray hover:text-white w-fit px-4 py-2 rounded disabled:opacity-50"
						disabled={currentPage === 1}
						onClick={handlePreviousPage}
					>
						&#9664;
					</button>
					<span className="text-sm font-semibold">Page {currentPage} of {totalPages}</span>
					<button
						className="bg-light_gray hover:bg-gray hover:text-white w-fit px-4 py-2 rounded disabled:opacity-50"
						disabled={currentPage === totalPages}
						onClick={handleNextPage}
					>
						&#9654;
					</button>
				</div>

			</div>
		</div>
	);
};
