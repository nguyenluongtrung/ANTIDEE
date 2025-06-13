import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../components';
import {
	filterJobPostsByService,
	getAllJobPosts,
	getJobPost,
} from '../../features/jobPosts/jobPostsSlice';
import {
	formatDate,
	formatWorkingTime,
	getCurrentTimeString,
} from '../../utils/format';
import { JobPostDetail } from './JobPostDetail/JobPostDetail';
import './JobPostListPage.css';
import Select from 'react-select';
import { getAllServices } from '../../features/services/serviceSlice';
import { useLocation, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaHourglassEnd, FaHourglassStart } from 'react-icons/fa';
import { PiMoneyWavyLight } from "react-icons/pi";
import { LuClock } from 'react-icons/lu';

export const JobPostListPage = () => {
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const [isOpenJobPostDetail, setIsOpenJobPostDetail] = useState(false);
	const [isInMyLocation, setIsInMyLocation] = useState(false);
	const [serviceOptions, setServiceOptions] = useState([]);
	const [chosenServiceOptions, setChosenServiceOptions] = useState([]);
	const [jobPosts, setJobPosts] = useState([]);
	const [selectedJobPost, setSelectedJobPost] = useState();
	const { isLoading: serviceLoading } = useSelector((state) => state.services);

	const dispatch = useDispatch();
	const { isLoading: jobPostLoading } = useSelector((state) => state.jobPosts);

	async function initiateJobPosts() {
		let output = await dispatch(getAllJobPosts());
		setJobPosts(output.payload);
	}

	useEffect(() => {
		const isOpenJobPostDetail = location.state?.isOpenJobPostDetail;
		if (isOpenJobPostDetail) {
			setIsOpenJobPostDetail(true);
		}
		initiateJobPosts();
	}, []);

	useEffect(() => {
		initiateAllServices();
	}, []);

	const initiateAllServices = async () => {
		const output = await dispatch(getAllServices());
		const options = [];
		output.payload.forEach((service) => {
			options.push({ value: service._id, label: service.name });
		});
		setServiceOptions(options);
	};

	const handleChange = (selectedOption) => {
		setChosenServiceOptions(selectedOption);
	};

	const handleGetJobPostDetail = async (jobPostId) => {
		const result = await dispatch(getJobPost(jobPostId));
		if (result.type.includes('fulfilled')) {
			setSelectedJobPost(result.payload);
			setIsOpenJobPostDetail(true);
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

	const handleFilterJobPosts = async () => {
		let filterServiceIds = '';
		chosenServiceOptions.forEach((option) => {
			filterServiceIds = filterServiceIds + `${option.value},`;
		});
		const result = await dispatch(filterJobPostsByService({serviceIds: filterServiceIds.substring(0, filterServiceIds.length - 1), isInMyLocation}));

		if (result.type.includes('fulfilled')) {
			setJobPosts(result.payload);
		} else{
			setJobPosts([])
		}
		setChosenServiceOptions([])
	};

	if (jobPostLoading || serviceLoading) {
		return <Spinner />;
	}

	return (
		<div className="pt-20 mb-10">
			{isOpenJobPostDetail && (
				<JobPostDetail
					selectedJobPost={selectedJobPost}
					onClose={() => {
						setIsOpenJobPostDetail(false);
						setSearchParams({});
						initiateJobPosts();
					}}
				/>
			)}
			<div className="filter-jobs bg-light py-7 px-10 md:px-32 mb-8">
				<div className="mb-5">
					<Select
						isMulti
						options={serviceOptions}
						className="basic-multi-select"
						classNamePrefix="select"
						onChange={handleChange}
						placeholder={<div>Chọn dịch vụ bạn muốn tìm</div>}
					/>
				</div>
				<div className="flex mb-4 justify-between">
					<div className="flex mr-5">
						<input
							type="checkbox"
							className="w-3 mr-2"
							onClick={() => setIsInMyLocation(!isInMyLocation)}
						/>
						<p className="font-bold">Lọc công việc trong khu vực đã đăng ký</p>
					</div>
				</div>
				<div className="flex justify-center">
					<button
						className="bg-another_primary text-white py-1.5 text-center rounded-md block w-[100px] md:w-[200px] hover:bg-primary_dark"
						onClick={handleFilterJobPosts}
					>
						Tìm kiếm
					</button>
				</div>
			</div>
			<div className="grid lg:grid-cols-3 md:px-12 px-10 md:grid-cols-2 gap-8">
				{jobPosts
					?.filter(
						(jobPost) =>
							jobPost.domesticHelperId == null &&
							jobPost?.cancelDetails?.isCanceled === false
					)
					?.filter((jobPost) => {
						const startingDate = new Date(jobPost.workingTime.startingDate);
						startingDate.setMinutes(
							startingDate.getMinutes() - startingDate.getTimezoneOffset()
						);
						const startingHour = parseInt(
							jobPost.workingTime.startingHour.split(':')[0]
						);
						const startingMinute = parseInt(
							jobPost.workingTime.startingHour.split(':')[1]
						);

						const startingTime = `${startingHour
							.toString()
							.padStart(2, '0')}:${startingMinute.toString().padStart(2, '0')}`;

						if (startingDate.toISOString() > new Date().toISOString()) {
							return true;
						} else if (
							startingDate.toDateString() == new Date().toDateString() &&
							startingTime >= getCurrentTimeString()
						) {
							return true;
						} else {
							return false;
						}
					})
					?.map((post) => {
						return (
							<div
								className={`shadow-xl p-2 hover:shadow-2xl hover:cursor-pointer relative ${post?.isUrgent && 'bg-light_pink'
									}`}
							>
								<p className="text-black font-bold text-lg md:text-base text-center mb-3">
									{post?.serviceId?.name?.toUpperCase()}
								</p>
								{post?.isUrgent && (
									<div className="triangle-down absolute top-0 right-0"></div>
								)}
								<p className="flex items-center text-gray mb-2">
									Bắt đầu lúc:{' '}
									<span className="flex text-brown ml-2">
										{formatDate(post?.workingTime?.startingDate)}{' '} |
										<div className='font-bold ml-2 text-red'>
											{formatWorkingTime(post?.workingTime?.startingHour)}
										</div>
									</span>
								</p>
								<p className="flex items-center text-gray mb-2">
									Hết hạn lúc: {''}
									<span className="text-brown ml-2">
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
												<p className="flex items-center justify-center text-gray mb-2 text-center mt-3">
													Làm trong{' '}
													<LuClock className='ml-2' />
												</p>
												<p className="text-center text-primary font-bold mb-3">
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
												<p className="flex items-center justify-center text-gray mb-2 text-center mt-3">
													Số tiền{' '}
													<PiMoneyWavyLight className='ml-2' />
												</p>
												<p className="text-center text-green font-bold mb-3">
													{Intl.NumberFormat().format(post?.totalPrice)} VND
												</p>
											</div>
										</div>
									)}
								</div>
								<p className="text-gray mb-2 ">
									Tại:{' '}
									<span
										className={`text-black ${!JSON.parse(localStorage.getItem('account')) &&
											'blur-text'
											}`}
									>
										{post?.contactInfo?.address}
									</span>
								</p>
								<p className="text-gray mb-3">
									Ghi chú:{' '}
									<span className="text-black">
										{post?.note ? post?.note : 'Không có'}
									</span>
								</p>
								<button
									className="mt-5 px-2 flex justify-center text-white bg-green rounded-2xl text-xs lg:w-[80%] mx-auto py-2.5 text-center hover:bg-primary_dark hover:text-white"
									onClick={() => {
										setSearchParams({ id: post?._id });
										handleGetJobPostDetail(post?._id);
									}}
								>
									<p className="text-center">Xem chi tiết công việc</p>
								</button>
							</div>
						);
					})}
			</div>
		</div>
	);
};
