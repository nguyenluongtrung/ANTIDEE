import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import './ExamManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExam, getAllExams } from '../../../features/exams/examSlice';
import { Spinner } from '../../../components';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { IoAddOutline } from 'react-icons/io5';
import { calculateTotalPages, getPageItems, nextPage, previousPage } from '../../../utils/pagination';
import Pagination from '../../../components/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import DeletePopup from '../../../components/DeletePopup/DeletePopup';

export const ExamManagement = () => {
	const { exams, isLoading } = useSelector((state) => state.exams);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
	const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [selectedIdDelete, setSelectedIdDelete] = useState('');


	useEffect(() => {
		dispatch(getAllExams());
	}, []);

	const openDeletePopup = (examId) => {
        setSelectedIdDelete(examId);
        setIsDeletePopupOpen(true);
    };

    const closeDeletePopup = () => {
        setIsDeletePopupOpen(false);
        setSelectedIdDelete('');
    };

	const handleDeleteExam = async () => {
		const result = await dispatch(deleteExam(selectedIdDelete));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Xoá bài kiểm tra thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		closeDeletePopup();
	};

	const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const totalPages = calculateTotalPages(exams.length, rowsPerPage);
    const selectedExams = getPageItems(exams, currentPage, rowsPerPage);

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

				<DeletePopup
                    open={isDeletePopupOpen}
                    onClose={closeDeletePopup}
                    deleteAction={handleDeleteExam}
                    itemName="đề thi"
                />

				<div className="flex">
					<div className="flex-1 pt-2">
						<span>Hiển thị </span>
						<select
							className="rounded-md p-1 mx-1 hover:cursor-pointer bg-light_purple"

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
						className="bg-pink text-white rounded-md block mx-auto"
						style={{ width: '150px' }}
						onClick={() => navigate('create')}
					>
						<div className="flex items-center">
							<IoAddOutline className="size-8 pl-2 mr-2" />
							<span className="text-sm pr-2">Thêm đề thi</span>
						</div>
					</button>
				</div>
				<table className="w-full border-b border-gray mt-3">
					<thead>
						<tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
							<td className="py-2 px-4 text-center font-bold">STT</td>
							<td className="py-2 px-4 text-center font-bold">Tên</td>
							<td className="py-2 px-4 text-center font-bold">Chứng chỉ</td>
							<td className="py-2 px-4 text-center font-bold">Danh mục</td>
							<td className="py-2 px-4 text-center font-bold">Thời gian</td>
							<td className="py-2 px-4 text-center font-bold">Điểm cần đạt</td>
							<td className="py-2 px-4 text-center font-bold">Chi tiết</td>
							<td className="py-2 px-4 text-center font-bold">Hành Động</td>
						</tr>
					</thead>
					<tbody>
						{selectedExams?.map((exam, index) => {
							return (
								<tr className="hover:bg-light_purple transition-colors group odd:bg-light_purple hover:cursor-pointer">
									<td className="font-medium text-center text-gray p-3">
										<span>{index + 1}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>{exam?.name}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>
											{String(exam?.qualificationId?.name)
												.substring(10, 11)
												.toUpperCase() +
												String(exam?.qualificationId?.name).substring(11)}
										</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>{exam.category}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>{exam.duration} phút</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>
											{exam.passGrade} / {exam.questions.numOfQuestions}
										</span>
									</td>
									<td className="font-medium text-center text-gray">
										<button
											className="hover:cursor-pointer text-xl pt-1.5"
											
										>
											<MdOutlineRemoveRedEye className="block mx-auto" />
										</button>
									</td>
									<td className="">
										<div className="flex items-center justify-center">
											<button
												className="flex items-center justify-end py-3 pr-2 text-xl"
												onClick={() => navigate(`update/${exam._id}`)}
											>
												<BiEdit className="text-green hover:text-primary" />
											</button>
											<button className="flex items-center justify-start py-3 pl-2 text-xl">
												<BiTrash
													className="text-red hover:text-primary"
                                                    onClick={() => openDeletePopup(exam._id)}
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
