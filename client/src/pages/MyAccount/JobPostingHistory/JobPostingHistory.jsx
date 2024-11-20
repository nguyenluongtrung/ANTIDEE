import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../components';
import {
	getJobPost,
	getMyJobPostingHistory,
} from '../../../features/jobPosts/jobPostsSlice';
import {
	formatDate,
	formatTime,
	formatWorkingTime,
} from '../../../utils/format';
import { HistoryJobPostDetail } from './HistoryJobPostDetail/HistoryJobPostDetail';
import {
	calculateTotalPages,
	getPageItems,
	nextPage,
	previousPage,
} from '../../../utils/pagination';
import Pagination from '../../../components/Pagination/Pagination';
import { useSearchParams } from 'react-router-dom';
import { JobPostCancel } from './JobPostCancel/JobPostCancel';
import { DomesticHelperFeedback } from './DomesticHelperPage/DomesticHelperFeedback';
import { DomesticHelperReview } from './DomesticHelperPage/DomesticHelperReview';
import { getFeedbackDetail } from '../../../features/domesticHelperFeedback/domesticHelperFeedbackSlice';

export const JobPostingHistory = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [myJobHistory, setMyJobHistory] = useState([]);
	const [isOpenJobPostDetail, setIsOpenJobPostDetail] = useState(false);
	const [isOpenCancelForm, setIsOpenCancelForm] = useState(false);
	const [isOpenFeedbackPopup, setIsOpenFeedbackPopup] = useState(false);
	const [isOpenReviewPopup, setIsOpenReviewPopup] = useState(false);
	const [selectedJobPost, setSelectedJobPost] = useState();
	const [selectedFeedback, setSelectedFeedback] = useState();
	const [filterOption, setFilterOption] = useState('hasNotDomesticHelperYet');
	const dispatch = useDispatch();
	const { isLoading: accountLoading } = useSelector((state) => state.auth);
	const { isLoading: jobPostLoading } = useSelector((state) => state.jobPosts);

	const [rowsPerPage, _setRowsPerPage] = useState(6);
	const [currentPage, setCurrentPage] = useState(1);

	async function getHistoryJobList(filterOption) {
		let output = await dispatch(
			getMyJobPostingHistory({ option: filterOption })
		);

		if (output.type.endsWith('fulfilled')) {
			setMyJobHistory(output.payload);
		} else {
			setMyJobHistory([]);
		}
	}

	const handleGetJobPostDetail = async (jobPostId) => {
		const result = await dispatch(getJobPost(jobPostId));
		if (result.type.includes('fulfilled')) {
			setSelectedJobPost(result.payload);
			setIsOpenJobPostDetail(true);
			if (filterOption == 'completed') {
				const feedbackData = await dispatch(getFeedbackDetail({ jobPostId }));
				if (feedbackData.type.includes('fulfilled')) {
					setSelectedFeedback(feedbackData.payload);
				} else {
					setSelectedFeedback();
				}
			}
		} else {
			setIsOpenJobPostDetail(false);
			toast.error('Có lỗi xảy ra!');
		}
	};

	useEffect(() => {
		const jobId = searchParams.get('id');
		if (jobId) {
			handleGetJobPostDetail(jobId);
		}
	}, [searchParams.get('id')]);

	useEffect(() => {
		setCurrentPage(1);
		getHistoryJobList(filterOption);
	}, [filterOption]);

	const totalPages = calculateTotalPages(myJobHistory.length, rowsPerPage);
	const selectedJobs = getPageItems(myJobHistory, currentPage, rowsPerPage);

	const handleNextPage = () =>
		setCurrentPage(nextPage(currentPage, totalPages));
	const handlePreviousPage = () => setCurrentPage(previousPage(currentPage));

	if (jobPostLoading || accountLoading) {
		return <Spinner />;
	}

	return (
		<div>
			<div className="px-16 pt-20 mb-10">
				{isOpenJobPostDetail && (
					<HistoryJobPostDetail
						selectedJobPost={selectedJobPost}
						selectedFeedback={selectedFeedback}
						onClose={() => {
							setIsOpenJobPostDetail(false);
							setSearchParams({});
							getHistoryJobList(filterOption);
							setSelectedJobPost();
						}}
						onCancelJob={() => {
							setIsOpenJobPostDetail(false);
							setIsOpenCancelForm(true);
						}}
						onDomesticHelperFeedback={() => {
							setIsOpenJobPostDetail(false);
							setIsOpenFeedbackPopup(true);
						}}
						onFeedbackReview={() => {
							setIsOpenJobPostDetail(false);
							setIsOpenReviewPopup(true);
						}}
					/>
				)}

				{isOpenCancelForm && (
					<JobPostCancel
						jobPostId={selectedJobPost?._id}
						onClose={() => {
							setIsOpenCancelForm(false);
							setSearchParams({});
							getHistoryJobList(filterOption);
							setSelectedJobPost();
						}}
					/>
				)}

				{isOpenFeedbackPopup && (
					<DomesticHelperFeedback
						selectedJobPost={selectedJobPost}
						onClose={() => {
							setIsOpenFeedbackPopup(false);
							setSearchParams({});
							getHistoryJobList(filterOption);
							setSelectedJobPost();
						}}
					/>
				)}

				{isOpenReviewPopup && (
					<DomesticHelperReview
						selectedJobPost={selectedJobPost}
						selectedFeedback={selectedFeedback}
						onClose={() => {
							setIsOpenReviewPopup(false);
							setSearchParams({});
							getHistoryJobList(filterOption);
							setSelectedJobPost();
							setSelectedFeedback();
						}}
					/>
				)}

				<div
					className="filter-jobs bg-light mb-8"
					style={{ padding: '30px 300px' }}
				>
					<div className="flex mb-4 justify-between">
						<div className="flex mr-5">
							<input
								type="radio"
								className="w-3 mr-2"
								name="filterOption"
								checked={filterOption === 'hasNotDomesticHelperYet'}
								onChange={() => {
									setFilterOption('hasNotDomesticHelperYet');
									getHistoryJobList('hasNotDomesticHelperYet');
								}}
							/>
							<p className="font-bold">Chưa có người làm</p>
						</div>
						<div className="flex mr-5">
							<input
								type="radio"
								className="w-3 mr-2"
								name="filterOption"
								checked={filterOption === 'hasAlreadyDomesticHelper'}
								onChange={() => {
									setFilterOption('hasAlreadyDomesticHelper');
									getHistoryJobList('hasAlreadyDomesticHelper');
								}}
							/>
							<p className="font-bold">Đã có người làm</p>
						</div>
						<div className="flex mr-5">
							<input
								type="radio"
								className="w-3 mr-2"
								name="filterOption"
								checked={filterOption === 'completed'}
								onChange={() => {
									setFilterOption('completed');
									getHistoryJobList('completed');
								}}
							/>
							<p className="font-bold">Đã hoàn thành</p>
						</div>
						<div className="flex mr-5">
							<input
								type="radio"
								className="w-3 mr-2"
								name="filterOption"
								checked={filterOption === 'cancelled'}
								onChange={() => {
									setFilterOption('cancelled');
									getHistoryJobList('cancelled');
								}}
							/>
							<p className="font-bold">Đã hủy</p>
						</div>
						<div className="flex mr-5">
							<input
								type="radio"
								className="w-3 mr-2"
								name="filterOption"
								checked={filterOption === 'needToBeConfirmed'}
								onChange={() => {
									setFilterOption('needToBeConfirmed');
									getHistoryJobList('needToBeConfirmed');
								}}
							/>
							<p className="font-bold">Chờ xác nhận</p>
						</div>
					</div>
				</div>
				{myJobHistory.length == 0 ? (
					<div className="mx-auto">
						<img src="image/sad-icon.png" className="block m-auto w-52" />
						<p className="text-gray text-center">
							Rất tiếc, bạn hiện tại chưa có công việc nào
						</p>
					</div>
				) : (
					<div className="grid grid-cols-3 gap-28">
						{selectedJobs?.map((post) => {
							return (
								<div
									className={`shadow-xl p-7 hover:shadow-2xl hover:cursor-pointer relative ${
										post?.isUrgent && 'bg-light_pink'
									}`}
								>
									<p className="text-brown font-bold mb-3">
										{post?.serviceId?.name?.toUpperCase()}
									</p>
									{post?.isUrgent && (
										<div class="triangle-down absolute top-0 right-0"></div>
									)}
									<p className="text-gray mb-2">
										Bắt đầu lúc:{' '}
										<span className="text-brown">
											{formatDate(post?.workingTime?.startingDate)}{' '}
											{formatWorkingTime(post?.workingTime?.startingHour)}
										</span>
									</p>
									{post?.hasCompleted?.customerConfirm &&
									post?.hasCompleted?.domesticHelperConfirm ? (
										<p className="text-gray mb-2">
											Hoàn thành lúc: {''}
											<span className="text-brown">
												{formatDate(post?.hasCompleted?.completedAt)}{' '}
												{formatTime(
													Date.parse(post?.hasCompleted?.completedAt)
												)}
											</span>
										</p>
									) : (
										<div>
											<p className="text-gray mb-2">
												Đã đăng lúc: {''}
												<span className="text-brown">
													{formatDate(post?.createdAt)}{' '}
													{formatTime(Date.parse(post?.createdAt))}
												</span>
											</p>
											<p className="text-gray mb-2">
												Hết hạn lúc: {''}
												<span className="text-brown">
													{formatDate(post?.dueDate)}{' '}
												</span>
											</p>
										</div>
									)}

									<div className="border-2 border-gray  my-3">
										{post?.workload?.find(
											(option) => String(option?.optionName) === 'Thời gian'
										)?.optionValue == undefined ? (
											<div>
												<p className="text-gray mb-2 text-center mt-3">
													Số tiền:{' '}
												</p>
												<p className="text-center text-brown font-bold mb-3">
													{Intl.NumberFormat().format(post?.totalPrice)} VND
												</p>
											</div>
										) : (
											<div className="grid grid-cols-2">
												<div className="border-r-2 border-gray">
													<p className="text-gray mb-2 text-center mt-3">
														Làm trong:{' '}
													</p>
													<p className="text-center text-brown font-bold mb-3">
														{
															post?.workload?.find(
																(option) =>
																	String(option?.optionName) === 'Thời gian'
															)?.optionValue
														}{' '}
														giờ
													</p>
												</div>
												<div>
													<p className="text-gray mb-2 text-center mt-3">
														Số tiền:{' '}
													</p>
													<p className="text-center text-brown font-bold mb-3">
														{Intl.NumberFormat().format(post?.totalPrice)} VND
													</p>
												</div>
											</div>
										)}
									</div>
									<p className="text-gray mb-2 ">
										Tại:{' '}
										<span className="text-black">
											{post?.contactInfo?.address}
										</span>
									</p>
									<p className="text-gray mb-3">
										Ghi chú:{' '}
										<span className="text-black">
											{post?.note ? post?.note : 'Không có'}
										</span>
									</p>
									<div className="flex justify-center">
										<button
											className="text-white bg-brown rounded-2xl text-xs py-2.5 text-center hover:bg-light_yellow hover:text-brown"
											style={{ width: '70%' }}
											onClick={() => {
												setSearchParams({ id: post?._id });
												handleGetJobPostDetail(post?._id);
											}}
										>
											<p className="text-center">Xem chi tiết công việc</p>
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}

				<div className="flex items-center justify-between border-t border-gray bg-white px-4 py-3 mt-5 sm:px-6">
					<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
						<div>
							<p className="text-sm text-gray">
								Hiển thị{' '}
								<span className="font-medium">
									{(currentPage - 1) * rowsPerPage + 1}
								</span>{' '}
								đến{' '}
								<span className="font-medium">
									{Math.min(currentPage * rowsPerPage, myJobHistory.length)}
								</span>{' '}
								trong <span className="font-medium">{myJobHistory.length}</span>{' '}
								kết quả
							</p>
						</div>
						<div>
							<Pagination
								totalPages={totalPages}
								currentPage={currentPage}
								onPageChange={(page) => setCurrentPage(page)}
								onNextPage={handleNextPage}
								onPreviousPage={handlePreviousPage}
								rowsPerPage={rowsPerPage}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
