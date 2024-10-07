import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import { AiOutlineClose } from 'react-icons/ai';
import { formatDate, formatWorkingTime, getCurrentTimeString } from '../../../../utils/format';
import { JobPostCancel } from '../JobPostCancel/JobPostCancel';
import { updateJobPost } from '../../../../features/jobPosts/jobPostsSlice';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import toast from 'react-hot-toast';

export const MyJobDetail = ({
	chosenJobPostId,
	setIsOpenJobPostDetail,
	myAccountId,
	getAllJobList,
}) => {
	const [isOpenCancelForm, setIsOpenCancelForm] = useState(false);
	const [isCompletedForm, setIsCompletedForm] = useState(false);
	const { jobPosts, isLoading: jobPostLoading } = useSelector(
		(state) => state.jobPosts
	);
	const { isLoading: accountLoading } = useSelector((state) => state.auth);
	const [chosenJobPost, setChosenJobPost] = useState(
		jobPosts?.find((jobPost) => String(jobPost._id) === String(chosenJobPostId))
	);

	const dispatch = useDispatch();

	const checkIsCompleted = () => {
		const startingDate = new Date(chosenJobPost.workingTime.startingDate);
		startingDate.setMinutes(
			startingDate.getMinutes() - startingDate.getTimezoneOffset()
		);
		const startingHour = parseInt(
			chosenJobPost.workingTime.startingHour.split(':')[0]
		);
		const startingMinute = parseInt(
			chosenJobPost.workingTime.startingHour.split(':')[1]
		);

		const startingTime = `${startingHour
			.toString()
			.padStart(2, '0')}:${startingMinute.toString().padStart(2, '0')}`;

		return (
			startingDate.toDateString() < new Date().toDateString() ||
			(startingDate.toDateString() == new Date().toDateString() &&
				startingTime <= getCurrentTimeString())
		);
	};

	const handleCompleteJobPost = async (e) => {
		e.preventDefault();
		const jobPostData = {...chosenJobPost, hasCompleted: {...chosenJobPost.hasCompleted, domesticHelperConfirm: true}}
		const result = await dispatch(updateJobPost({jobPostData, id: chosenJobPostId}));

		if (result.type.endsWith('fulfilled')) {
			toast.success('Xác nhận hoàn thành công việc thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		setIsOpenJobPostDetail(false);
		getAllJobList();
	}

	if (jobPostLoading || accountLoading) {
		return <Spinner />;
	}
	return (
		<div className="popup active">
			<div className="overlay"></div>

			{isOpenCancelForm ? (
				<div className="popup active">
					<div
						className="overlay"
						onClick={() => setIsOpenCancelForm(false)}
					></div>
					<div className="content rounded-md">
						<AiOutlineClose
							className="absolute text-sm hover:cursor-pointer m-5"
							getAllJobList={getAllJobList}
							onClick={() => {
								getAllJobList();
								setIsOpenCancelForm(false);
							}}
						/>
						<JobPostCancel
							jobPostId={chosenJobPostId}
							setIsOpenCancelForm={setIsOpenCancelForm}
							myAccountId={myAccountId}
							getAllJobList={getAllJobList}
							setIsOpenJobPostDetail={setIsOpenJobPostDetail}
						/>
					</div>
				</div>
			) : (
				<form className="content rounded-md p-5" style={{ width: '35vw' }}>
					<AiOutlineClose
						className="absolute text-sm hover:cursor-pointer"
						onClick={() => {
							setIsOpenJobPostDetail(false);
							getAllJobList();
						}}
					/>
					<p className="grid text-green font-bold text-xl justify-center mb-3">
						XEM CHI TIẾT CÔNG VIỆC ĐÃ NHẬN
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
													(option) => String(option?.optionName) === 'Thời gian'
												)?.optionValue
											}{' '}
											giờ
										</p>
									</div>
									<div>
										<p className="text-gray mb-2 text-center mt-3">Số tiền: </p>
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
						<p className="text-gray mb-2">
							Thông tin liên lạc:
							<p className="text-black ml-10">
								+ Tên khách hàng: {chosenJobPost?.contactInfo?.fullName}
							</p>
							<p className="text-black ml-10">
								+ Email: {chosenJobPost?.contactInfo?.email}
							</p>
							<p className="text-black ml-10">
								+ Số điện thoại: {chosenJobPost?.contactInfo?.phoneNumber}
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
										setIsOpenCancelForm(true);
									}}
								>
									<p className="text-center">Hủy việc</p>
								</button>
							)}
						</div>
					</div>
				</form>
			)}
		</div>
	);
};
