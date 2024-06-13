import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../components';
import { getAllJobPosts } from '../../features/jobPosts/jobPostsSlice';
import {
	formatDate,
	formatWorkingTime,
	getCurrentTimeString,
} from '../../utils/format';
import { JobPostDetail } from './JobPostDetail/JobPostDetail';
import {
	getAccountInformation,
	getAllAccounts,
} from '../../features/auth/authSlice';
import './JobPostListPage.css';
import Select from 'react-select';
import { getAllServices } from '../../features/services/serviceSlice';

export const JobPostListPage = () => {
	const [isOpenJobPostDetail, setIsOpenJobPostDetail] = useState(false);
	const [chosenJobPostId, setChosenJobPostId] = useState(null);
	const [isInMyLocation, setIsInMyLocation] = useState(false);
	const [account, setAccount] = useState();
	const [accounts, setAccounts] = useState();
	const [serviceOptions, setServiceOptions] = useState([]);
	const [chosenServiceOptions, setChosenServiceOptions] = useState([]);
	const [jobPosts, setJobPosts] = useState([]);
	const [allJobPosts, setAllJobPosts] = useState([]);
	const { isLoading: serviceLoading } = useSelector((state) => state.services);

	const dispatch = useDispatch();
	const { isLoading: jobPostLoading } = useSelector((state) => state.jobPosts);

	async function initiateAccountInformation() {
		let output = await dispatch(getAccountInformation());

		setAccount(output.payload);
	}

	async function initiateAllAccounts() {
		let output = await dispatch(getAllAccounts());

		setAccounts(output.payload);
	}

	async function initiateJobPosts() {
		let output = await dispatch(getAllJobPosts());

		setJobPosts(output.payload);
		setAllJobPosts(output.payload);
	}

	useEffect(() => {
		initiateAccountInformation();
	}, []);

	useEffect(() => {
		initiateAllAccounts();
	}, []);

	useEffect(() => {
		initiateJobPosts();
	}, []);

	useEffect(() => {
		initiateAllServices();
	}, []);

	useEffect(() => {
		if (chosenServiceOptions.length > 0) {
			setJobPosts(
				allJobPosts.filter(
					(jobPost) =>
						chosenServiceOptions.findIndex(
							(service) =>
								String(service.value) === String(jobPost.serviceId._id)
						) !== -1
				)
			);
		} else if (chosenServiceOptions.length == 0) {
			setJobPosts(allJobPosts);
		}
	}, [chosenServiceOptions]);

	const initiateAllServices = async () => {
		const output = await dispatch(getAllServices());
		const options = [];
		output.payload.forEach((service) => {
			options.push({ value: service._id, label: service.name });
		});
		setServiceOptions(options);
	};

	const handleGetAllJobPosts = async () => {
		let output = await dispatch(getAllJobPosts());
		let newJobPosts = output.payload?.filter(
			(jobPost) => jobPost.domesticHelperId == null
		);

		setJobPosts(newJobPosts);
		setIsInMyLocation(false);
	};

	const handleChange = (selectedOption) => {
		setChosenServiceOptions(selectedOption);
	};

	if (jobPostLoading || serviceLoading) {
		return <Spinner />;
	}

	return (
		<div className="px-16 pt-20">
			{isOpenJobPostDetail && (
				<JobPostDetail
					chosenJobPostId={chosenJobPostId}
					handleGetAllJobPosts={handleGetAllJobPosts}
					setIsOpenJobPostDetail={setIsOpenJobPostDetail}
				/>
			)}
			<div className="filter-jobs bg-light py-7 px-32 mb-8">
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
			</div>
			<div className="grid grid-cols-3 gap-28">
				{jobPosts
					?.filter((jobPost) => {
						if (isInMyLocation) {
							const addressDetails = jobPost?.contactInfo?.address.split(',');
							const jobCity = addressDetails[addressDetails.length - 1].trim();
							const myCity = account?.address
								.split(',')
								[account?.address.split(',').length - 1].trim();
							return jobCity.toUpperCase().includes(myCity.toUpperCase());
						} else {
							return jobPost;
						}
					})
					?.filter((jobPost) => jobPost.domesticHelperId == null)
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
						if (startingDate.toDateString() > new Date().toDateString()) {
							return true;
						} else if (
							startingDate.toDateString() == new Date().toDateString() &&
							startingTime >= getCurrentTimeString()
						) {
							return true;
						} else return false;
					})
					?.filter((jobPost) => {
						const createdDate = new Date(jobPost.createdAt);
						const currentDate = new Date();

						const thirtyMinutesInMs = 30 * 60 * 1000;
						const createdDatePlus30Minutes = new Date(
							createdDate.getTime() + thirtyMinutesInMs
						);
						if (
							jobPost.isChosenYourFav == true &&
							currentDate <= createdDatePlus30Minutes
						) {
							if (
								accounts
									.find((acc) => String(acc._id) === String(jobPost.customerId))
									.favoriteList.find(
										(fav) =>
											String(fav.domesticHelperId) === String(account._id)
									)
							) {
								return true;
							}
						} else {
							return true;
						}
					})
					?.map((post) => {
						return (
							<div
								className={`shadow-xl p-7 hover:shadow-2xl hover:cursor-pointer relative ${
									post?.isUrgent && 'bg-light_pink'
								}`}
								style={{ height: '350px' }}
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
								<div className="flex flex-col items-center absolute bottom-5 left-12 w-72">
									<button
										className="mt-5 text-white bg-brown rounded-2xl text-xs py-2.5 text-center hover:bg-light_yellow hover:text-brown"
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
