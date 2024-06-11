import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../components';
import { getAllJobPosts } from '../../../features/jobPosts/jobPostsSlice';
import { getAccountInformation } from '../../../features/auth/authSlice';
import {
	formatDate,
	formatTime,
	formatWorkingTime,
} from '../../../utils/format';
import { MyJobDetail } from './MyJobDetail/MyJobDetail';

export const MyJobs = () => {
	const [myAccountId, setMyAccountId] = useState();
	const [chosenJobPostId, setChosenJobPostId] = useState();
	const [isOpenJobPostDetail, setIsOpenJobPostDetail] = useState(false);
	const [filterOption, setFilterOption] = useState('readyToWork');
	const [myJobs, setMyJobs] = useState([]);
	const dispatch = useDispatch();
	const { isLoading: accountLoading } = useSelector((state) => state.auth);
	const { isLoading: jobPostLoading } = useSelector((state) => state.jobPosts);

	async function initiateAccountInformation() {
		let output = await dispatch(getAccountInformation());

		setMyAccountId(output.payload._id);
	}

	async function getInitialMyJobList(filterOption) {
		let output = await dispatch(getAllJobPosts());
		let newJobHistory;
		if (filterOption == 'readyToWork') {
			newJobHistory = output.payload.filter(
				(job) =>
					job.domesticHelperId == String(myAccountId) &&
					job?.hasCompleted?.customerConfirm == false &&
					job?.hasCompleted?.domesticHelperConfirm == false
			);
		} else if (filterOption == 'completed') {
			newJobHistory = output.payload.filter(
				(job) =>
					String(job.domesticHelperId) == String(myAccountId) &&
					job?.hasCompleted?.customerConfirm == true &&
					job?.hasCompleted?.domesticHelperConfirm == true
			);
		} else {
			newJobHistory = output.payload;
		}
		setMyJobs(newJobHistory);
	}

	useEffect(() => {
		initiateAccountInformation();
	}, []);

	useEffect(() => {
		getInitialMyJobList(filterOption);
	}, [filterOption, myAccountId]);

	if (jobPostLoading || accountLoading) {
		return <Spinner />;
	}

	return (
		<div>
			<div className="px-16">
				{isOpenJobPostDetail && (
					<MyJobDetail
						chosenJobPostId={chosenJobPostId}
						setIsOpenJobPostDetail={setIsOpenJobPostDetail}
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
								onChange={() => setFilterOption('readyToWork')}
							/>
							<p className="font-bold">Chuẩn bị làm</p>
						</div>
						<div className="flex mr-5">
							<input
								type="radio"
								className="w-3 mr-2"
								name="filterOption"
								checked={filterOption === 'completed'}
								onChange={() => setFilterOption('completed')}
							/>
							<p className="font-bold">Đã hoàn thành</p>
						</div>
					</div>
				</div>
				{myJobs.length == 0 ? (
					<div className="mx-auto">
						<img
							src="public/image/sad-icon.png"
							className="block m-auto w-52"
						/>
						<p className="text-gray text-center">
							Rất tiếc, bạn hiện tại chưa có công việc nào
						</p>
					</div>
				) : (
					<div className="grid grid-cols-3 gap-28">
						{myJobs
							?.filter((job) => String(job.domesticHelperId) === myAccountId)
							?.map((post) => {
								return (
									<div
										className={`shadow-xl p-7 hover:shadow-2xl hover:cursor-pointer relative ${
											post?.isUrgent && 'bg-light_pink'
										}`}
									>
										<p className="text-brown font-bold mb-3">
											{post?.serviceId?.name?.toUpperCase()}
										</p>
										{post?.repeatitiveDetails?.isRepeatitive && (
											<button className="bg-yellow text-white py-1.5 px-1 absolute w-20 top-0 right-0 text-xs">
												Lặp lại
											</button>
										)}
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
										<div className="border-2 border-gray  my-3">
											{post?.workload?.find(
												(option) => String(option?.optionName) === 'Thời gian'
											)?.optionValue == undefined ? (
												<div>
													<p className="text-gray mb-2 text-center mt-3">
														Số tiền:{' '}
													</p>
													<p className="text-center text-brown font-bold mb-3">
														{post?.totalPrice} VND
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
															{post?.totalPrice} VND
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
													setIsOpenJobPostDetail(true);
													setChosenJobPostId(post?._id);
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
			</div>
		</div>
	);
};
