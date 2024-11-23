import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../components';
import {
	getJobPost,
	getMyReceivedJobs,
	updateJobPost,
} from '../../../features/jobPosts/jobPostsSlice';
import {
	formatDate,
	formatTime,
	formatWorkingTime,
} from '../../../utils/format';
import { MyJobDetail } from './MyJobDetail/MyJobDetail';
import Pagination from '../../../components/Pagination/Pagination';
import {
	calculateTotalPages,
	getPageItems,
	nextPage,
	previousPage,
} from '../../../utils/pagination';
import { useSearchParams } from 'react-router-dom';
import { JobPostCancel } from './JobPostCancel/JobPostCancel';
import { getFeedbackDetail } from '../../../features/domesticHelperFeedback/domesticHelperFeedbackSlice';
import { CustomerFeedBackReview } from './CustomerFeedback/CustomerFeedbackReview';
import { CustomerFeedback } from './CustomerFeedback/CustomerFeedback';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';

export const MyJobs = () => {
	const [isOpenJobPostDetail, setIsOpenJobPostDetail] = useState(false);
	const [isOpenCancelForm, setIsOpenCancelForm] = useState(false);
	const [isOpenFeedbackPopup, setIsOpenFeedbackPopup] = useState(false);
	const [isOpenReviewPopup, setIsOpenReviewPopup] = useState(false);
	const [filterOption, setFilterOption] = useState('readyToWork');
	const [myJobs, setMyJobs] = useState([]);
	const [selectedJobPost, setSelectedJobPost] = useState();
	const [selectedFeedback, setSelectedFeedback] = useState();
	const [searchParams, setSearchParams] = useSearchParams();
	const dispatch = useDispatch();
	const { isLoading: accountLoading } = useSelector((state) => state.auth);
	const { isLoading: jobPostLoading } = useSelector((state) => state.jobPosts);
	const [rowsPerPage, setRowsPerPage] = useState(6);
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = calculateTotalPages(myJobs.length, rowsPerPage);
	const selectedJobs = getPageItems(myJobs, currentPage, rowsPerPage);

	const handleNextPage = () =>
		setCurrentPage(nextPage(currentPage, totalPages));
	const handlePreviousPage = () => setCurrentPage(previousPage(currentPage));

	async function getMyJobList(filterOption) {
		let output = await dispatch(getMyReceivedJobs({ option: filterOption }));
		if (output.type.endsWith('fulfilled')) {
			setMyJobs(output.payload);
		} else {
			setMyJobs([]);
		}
	}

	const handleGetJobPostDetail = async (jobPostId) => {
		const result = await dispatch(getJobPost(jobPostId));
		if (result.type.includes('fulfilled')) {
			setSelectedJobPost(result.payload);
			setIsOpenJobPostDetail(true);
			if (filterOption == 'completed') {
				const feedbackData = await dispatch(getFeedbackDetail({ jobPostId, from: 'domesticHelper' }));
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

	const handleCompleteJob = async () => {
		const jobPostData = {
			...selectedJobPost,
			hasCompleted: {
				...selectedJobPost.hasCompleted,
				domesticHelperConfirm: true,
			},
		};
		const result = await dispatch(
			updateJobPost({ jobPostData, id: selectedJobPost._id })
		);

		if (result.type.endsWith('fulfilled')) {
			toast.success('Xác nhận hoàn thành công việc thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		getMyJobList(filterOption);
	}

	useEffect(() => {
		const jobId = searchParams.get('id');
		if (jobId) {
			handleGetJobPostDetail(jobId);
		}
	}, [searchParams.get('id')]);

	useEffect(() => {
		setCurrentPage(1);
		getMyJobList(filterOption);
	}, [filterOption]);

	if (jobPostLoading || accountLoading) {
		return <Spinner />;
	}

	return (
		<div>
			<div className="px-16 pt-20 mb-10">
				{isOpenJobPostDetail && (
					<MyJobDetail
						selectedJobPost={selectedJobPost}
						selectedFeedback={selectedFeedback}
						onClose={() => {
							setIsOpenJobPostDetail(false);
							setSearchParams({});
							getMyJobList(filterOption);
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
						onCompleteJob={() => {
							handleCompleteJob();
							setIsOpenJobPostDetail(false);
							setSearchParams({});
							setSelectedJobPost();
						}}
					/>
				)}
				{isOpenCancelForm && (
					<JobPostCancel
						jobPostId={selectedJobPost?._id}
						onClose={() => {
							setIsOpenCancelForm(false);
							setSearchParams({});
							getMyJobList(filterOption);
							setSelectedJobPost();
						}}
					/>
				)}
				{isOpenFeedbackPopup && (
					<CustomerFeedback
						selectedJobPost={selectedJobPost}
						onClose={() => {
							setIsOpenFeedbackPopup(false);
							setSearchParams({});
							getMyJobList(filterOption);
							setSelectedJobPost();
						}}
					/>
				)}

				{isOpenReviewPopup && (
					<CustomerFeedBackReview
						selectedJobPost={selectedJobPost}
						selectedFeedback={selectedFeedback}
						onClose={() => {
							setIsOpenReviewPopup(false);
							setSearchParams({});
							getMyJobList(filterOption);
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
								checked={filterOption === 'readyToWork'}
								onChange={() => {
									setFilterOption('readyToWork');
									getMyJobList('readyToWork');
								}}
							/>
							<p className="font-bold">Chuẩn bị làm</p>
						</div>
						<div className="flex mr-5">
							<input
								type="radio"
								className="w-3 mr-2"
								name="filterOption"
								checked={filterOption === 'completed'}
								onChange={() => {
									setFilterOption('completed');
									getMyJobList('completed');
								}}
							/>
							<p className="font-bold">Đã hoàn thành</p>
						</div>
					</div>
				</div>
				{myJobs.length == 0 ? (
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
										<div className="triangle-down absolute top-0 right-0"></div>
									)}
									<p className="text-gray mb-2">
										Bắt đầu lúc:{' '}
										<span className="text-brown">
											{formatDate(post?.workingTime?.startingDate)}{' '}
											{formatWorkingTime(post?.workingTime?.startingHour)}
										</span>
									</p>
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
									{Math.min(currentPage * rowsPerPage, myJobs?.length)}
								</span>{' '}
								trong <span className="font-medium">{myJobs?.length}</span> kết
								quả
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
