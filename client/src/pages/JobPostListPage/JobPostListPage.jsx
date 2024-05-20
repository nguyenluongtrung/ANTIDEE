import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../components';
import { getAllJobPosts } from '../../features/jobPosts/jobPostsSlice';
import { formatDate, formatTime, formatWorkingTime } from '../../utils/format';
import { JobPostDetail } from './JobPostDetail/JobPostDetail';

export const JobPostListPage = () => {
	const [isOpenJobPostDetail, setIsOpenJobPostDetail] = useState(false);
	const [chosenJobPostId, setChosenJobPostId] = useState(null);

	const dispatch = useDispatch();
	const { jobPosts, isLoading } = useSelector((state) => state.jobPosts);

	useEffect(() => {
		dispatch(getAllJobPosts());
	}, []);

	const handleGetAllJobPosts = () => {
		Promise.all([dispatch(getAllJobPosts())]).catch((error) => {
			console.error('Error during dispatch:', error);
		});
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<div className="px-16">
			{isOpenJobPostDetail && (
				<JobPostDetail
					chosenJobPostId={chosenJobPostId}
					handleGetAllJobPosts={handleGetAllJobPosts}
					setIsOpenJobPostDetail={setIsOpenJobPostDetail}
				/>
			)}
			<div className="filter-jobs bg-light py-7 px-32 mb-8">
				<div className="flex mb-4 justify-between">
					<div className="flex mr-5">
						<input type="radio" className="w-3 mr-2" />
						<p className="font-bold">Việc mới</p>
					</div>
					<div className="flex mr-5">
						<input type="radio" className="w-3 mr-2" />
						<p className="font-bold">Chờ xác nhận</p>
					</div>
					<div className="flex mr-5">
						<input type="radio" className="w-3 mr-2" />
						<p className="font-bold">Xác nhận</p>
					</div>
				</div>
				<div className="flex">
					<input type="checkbox" className="w-3 mr-2" />
					<p className="font-bold">Lọc công việc trong khu vực đã đăng ký</p>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-28">
				{jobPosts?.map((post) => {
					return (
						<div className="shadow-xl p-7 hover:shadow-2xl hover:cursor-pointer">
							<p className="text-brown font-bold mb-3">
								{post?.serviceId?.name.toUpperCase()}
							</p>
							<p className="text-gray mb-2">
								Bắt đầu lúc:{' '}
								<span className="text-brown">
									{formatDate(post?.workingTime?.startingDate)}{' '}
									{formatWorkingTime(post?.workingTime?.startingHour)}
								</span>
							</p>
							<div className="border-2 border-gray grid grid-cols-2 my-3">
								<div className="border-r-2 border-gray">
									<p className="text-gray mb-2 text-center mt-3">Làm trong: </p>
									<p className="text-center text-brown font-bold mb-3">
										{
											post?.workload?.find(
												(option) => String(option.optionName) === 'Thời gian'
											).optionValue
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
								<span className="text-black">{post?.contactInfo?.address}</span>
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
	);
};
