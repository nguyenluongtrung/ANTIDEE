import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './CreateQuestion.css';
import { useEffect, useRef, useState } from 'react';
import { getAllServices } from '../../../../features/services/serviceSlice';
import { createQuestions } from '../../../../features/questions/questionSlice';
import * as XLSX from 'xlsx';
import { extractOptions } from '../../../../utils';
import { saveAs } from 'file-saver';
import { FiDownloadCloud } from 'react-icons/fi';
import { FiUploadCloud } from 'react-icons/fi';

export const CreateQuestion = ({
	setIsOpenCreateQuestion,
	handleGetAllQuestions,
}) => {
	const [data, setData] = useState([]);
	const fileRef = useRef(null);
	const { isLoading: questionLoading } = useSelector(
		(state) => state.questions
	);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllServices());
	}, []);

	const handleDownload = (event) => {
		event.preventDefault();
		const data = [
			{
				'Dịch vụ': 'Chăm sóc người già',
				'Nội dung': 'Khi chăm sóc người già, bạn cần làm gì?',
				'Độ khó': 'Khó',
				'Câu trả lời đúng': 'Chi tiền mặt',
				'Giải thích': 'Chi tiền mặt',
				'Các lựa chọn': 'A. Chi tiền mặt B. Dùng thẻ',
			},
		];

		const worksheet = XLSX.utils.json_to_sheet(data);

		const workbook = XLSX.utils.book_new();

		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample Data');

		const excelBuffer = XLSX.write(workbook, {
			bookType: 'xlsx',
			type: 'array',
		});

		const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
		saveAs(blob, 'sample.xlsx');
	};

	const handleSubmitQuestionList = async (data) => {
		const newQuestionList = [];
		data.forEach((question) => {
			const choices = extractOptions(question['Các lựa chọn']);
			newQuestionList.push({
				content: question['Nội dung'],
				correctAnswer: question['Câu trả lời đúng'],
				explanation: question['Giải thích'],
				difficultyLevel: question['Độ khó'],
				serviceName: question['Dịch vụ'],
				choices,
			});
		});
		const result = await dispatch(createQuestions(newQuestionList));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Thêm câu hỏi thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		setIsOpenCreateQuestion(false);
		handleGetAllQuestions();
	};

	const handleFileUpload = (e) => {
		const reader = new FileReader();
		reader.readAsBinaryString(e.target.files[0]);
		reader.onload = (e) => {
			const data = e.target.result;
			const workbook = XLSX.read(data, { type: 'binary' });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const parsedData = XLSX.utils.sheet_to_json(sheet);
			setData(parsedData);
		};
	};

	if (questionLoading) {
		return <Spinner />;
	}

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmitQuestionList(data);
				}}
				className="content rounded-md p-5"
				style={{ width: '60vw' }}
			>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => setIsOpenCreateQuestion(false)}
				/>

				<p className="grid text-green font-bold text-xl justify-center">
					TẠO CÂU HỎI
				</p>
				<div className="flex gap-3">
					<button
						className="bg-yellow text-white py-2 rounded-md  flex gap-2 justify-center items-center mb-3"
						style={{ width: '150px' }}
						onClick={handleDownload}
					>
						<FiDownloadCloud size={20} />
						Tải file mẫu
					</button>
					<div>
						<button
							className="bg-purple text-white py-2 rounded-md mb-3 flex gap-2 justify-center items-center"
							style={{ width: '170px' }}
							onClick={(e) => {e.preventDefault(); fileRef.current.click()}}
						>
							<FiUploadCloud size={20} /> Upload file lên
						</button>
					</div>
				</div>
				<div>
					<input
						type="file"
						ref={fileRef}
						hidden
						accept=".xlsx, .xls"
						onChange={handleFileUpload}
					/>
				</div>
				<div className=' max-h-80 overflow-y-auto'>
				{data.length > 0 && (
					<table className="table">
						<thead>
							<tr>
								{Object.keys(data[0]).map((key) => (
									<th key={key}>{key}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{data.map((row, index) => (
								<tr key={index}>
									{Object.values(row).map((value, index) => (
										<td key={index} className='text-center'>{value}</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				)}
				</div>
				
				<button
					type="submit"
					className={`block  text-white text-center rounded-md p-2 font-medium mb-1 mt-3 ${
						data.length == 0 ? 'bg-gray' : 'bg-primary'
					}`}
					disabled={data.length == 0}
				>
					Tạo câu hỏi
				</button>
			</form>
		</div>
	);
};
