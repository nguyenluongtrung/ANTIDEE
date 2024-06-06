import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import { AiOutlineClose } from 'react-icons/ai';
import {
	formatDate,
	formatTime,
	formatWorkingTime,
} from '../../../../utils/format';
import toast from 'react-hot-toast';
import { IoMdCheckboxOutline } from 'react-icons/io';
import { selectATasker } from '../../../../features/jobPosts/jobPostsSlice';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';

export const HistoryJobPostDetail = ({
	chosenJobPostId,
	setIsOpenJobPostDetail,
	accounts,
}) => {
	const [isOpenApplicantsDetails, setIsOpenApplicantsDetails] = useState(false);
	const { jobPosts, isLoading } = useSelector((state) => state.jobPosts);
	const [chosenJobPost, setChosenJobPost] = useState(
		jobPosts?.find((jobPost) => String(jobPost._id) === String(chosenJobPostId))
	);

	const dispatch = useDispatch();

	const handleSelectTasker = async (id) => {
		const result = await dispatch(selectATasker({chosenJobPostId,taskerId:id}));

		if (result.type.endsWith('fulfilled')) {
			toast.success('Cập nhật thông tin tài khoản thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
	}

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
						handleGetAllQuestions();
					}}
				/>
				{!isOpenApplicantsDetails ? (
					<>
						<p className="grid text-green font-bold text-xl justify-center mb-3">
							XEM CHI TIẾT CÔNG VIỆC ĐÃ ĐĂNG
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
							<p className="text-gray mb-2">
								Đã đăng lúc: {''}
								<span className="text-brown">
									{formatDate(chosenJobPost?.createdAt)}{' '}
									{formatTime(Date.parse(chosenJobPost?.createdAt))}
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
							<p className="text-gray mb-3">
								Ghi chú:{' '}
								<span className="text-black">
									{chosenJobPost?.note ? chosenJobPost?.note : 'Không có'}
								</span>
							</p>
							{chosenJobPost?.isChosenYourself && (
								<p
									className="text-gray mb-3 hover:text-brown hover:cursor-pointer"
									onClick={() => setIsOpenApplicantsDetails(true)}
								>
									Xem danh sách người ứng tuyển{' '}
								</p>
							)}

							<div className="flex justify-center">
								<button
									className={
										'text-white rounded-2xl text-xs py-2.5 text-center bg-brown hover:bg-light_yellow hover:text-brown'
									}
									style={{ width: '70%' }}
								>
									<p className="text-center">Hủy việc</p>
								</button>
							</div>
						</div>
					</>
				) : (
					<>
						<p className="grid text-green font-bold text-xl justify-center mb-3">
							DANH SÁCH NHỮNG NGƯỜI ỨNG TUYỂN
						</p>
						<div>
							{chosenJobPost?.applicants?.map((applicant, index) => (
								<div className="flex rounded-2xl p-5 mb-5" style={{backgroundColor: 'rgba(100,100,100,0.1)'}}>
									<div className="mr-10 flex flex-col justify-center">
										<img
											src={
												accounts?.find(
													(acc) => String(acc._id) == String(applicant)
												)?.avatar
											}
											className="w-16 rounded-full"
										/>
									</div>
									<div className="w-80">
										<p className="font-bold">
											{
												accounts?.find(
													(acc) => String(acc._id) == String(applicant)
												)?.name
											}
										</p>
										<p className="">Điểm uy tín: 4.5 / 5.0</p>
										<p className="italic mt-1 text-white bg-primary rounded-2xl p-1 w-20 text-center">
											{
												accounts?.find(
													(acc) => String(acc._id) == String(applicant)
												)?.accountLevel?.domesticHelperLevel?.name
											}
										</p>
									</div>
									<div className="flex flex-col justify-center">
										<IoMdCheckboxOutline size={25} className='text-brown hover:cursor-pointer hover:text-green' onClick={() => handleSelectTasker(applicant)}/>
									</div>
								</div>
							))}
						</div>
						<div className="flex justify-center mt-5">
							<button
								className={
									'text-white rounded-2xl text-xs py-2.5 text-center bg-brown hover:bg-light_yellow hover:text-brown'
								}
								style={{ width: '70%' }}
								onClick={() => setIsOpenApplicantsDetails(false)}
							>
								<p className="text-center">Quay về</p>
							</button>
						</div>
					</>
				)}
			</form>
		</div>
	);
};
