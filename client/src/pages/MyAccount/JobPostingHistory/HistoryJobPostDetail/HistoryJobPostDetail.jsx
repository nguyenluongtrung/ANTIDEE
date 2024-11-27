import { useState } from 'react';
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
import { selectATasker } from '../../../../features/jobPosts/jobPostsSlice';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';

export const HistoryJobPostDetail = ({
	onClose,
	selectedJobPost,
	selectedFeedback,
	onCancelJob,
	onDomesticHelperFeedback,
	onFeedbackReview,
	onCompleteJob,
}) => {
	const [isOpenApplicantsDetails, setIsOpenApplicantsDetails] = useState(false);

	const { isLoading } = useSelector((state) => state.jobPosts);
	const dispatch = useDispatch();

	const handleSelectTasker = async (id) => {
		const result = await dispatch(
			selectATasker({ jobPostId: selectedJobPost._id, taskerId: id })
		);

		if (result.type.endsWith('fulfilled')) {
			toast.success('Chọn người giúp việc thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		onClose();
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form className="content rounded-md p-5" style={{ width: '35vw' }}>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={onClose}
				/>

				{!isOpenApplicantsDetails ? (
					<>
						<p className="grid text-green font-bold text-xl justify-center mb-3">
							XEM CHI TIẾT CÔNG VIỆC
						</p>
						<div className="">
							<p className="text-brown font-bold mb-3">
								{selectedJobPost?.serviceId?.name?.toUpperCase()}
							</p>
							<p className="text-gray mb-2">
								Bắt đầu lúc:{' '}
								<span className="text-brown">
									{formatDate(selectedJobPost?.workingTime?.startingDate)}{' '}
									{formatWorkingTime(
										selectedJobPost?.workingTime?.startingHour
									)}
								</span>
							</p>
							<p className="text-gray mb-2">
								Hết hạn lúc: {''}
								<span className="text-brown">
									{formatDate(selectedJobPost?.dueDate)}{' '}
								</span>
							</p>
							<p className="text-gray mb-2">
								Đã đăng lúc: {''}
								<span className="text-brown">
									{formatDate(selectedJobPost?.createdAt)}{' '}
									{formatTime(Date.parse(selectedJobPost?.createdAt))}
								</span>
							</p>
							<div className="border-2 border-gray  my-3">
								{selectedJobPost?.workload?.find(
									(option) => String(option?.optionName) === 'Thời gian'
								)?.optionValue == undefined ? (
									<div>
										<p className="text-gray mb-2 text-center mt-3">Số tiền: </p>
										<p className="text-center text-brown font-bold mb-3">
											{Intl.NumberFormat().format(selectedJobPost?.totalPrice)}{' '}
											VND
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
													selectedJobPost?.workload?.find(
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
												{Intl.NumberFormat().format(
													selectedJobPost?.totalPrice
												)}{' '}
												VND
											</p>
										</div>
									</div>
								)}
							</div>
							<p className="text-gray mb-2 ">
								Tại:{' '}
								<span className="text-black">
									{selectedJobPost?.contactInfo?.address}
								</span>
							</p>
							<p className="text-gray mb-2">
								Khối lượng công việc:
								{selectedJobPost?.workload?.map((option) => {
									return (
										<p className="text-black ml-10">
											+ {option?.optionName}: {option?.optionValue}
										</p>
									);
								})}
							</p>
							{selectedJobPost?.isChosenYourself &&
								selectedJobPost?.domesticHelperId &&
								!selectedJobPost?.hasCompleted?.customerConfirm &&
								!selectedJobPost?.hasCompleted?.domesticHelperConfirm && (
									<p className="text-gray mb-3">
										Người giúp việc:{' '}
										<span className="text-black">
											{selectedJobPost.domesticHelperId.name}
										</span>
									</p>
								)}
							{selectedJobPost?.hasCompleted?.customerConfirm &&
								selectedJobPost?.hasCompleted?.domesticHelperConfirm &&
								selectedJobPost?.domesticHelperId && (
									<p className="text-gray mb-3">
										Người giúp việc:{' '}
										<span className="text-black">
											{selectedJobPost.domesticHelperId.name}
										</span>{' '}
										&nbsp;
										{selectedFeedback ? (
											<span
												className="text-black italic hover:underline hover:text-brown hover:cursor-pointer"
												onClick={(e) => {
													e.preventDefault();
													onFeedbackReview();
												}}
											>
												(Review)
											</span>
										) : (
											<span
												className="text-black italic hover:underline hover:text-brown hover:cursor-pointer"
												onClick={(e) => {
													e.preventDefault();
													onDomesticHelperFeedback();
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
									{selectedJobPost?.note ? selectedJobPost?.note : 'Không có'}
								</span>
							</p>
							{selectedJobPost?.cancelDetails?.isCanceled && (
								<p className="text-gray mb-3">
									Lí do hủy việc:{' '}
									<span className="text-black">
										{selectedJobPost?.cancelDetails?.reason}
									</span>
								</p>
							)}
							{selectedJobPost?.isChosenYourself &&
								!selectedJobPost?.domesticHelperId && (
									<p
										className="text-gray mb-3 hover:text-brown hover:cursor-pointer"
										onClick={() => setIsOpenApplicantsDetails(true)}
									>
										Xem danh sách người ứng tuyển{' '}
									</p>
								)}
							{!selectedJobPost?.hasCompleted?.customerConfirm &&
								!selectedJobPost?.hasCompleted?.domesticHelperConfirm &&
								!selectedJobPost?.cancelDetails?.isCanceled && (
									<div className="flex justify-center">
										<button
											className={
												'text-white rounded-2xl text-xs py-2.5 text-center bg-brown hover:bg-light_yellow hover:text-brown'
											}
											style={{ width: '70%' }}
											onClick={(e) => {
												e.preventDefault();
												onCancelJob();
											}}
										>
											<p className="text-center">Hủy việc</p>
										</button>
									</div>
								)}
							{!selectedJobPost?.hasCompleted?.customerConfirm &&
								selectedJobPost?.hasCompleted?.domesticHelperConfirm &&
								!selectedJobPost?.cancelDetails?.isCanceled && (
									<div className="flex justify-center">
										<button
											className={
												'text-white rounded-2xl text-xs py-2.5 text-center bg-brown hover:bg-light_yellow hover:text-brown'
											}
											style={{ width: '70%' }}
											onClick={onCompleteJob}
										>
											<p className="text-center">
												Xác nhận hoàn thành công việc
											</p>
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
							{selectedJobPost?.applicants?.map((applicant, index) => (
								<div
									className="flex rounded-2xl p-5 mb-5"
									style={{ backgroundColor: 'rgba(100,100,100,0.1)' }}
								>
									<div className="mr-10 flex flex-col justify-center">
										<img
											src={applicant?.avatar}
											className="w-16 rounded-full"
										/>
									</div>
									<div className="w-80">
										<p className="font-bold">{applicant?.name}</p>
										<p className="">Điểm uy tín: 4.5 / 5.0</p>
										<p className="italic mt-1 text-white bg-primary rounded-2xl p-1 w-20 text-center">
											{applicant?.accountLevel?.domesticHelperLevel?.name}
										</p>
									</div>
									<div className="flex flex-col justify-center">
										<IoMdCheckboxOutline
											size={25}
											className="text-brown hover:cursor-pointer hover:text-green"
											onClick={() => handleSelectTasker(applicant._id)}
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
		</div>
	);
};
