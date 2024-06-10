import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../components';
import { useEffect, useState } from 'react';
import {
	formatDate,
	formatDateInput,
	formatWorkingTime,
} from '../../../utils/format';
import { getAccountInformation } from '../../../features/auth/authSlice';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { applyAJob, getAJob } from '../../../features/jobPosts/jobPostsSlice';

export const JobPostDetail = ({
	chosenJobPostId,
	handleGetAllJobPosts,
	setIsOpenJobPostDetail,
}) => {
	const { jobPosts, isLoading } = useSelector((state) => state.jobPosts);
	const [isChecked, setIsChecked] = useState(false);
	const [chosenJobPost, setChosenJobPost] = useState(
		jobPosts?.find((jobPost) => String(jobPost._id) === String(chosenJobPostId))
	);
	const [account, setAccount] = useState();

	const dispatch = useDispatch();

	const handleGetAJob = async (e) => {
		e.preventDefault();
		if (account?.address == null) {
			toast.error(
				'Bạn cần bổ sung địa chỉ để đủ điều kiện nhận việc',
				errorStyle
			);
			setIsOpenJobPostDetail(false);
			handleGetAllJobPosts();
			return;
		}
		const addressDetails = chosenJobPost?.contactInfo?.address.split(',');
		const jobCity = addressDetails[addressDetails.length - 1].trim();
		const myCity = account?.address
			.split(',')
			[account?.address.split(',').length - 1].trim();
		if (!jobCity.toUpperCase().includes(myCity.toUpperCase())) {
			toast.error(
				'Địa chỉ làm việc của bạn không phù hợp cho công việc này',
				errorStyle
			);
			setIsOpenJobPostDetail(false);
			handleGetAllJobPosts();
			return;
		}
		const requiredQualification =
			chosenJobPost?.serviceId?.requiredQualification;
		const myQualifications = account?.resume[0]?.qualifications;
		if (!myQualifications?.includes(requiredQualification)) {
			toast.error(
				'Bạn không có chứng chỉ phù hợp cho công việc này',
				errorStyle
			);
			setIsOpenJobPostDetail(false);
			handleGetAllJobPosts();
			return;
		}
		let result;
		if (chosenJobPost?.isChosenYourself) {
			result = await dispatch(
				applyAJob({
					jobPostId: chosenJobPostId,
					accountId: account._id,
				})
			);
		} else {
			result = await dispatch(
				getAJob({
					jobPostId: chosenJobPostId,
					accountId: account._id,
					receivedAt: new Date(),
				})
			);
		}
		if (result.type.endsWith('fulfilled')) {
			toast.success(
				chosenJobPost?.isChosenYourself
					? 'Ứng tuyển công việc thành công'
					: 'Nhận công việc thành công',
				successStyle
			);
			setIsOpenJobPostDetail(false);
			handleGetAllJobPosts();
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
	};

	async function initiateAccountInformation() {
		let output = await dispatch(getAccountInformation());

		setAccount(output.payload);
	}

	useEffect(() => {
		initiateAccountInformation();
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
						handleGetAllJobPosts();
					}}
				/>
				<p className="grid text-green font-bold text-xl justify-center mb-3">
					XEM CHI TIẾT CÔNG VIỆC
				</p>
				<div className="">
					<p className="text-brown font-bold mb-3">
						{chosenJobPost?.serviceId?.name?.toUpperCase()}{' '}
						{chosenJobPost?.isUrgent && (
							<span className="text-red">(CẦN GẤP)</span>
						)}
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
									<p className="text-gray mb-2 text-center mt-3">Làm trong: </p>
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
						{chosenJobPost?.repeatitiveDetails?.isRepeatitive && (
							<div>
								<p className="text-black ml-10">
									+ Lặp lại mỗi{' '}
									{chosenJobPost?.repeatitiveDetails?.details?.every}{' '}
									{chosenJobPost?.repeatitiveDetails?.details?.option}
								</p>
								<p className="text-black ml-10">
									+ Kết thúc vào:{' '}
									{formatDateInput(
										chosenJobPost?.repeatitiveDetails?.details?.endDate
									)}
								</p>
								<p className="text-black ml-10">
									+ Gói làm việc bao gồm{' '}
									{chosenJobPost?.repeatitiveDetails?.details?.finalTimes} lần
									làm việc
								</p>
								{chosenJobPost?.repeatitiveDetails?.details?.chosenDays.length >
									0 && (
									<p className="text-black ml-10">
										+ Làm việc vào các ngày:{' '}
										{chosenJobPost?.repeatitiveDetails?.details?.chosenDays.map(
											(day, index) =>
												index + 1 !==
												chosenJobPost?.repeatitiveDetails?.details?.chosenDays
													.length
													? day + ', '
													: day + ''
										)}
									</p>
								)}
							</div>
						)}
					</p>
					<p className="text-gray mb-3">
						Ghi chú:{' '}
						<span className="text-black">
							{chosenJobPost?.note ? chosenJobPost?.note : 'Không có'}
						</span>
					</p>
					{chosenJobPost?.applicants?.findIndex(
						(applicant) => String(applicant) === String(account?._id)
					) == -1 && (
						<div className="flex mb-3">
							<input
								type="checkbox"
								className="w-3 mr-2"
								onChange={() => setIsChecked(!isChecked)}
							/>
							<p className="text-red">
								Bạn đã đọc kỹ thông tin và muốn{' '}
								{chosenJobPost?.isChosenYourself ? 'ứng tuyển' : 'nhận việc'}?
							</p>
						</div>
					)}

					<div className="flex justify-center">
						{chosenJobPost?.applicants?.findIndex(
							(applicant) => String(applicant) === String(account?._id)
						) != -1 ? (
							<button
								className={
									'text-white rounded-2xl text-xs py-2.5 text-center bg-brown hover:bg-light_yellow hover:text-brown'
								}
								style={{ width: '70%' }}
								disabled
							>
								<p className="text-center">
									Bạn đã ứng tuyển cho công việc này
								</p>
							</button>
						) : chosenJobPost?.isChosenYourself ? (
							<button
								className={`text-white rounded-2xl text-xs py-2.5 text-center  ${
									!isChecked
										? 'bg-gray'
										: 'bg-brown hover:bg-light_yellow hover:text-brown'
								}`}
								style={{ width: '70%' }}
								disabled={!isChecked}
								onClick={handleGetAJob}
							>
								<p className="text-center">Ứng tuyển</p>
							</button>
						) : (
							<button
								className={`text-white rounded-2xl text-xs py-2.5 text-center  ${
									!isChecked
										? 'bg-gray'
										: 'bg-brown hover:bg-light_yellow hover:text-brown'
								}`}
								style={{ width: '70%' }}
								disabled={!isChecked}
								onClick={handleGetAJob}
							>
								<p className="text-center">Nhận việc</p>
							</button>
						)}
					</div>
				</div>
			</form>
		</div>
	);
};
