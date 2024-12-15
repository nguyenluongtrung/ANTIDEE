import { AiOutlineClose } from 'react-icons/ai';
import {
	formatDate,
	formatWorkingTime,
	getCurrentTimeString,
} from '../../../../utils/format';
import { LuClock } from 'react-icons/lu';
import { PiMoneyWavyLight } from 'react-icons/pi';

export const MyJobDetail = ({
	onClose,
	selectedJobPost,
	selectedFeedback,
	onCancelJob,
	onDomesticHelperFeedback,
	onFeedbackReview,
	onCompleteJob,
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

	return (
		<div className="popup active">
			<div className="overlay"></div>

			<form className="content rounded-md p-5 lg:w-[470px] sm:w-[50%] md:w-[25%] min-w-[370px]">
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={onClose}
				/>
				<p className="grid text-green font-bold text-xl justify-center mb-3">
					XEM CHI TIẾT CÔNG VIỆC ĐÃ NHẬN
				</p>
				<div className="">
					<p className="text-primary font-bold text-base md:text-base text-center mb-3">
						{selectedJobPost?.serviceId?.name?.toUpperCase()}
					</p>
					<p className="text-gray mb-2">
						Bắt đầu lúc:{' '}
						{selectedJobPost?.workingTime ? (
							<span className="text-brown">
								{formatDate(selectedJobPost?.workingTime?.startingDate)}{' '}
								{formatWorkingTime(selectedJobPost?.workingTime?.startingHour)}
							</span>
						) : (
							<></>
						)}
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
									<p className="flex items-center justify-center text-gray mb-2 text-center mt-3">
										Làm trong <LuClock className="ml-2" />
									</p>
									<p className="text-center text-primary font-bold mb-3">
										{
											selectedJobPost?.workload?.find(
												(option) => String(option?.optionName) === 'Thời gian'
											)?.optionValue
										}{' '}
										giờ
									</p>
								</div>
								<div>
									<p className="flex items-center justify-center text-gray mb-2 text-center mt-3">
										Số tiền <PiMoneyWavyLight className="ml-2" />
									</p>
									<p className="text-center text-green font-bold mb-3">
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
						{selectedJobPost.serviceId.priceOptions.find(
							(option) => option.optionName == 'Thời gian'
						) == true ? (
							<>
								{checkIsCompleted() ? (
									<button
										className={
											'text-white rounded-2xl text-xs py-2.5 text-center bg-brown hover:bg-light_yellow hover:text-brown'
										}
										style={{ width: '70%' }}
										onClick={onCompleteJob}
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
							</>
						) : (
							<div className='flex flex-col gap-2'>
								<button
									className={
										'text-white rounded-2xl text-xs py-2.5 text-center bg-brown hover:bg-light_yellow hover:text-brown w-[200px]'
									}
									onClick={(e) => {
										e.preventDefault();
										onCancelJob();
									}}
								>
									<p className="text-center">Hủy việc</p>
								</button>
								<button
									className={
										'text-white rounded-2xl text-xs py-2.5 text-center bg-green hover:bg-yellow hover:text-white w-[200px]'
									}
									onClick={onCompleteJob}
								>
									<p className="text-center">Hoàn thành công việc</p>
								</button>
							</div>
						)}
					</div>
				</div>
			</form>
		</div>
	);
};
