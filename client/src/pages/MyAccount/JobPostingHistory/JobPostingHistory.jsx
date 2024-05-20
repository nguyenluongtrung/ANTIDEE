import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../components';
import { getAllJobPosts } from '../../../features/jobPosts/jobPostsSlice';
import { getAccountInformation } from '../../../features/auth/authSlice';
import { formatDate, formatTime, formatWorkingTime } from '../../../utils/format';
import { HistoryJobPostDetail } from './HistoryJobPostDetail/HistoryJobPostDetail';

export const JobPostingHistory = () => {
	const [myAccountId, setMyAccountId] = useState();
	const [myJobHistory, setMyJobHistory] = useState([]);
    const [chosenJobPostId, setChosenJobPostId] = useState();
	const [isOpenJobPostDetail, setIsOpenJobPostDetail] = useState(false);
	const dispatch = useDispatch();
	const { isLoading: accountLoading } = useSelector((state) => state.auth);
	const { isLoading: jobPostLoading } = useSelector((state) => state.jobPosts);

	async function initiateAccountInformation() {
		let output = await dispatch(getAccountInformation());

		setMyAccountId(output.payload._id);
	}

	async function getInitialHistoryJobList() {
		let output = await dispatch(getAllJobPosts());
        setMyJobHistory(output.payload);
	}

	useEffect(() => {
		initiateAccountInformation();
	}, []);

	useEffect(() => {
		getInitialHistoryJobList();
	}, [myAccountId]);

	if (jobPostLoading || accountLoading) {
		return <Spinner />;
	}

	return (
		<div>
			<div className="px-16">
				{isOpenJobPostDetail && (
					<HistoryJobPostDetail
						chosenJobPostId={chosenJobPostId}
						setIsOpenJobPostDetail={setIsOpenJobPostDetail}
					/>
				)}
				<div className="filter-jobs bg-light mb-8" style={{padding: '30px 300px'}}>
					<div className="flex mb-4 justify-between">
						<div className="flex mr-5">
							<input type="radio" className="w-3 mr-2" />
							<p className="font-bold">Chưa có người làm</p>
						</div>
                        <div className="flex mr-5">
							<input type="radio" className="w-3 mr-2" />
							<p className="font-bold">Đã có người làm</p>
						</div>
						<div className="flex mr-5">
							<input type="radio" className="w-3 mr-2" />
							<p className="font-bold">Đã hoàn thành</p>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-28">
					{myJobHistory?.filter((job) => String(job.customerId) === myAccountId)?.map((post) => {
						return (
							<div className="shadow-xl p-7 hover:shadow-2xl hover:cursor-pointer">
								<p className="text-brown font-bold mb-3">
									{post?.serviceId?.name?.toUpperCase()}
								</p>
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
										{formatDate(post?.createdAt)}{' '}{formatTime(Date.parse(post?.createdAt))}
									</span>
								</p>
								<div className="border-2 border-gray grid grid-cols-2 my-3">
									<div className="border-r-2 border-gray">
										<p className="text-gray mb-2 text-center mt-3">
											Làm trong:{' '}
										</p>
										<p className="text-center text-brown font-bold mb-3">
											{
												post?.workload?.find(
													(option) => String(option?.optionName) === 'Thời gian'
												)?.optionValue
											}{' '}
											giờ
										</p>
									</div>
									<div>
										<p className="text-gray mb-2 text-center mt-3">Số tiền: </p>
										<p className="text-center text-brown font-bold mb-3">
											{post?.totalPrice} VND
										</p>
									</div>
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
			</div>
		</div>
	);
};
