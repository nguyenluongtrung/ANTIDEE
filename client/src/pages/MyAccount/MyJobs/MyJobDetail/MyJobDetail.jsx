import { AiOutlineClose } from 'react-icons/ai';
import {
	formatDate,
	formatWorkingTime,
	getCurrentTimeString,
} from '../../../../utils/format';
import { updateJobPost } from '../../../../features/jobPosts/jobPostsSlice';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import toast from 'react-hot-toast';

export const MyJobDetail = ({
	onClose,
	selectedJobPost,
	selectedFeedback,
	onCancelJob,
	onDomesticHelperFeedback,
	onFeedbackReview,
}) => {
	const checkIsCompleted = () => {
		const startingDate = new Date(selectedJobPost.workingTime.startingDate);
		startingDate.setMinutes(
			startingDate.getMinutes() - startingDate.getTimezoneOffset()
		);
		const startingHour = parseInt(
			selectedJobPost.workingTime.startingHour.split(':')[0]
		);
		const startingMinute = parseInt(
			selectedJobPost.workingTime.startingHour.split(':')[1]
		);

		const startingTime = `${startingHour
			.toString()
			.padStart(2, '0')}:${startingMinute.toString().padStart(2, '0')}`;

		return (
			new Date(startingDate).getTime() < new Date().getTime() ||
			(startingDate.toDateString() == new Date().toDateString() &&
				startingTime <= getCurrentTimeString())
		);
	};

	const handleCompleteJobPost = async (e) => {
		e.preventDefault();
		const jobPostData = {
			...selectedJobPost,
			hasCompleted: {
				...selectedJobPost.hasCompleted,
				domesticHelperConfirm: true,
			},
		};
		const result = await dispatch(
			updateJobPost({ jobPostData, id: selectedJobPostId })
		);

		if (result.type.endsWith('fulfilled')) {
			toast.success('Xác nhận hoàn thành công việc thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		onClose()
	};
	return (
		<div className="popup active">
			<div className="overlay"></div>

			<form className="content rounded-md p-5" style={{ width: '35vw' }}>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={onClose}
				/>
				<p className="grid text-green font-bold text-xl justify-center mb-3">
					XEM CHI TIẾT CÔNG VIỆC ĐÃ NHẬN
				</p>
				<div className="">
					<p className="text-brown font-bold mb-3">
						{selectedJobPost?.serviceId?.name?.toUpperCase()}
					</p>
					<p className="text-gray mb-2">
						Bắt đầu lúc:{' '}
						<span className="text-brown">
							{formatDate(selectedJobPost?.workingTime?.startingDate)}{' '}
							{formatWorkingTime(selectedJobPost?.workingTime?.startingHour)}
						</span>
					</p>
					<div className="border-2 border-gray  my-3">
						{selectedJobPost?.workload?.find(
							(option) => String(option?.optionName) === 'Thời gian'
						)?.optionValue == undefined ? (
							<div>
								<p className="text-gray mb-2 text-center mt-3">Số tiền: </p>
								<p className="text-center text-brown font-bold mb-3">
									{Intl.NumberFormat().format(selectedJobPost?.totalPrice)} VND
								</p>
							</div>
						) : (
							<div className="grid grid-cols-2">
								<div className="border-r-2 border-gray">
									<p className="text-gray mb-2 text-center mt-3">Làm trong: </p>
									<p className="text-center text-brown font-bold mb-3">
										{
											selectedJobPost?.workload?.find(
												(option) => String(option?.optionName) === 'Thời gian'
											)?.optionValue
										}{' '}
										giờ
									</p>
								</div>
								<div>
									<p className="text-gray mb-2 text-center mt-3">Số tiền: </p>
									<p className="text-center text-brown font-bold mb-3">
										{Intl.NumberFormat().format(selectedJobPost?.totalPrice)}{' '}
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
					<p className="text-gray mb-2">
						Thông tin liên lạc:
						<div className="flex gap-2">
							<p className="text-black ml-10">
								+ Tên khách hàng: {selectedJobPost?.contactInfo?.fullName}
							</p>
							{selectedJobPost?.hasCompleted?.customerConfirm &&
								selectedJobPost?.hasCompleted?.domesticHelperConfirm &&
								selectedJobPost?.domesticHelperId && (
									<div>
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
									</div>
								)}
						</div>
						<p className="text-black ml-10">
							+ Email: {selectedJobPost?.contactInfo?.email}
						</p>
						<p className="text-black ml-10">
							+ Số điện thoại: {selectedJobPost?.contactInfo?.phoneNumber}
						</p>
					</p>
					<div className="flex justify-center">
						{checkIsCompleted() ? (
							<button
								className={
									'text-white rounded-2xl text-xs py-2.5 text-center bg-brown hover:bg-light_yellow hover:text-brown'
								}
								style={{ width: '70%' }}
								onClick={handleCompleteJobPost}
							>
								<p className="text-center">Hoàn thành công việc</p>
							</button>
						) : (
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
						)}
					</div>
				</div>
			</form>
		</div>
	);
};
