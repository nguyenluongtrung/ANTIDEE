import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import { AiOutlineClose } from 'react-icons/ai';
import {
	formatDate,
	formatTime,
	formatWorkingTime,
} from '../../../../utils/format';
import toast from 'react-hot-toast';
import { IoMdCheckboxOutline } from 'react-icons/io';
import { selectATasker, updateJobPost } from '../../../../features/jobPosts/jobPostsSlice';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { DomesticHelper } from '../../../MyAccount/JobPostingHistory/DomesticHelperPage/DomesticHelper';
import { getAllFeedbacks } from '../../../../features/domesticHelperFeedback/domesticHelperFeedbackSlice';
import { DomesticHelperReview } from '../DomesticHelperPage/DomesticHelperReview';
import { JobPostCancel } from '../JobPostCancel/JobPostCancel';

export const HistoryJobPostDetail = ({
	chosenJobPostId,
	setIsOpenJobPostDetail,
	accounts,
	myAccountId,
	getAllInitialJobList,
}) => {
	const [isOpenApplicantsDetails, setIsOpenApplicantsDetails] = useState(false);
	const [feedbacks, setFeedbacks] = useState([]);
	const { jobPosts, isLoading } = useSelector((state) => state.jobPosts);
	const [isOpenFeedbackPopup, setIsOpenFeedbackPopup] = useState(false);
	const [isOpenReviewPopup, setIsOpenReviewPopup] = useState(false);
	const [isOpenCancelForm, setIsOpenCancelForm] = useState(false);
	const [chosenJobPost, setChosenJobPost] = useState(
		jobPosts?.find((jobPost) => String(jobPost._id) === String(chosenJobPostId))
	);

	const dispatch = useDispatch();

	const handleSelectTasker = async (id) => {
		const result = await dispatch(
			selectATasker({ jobPostId: chosenJobPostId, taskerId: id })
		);

		if (result.type.endsWith('fulfilled')) {
			toast.success('Chọn người giúp việc thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
	};

	const handleGetAllInitialFeedbacks = async (id) => {
		const result = await dispatch(getAllFeedbacks());

		setFeedbacks(result.payload);
	};

	const handleCompleteJobPost = async (e) => {
		e.preventDefault();
		const jobPostData = {...chosenJobPost, hasCompleted: {...chosenJobPost.hasCompleted, customerConfirm: true, completedAt: new Date()}}
		const result = await dispatch(updateJobPost({jobPostData, id: chosenJobPostId}));

		if (result.type.endsWith('fulfilled')) {
			toast.success('Xác nhận hoàn thành công việc thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		setIsOpenJobPostDetail(false);
		getAllInitialJobList();
	}

	useEffect(() => {
		handleGetAllInitialFeedbacks();
	}, []);

	if (isLoading) {
		return <Spinner />;
	}
	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form className="content rounded-md p-5" style={{ width: '35vw' }}>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => {
						setIsOpenJobPostDetail(false);
						handleGetAllQuestions();
					}}
				/>

				{!isOpenApplicantsDetails ? (
					<>
						<p className="grid text-green font-bold text-xl justify-center mb-3">
							XEM CHI TIẾT CÔNG VIỆC
						</p>
						<div className="">
							<p className="text-brown font-bold mb-3">
								{chosenJobPost?.serviceId?.name?.toUpperCase()}
							</p>
							<p className="text-gray mb-2">
								Bắt đầu lúc:{' '}
								<span className="text-brown">
									{formatDate(chosenJobPost?.workingTime?.startingDate)}{' '}
									{formatWorkingTime(chosenJobPost?.workingTime?.startingHour)}
								</span>
							</p>
							<p className="text-gray mb-2">
								Đã đăng lúc: {''}
								<span className="text-brown">
									{formatDate(chosenJobPost?.createdAt)}{' '}
									{formatTime(Date.parse(chosenJobPost?.createdAt))}
								</span>
							</p>
							<div className="border-2 border-gray  my-3">
								{chosenJobPost?.workload?.find(
									(option) => String(option?.optionName) === 'Thời gian'
								)?.optionValue == undefined ? (
									<div>
										<p className="text-gray mb-2 text-center mt-3">Số tiền: </p>
										<p className="text-center text-brown font-bold mb-3">
											{chosenJobPost?.totalPrice} VND
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
													chosenJobPost?.workload?.find(
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
												{chosenJobPost?.totalPrice} VND
											</p>
										</div>
									</div>
								)}
							</div>
							<p className="text-gray mb-2 ">
								Tại:{' '}
								<span className="text-black">
									{chosenJobPost?.contactInfo?.address}
								</span>
							</p>
							<p className="text-gray mb-2">
								Khối lượng công việc:
								{chosenJobPost?.workload?.map((option) => {
									return (
										<p className="text-black ml-10">
											+ {option?.optionName}: {option?.optionValue}
										</p>
									);
								})}
							</p>
							{chosenJobPost?.isChosenYourself &&
								chosenJobPost?.domesticHelperId &&
								!chosenJobPost?.hasCompleted?.customerConfirm &&
								!chosenJobPost?.hasCompleted?.domesticHelperConfirm && (
									<p className="text-gray mb-3">
										Người giúp việc:{' '}
										<span className="text-black">
											{
												accounts?.find(
													(acc) =>
														String(acc._id) ==
														String(chosenJobPost?.domesticHelperId)
												)?.name
											}
										</span>
									</p>
								)}
							{chosenJobPost?.hasCompleted?.customerConfirm &&
								chosenJobPost?.hasCompleted?.domesticHelperConfirm &&
								chosenJobPost?.domesticHelperId && (
									<p className="text-gray mb-3">
										Người giúp việc:{' '}
										<span className="text-black">
											{
												accounts?.find(
													(acc) =>
														String(acc._id) ==
														String(chosenJobPost?.domesticHelperId)
												)?.name
											}
										</span>{' '}
										&nbsp;
										{feedbacks?.findIndex(
											(feedback) =>
												String(feedback.jobPostId) === String(chosenJobPostId)
										) !== -1 ? (
											<span
												className="text-black italic hover:underline hover:text-brown hover:cursor-pointer"
												onClick={() => {
													setIsOpenReviewPopup(true);
												}}
											>
												(Review)
											</span>
										) : (
											<span
												className="text-black italic hover:underline hover:text-brown hover:cursor-pointer"
												onClick={() => {
													setIsOpenFeedbackPopup(true);
												}}
											>
												(Đánh giá)
											</span>
										)}
									</p>
								)}

							<p className="text-gray mb-3">
								Ghi chú:{' '}
								<span className="text-black">
									{chosenJobPost?.note ? chosenJobPost?.note : 'Không có'}
								</span>
							</p>
							{chosenJobPost?.cancelDetails?.isCanceled && (
								<p className="text-gray mb-3">
									Lí do hủy việc:{' '}
									<span className="text-black">
										{chosenJobPost?.cancelDetails?.reason}
									</span>
								</p>
							)}
							{chosenJobPost?.isChosenYourself &&
								!chosenJobPost?.domesticHelperId && (
									<p
										className="text-gray mb-3 hover:text-brown hover:cursor-pointer"
										onClick={() => setIsOpenApplicantsDetails(true)}
									>
										Xem danh sách người ứng tuyển{' '}
									</p>
								)}
							{!chosenJobPost?.hasCompleted?.customerConfirm &&
								!chosenJobPost?.hasCompleted?.domesticHelperConfirm &&
								!chosenJobPost?.cancelDetails?.isCanceled && (
									<div className="flex justify-center">
										<button
											className={
												'text-white rounded-2xl text-xs py-2.5 text-center bg-brown hover:bg-light_yellow hover:text-brown'
											}
											style={{ width: '70%' }}
											onClick={(e) => {
												e.preventDefault();
												setIsOpenCancelForm(true);
											}}
										>
											<p className="text-center">Hủy việc</p>
										</button>
									</div>
							)}
							{!chosenJobPost?.hasCompleted?.customerConfirm &&
								chosenJobPost?.hasCompleted?.domesticHelperConfirm &&
								!chosenJobPost?.cancelDetails?.isCanceled && (
									<div className="flex justify-center">
										<button
											className={
												'text-white rounded-2xl text-xs py-2.5 text-center bg-brown hover:bg-light_yellow hover:text-brown'
											}
											style={{ width: '70%' }}
											onClick={handleCompleteJobPost}
										>
											<p className="text-center">Xác nhận hoàn thành công việc</p>
										</button>
									</div>
							)}
						</div>
					</>
				) : (
					<>
						<p className="grid text-green font-bold text-xl justify-center mb-3">
							DANH SÁCH NHỮNG NGƯỜI ỨNG TUYỂN
						</p>
						<div>
							{chosenJobPost?.applicants?.map((applicant, index) => (
								<div
									className="flex rounded-2xl p-5 mb-5"
									style={{ backgroundColor: 'rgba(100,100,100,0.1)' }}
								>
									<div className="mr-10 flex flex-col justify-center">
										<img
											src={
												accounts?.find(
													(acc) => String(acc._id) == String(applicant)
												)?.avatar
											}
											className="w-16 rounded-full"
										/>
									</div>
									<div className="w-80">
										<p className="font-bold">
											{
												accounts?.find(
													(acc) => String(acc._id) == String(applicant)
												)?.name
											}
										</p>
										<p className="">Điểm uy tín: 4.5 / 5.0</p>
										<p className="italic mt-1 text-white bg-primary rounded-2xl p-1 w-20 text-center">
											{
												accounts?.find(
													(acc) => String(acc._id) == String(applicant)
												)?.accountLevel?.domesticHelperLevel?.name
											}
										</p>
									</div>
									<div className="flex flex-col justify-center">
										<IoMdCheckboxOutline
											size={25}
											className="text-brown hover:cursor-pointer hover:text-green"
											onClick={() => handleSelectTasker(applicant)}
										/>
									</div>
								</div>
							))}
						</div>
						<div className="flex justify-center mt-5">
							<button
								className={
									'text-white rounded-2xl text-xs py-2.5 text-center bg-brown hover:bg-light_yellow hover:text-brown'
								}
								style={{ width: '70%' }}
								onClick={() => setIsOpenApplicantsDetails(false)}
							>
								<p className="text-center">Quay về</p>
							</button>
						</div>
					</>
				)}
			</form>
			{isOpenCancelForm && (
				<div className="popup active">
					<div
						className="overlay"
						onClick={() => setIsOpenCancelForm(false)}
					></div>
					<div className="content rounded-md">
						<AiOutlineClose
							className="absolute text-sm hover:cursor-pointer m-5"
							onClick={() => setIsOpenCancelForm(false)}
						/>
						<JobPostCancel
							jobPostId={chosenJobPost?._id}
							setIsOpenCancelForm={setIsOpenCancelForm}
							myAccountId={myAccountId}
							getAllInitialJobList={getAllInitialJobList}
							setIsOpenJobPostDetail={setIsOpenJobPostDetail}
						/>
					</div>
				</div>
			)}

			{isOpenFeedbackPopup && (
				<div className="popup active">
					<div
						className="overlay"
						onClick={() => setIsOpenFeedbackPopup(false)}
					></div>
					<div className="content rounded-md">
						<AiOutlineClose
							className="absolute text-sm hover:cursor-pointer m-5"
							onClick={() => setIsOpenFeedbackPopup(false)}
						/>
						<DomesticHelper
							serviceName={chosenJobPost?.serviceId?.name}
							serviceAddress={chosenJobPost?.contactInfo?.address}
							domesticHelperId={chosenJobPost?.domesticHelperId}
							avatar={
								accounts?.find(
									(acc) =>
										String(acc._id) == String(chosenJobPost?.domesticHelperId)
								)?.avatar
							}
							jobPostId={chosenJobPost?._id}
						/>
					</div>
				</div>
			)}
			{isOpenReviewPopup && (
				<div className="popup active">
					<div
						className="overlay"
						onClick={() => setIsOpenReviewPopup(false)}
					></div>
					<div className="content rounded-md">
						<AiOutlineClose
							className="absolute text-sm hover:cursor-pointer m-5"
							onClick={() => setIsOpenReviewPopup(false)}
						/>
						<DomesticHelperReview
							serviceName={chosenJobPost?.serviceId?.name}
							serviceAddress={chosenJobPost?.contactInfo?.address}
							domesticHelperId={chosenJobPost?.domesticHelperId}
							avatar={
								accounts?.find(
									(acc) =>
										String(acc._id) == String(chosenJobPost?.domesticHelperId)
								)?.avatar
							}
							jobPostId={chosenJobPost?._id}
							chosenfeedback={feedbacks.find(
								(feedback) =>
									String(feedback.jobPostId) === String(chosenJobPostId)
							)}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
