import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { applyAJob, getAJob } from '../../../features/jobPosts/jobPostsSlice';
import './JobPostDetail.css';
import { getAccountInformation } from '../../../features/auth/authSlice';

export const JobPostDetail = React.memo(({ onClose, selectedJobPost }) => {
	const [isChecked, setIsChecked] = useState(false);
	const { account } = useSelector((state) => state.auth);

	const dispatch = useDispatch();

	const handleGetAJob = async (e) => {
		e.preventDefault();
		if (!JSON.parse(localStorage.getItem('account'))) {
			setIsOpenLoginForm(true);
			setIsChecked(false);
			return;
		}
		const account = JSON.parse(localStorage.getItem('account')).data.account;
		if (account?.address == null) {
			toast.error(
				'Bạn cần bổ sung địa chỉ để đủ điều kiện nhận việc',
				errorStyle
			);
			onClose();
			return;
		}
		const addressDetails = selectedJobPost?.contactInfo?.address.split(',');
		const jobCity = addressDetails[addressDetails.length - 1].trim();
		const myCity = account?.address
			.split(',')
			[account?.address.split(',').length - 1].trim();
		if (!jobCity.toUpperCase().includes(myCity.toUpperCase())) {
			toast.error(
				'Địa chỉ làm việc của bạn không phù hợp cho công việc này',
				errorStyle
			);
			onClose();
			return;
		}
		if (account.accountBalance < Math.round(0.3 * selectedJobPost.totalPrice)) {
			toast.error(
				`Bạn cần có ít nhất ${Math.round(
					0.3 * selectedJobPost.totalPrice
				)} trong tài khoản để nhận công việc này`,
				errorStyle
			);
			onClose();
			return;
		}
		if (String(account._id) == String(selectedJobPost.customerId)) {
			toast.error('Bạn không được nhận công việc của chính mình', errorStyle);
			onClose();
			return;
		}
		let result;
		if (selectedJobPost?.isChosenYourself) {
			result = await dispatch(
				applyAJob({
					jobPostId: selectedJobPost._id,
					accountId: account._id,
				})
			);
		} else {
			result = await dispatch(
				getAJob(
					selectedJobPost._id,
				)
			);
		}
		if (result.type.endsWith('fulfilled')) {
			toast.success(
				selectedJobPost?.isChosenYourself
					? 'Ứng tuyển công việc thành công'
					: 'Nhận công việc thành công',
				successStyle
			);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		onClose();
		await dispatch(getAccountInformation());
	};

	// useEffect(() => {
	// 	if (JSON.parse(localStorage.getItem('account'))) {
	// 		setAccount(JSON.parse(localStorage.getItem('account')).data.account);
	// 		setIsOpenLoginForm(false);
	// 	}
	// }, [JSON.parse(localStorage.getItem('account'))]);

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form className="content rounded-md p-5" style={{ width: '35vw' }}>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={onClose}
				/>
				<p className="grid text-green font-bold text-xl justify-center mb-3">
					XEM CHI TIẾT CÔNG VIỆC
				</p>
				<div className="">
					<p className="text-brown font-bold mb-3">
						{selectedJobPost?.serviceId?.name?.toUpperCase()}{' '}
						{selectedJobPost?.isUrgent && (
							<span className="text-red">(CẦN GẤP)</span>
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
										{Intl.NumberFormat().format(selectedJobPost?.totalPrice)} VND
									</p>
								</div>
							</div>
						)}
					</div>
					<p className="text-gray mb-2 ">
						Tại:{' '}
						<span
							className={`text-black ${
								!JSON.parse(localStorage.getItem('account')) && 'blur-text'
							}`}
						>
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
					<p className="text-gray mb-3">
						Ghi chú:{' '}
						<span className="text-black">
							{selectedJobPost?.note ? selectedJobPost?.note : 'Không có'}
						</span>
					</p>
					{selectedJobPost?.applicants?.findIndex(
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
								{selectedJobPost?.isChosenYourself ? 'ứng tuyển' : 'nhận việc'}?
							</p>
						</div>
					)}

					<div className="flex justify-center">
						{selectedJobPost?.applicants?.findIndex(
							(applicant) => String(applicant._id) === String(account?._id)
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
						) : selectedJobPost?.isChosenYourself ? (
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
});
