import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import { AiOutlineClose } from 'react-icons/ai';
import { formatDate, formatWorkingTime } from '../../../../utils/format';
import { JobPostCancel } from '../JobPostCancel/JobPostCancel';

export const MyJobDetail = ({
	chosenJobPostId,
	setIsOpenJobPostDetail,
	myAccountId,
}) => {
	const [isOpenCancelForm, setIsOpenCancelForm] = useState(false);
	const { jobPosts, isLoading: jobPostLoading } = useSelector(
		(state) => state.jobPosts
	);
	const { isLoading: accountLoading } = useSelector((state) => state.auth);
	const [chosenJobPost, setChosenJobPost] = useState(
		jobPosts?.find((jobPost) => String(jobPost._id) === String(chosenJobPostId))
	);

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
							onClick={() => setIsOpenCancelForm(false)}
						/>
						<JobPostCancel
							jobPostId={chosenJobPostId}
							setIsOpenCancelForm={setIsOpenCancelForm}
							myAccountId={myAccountId}
						/>
					</div>
				</div>
			) : (
				<form className="content rounded-md p-5" style={{ width: '35vw' }}>
					<AiOutlineClose
						className="absolute text-sm hover:cursor-pointer"
						onClick={() => {
							setIsOpenJobPostDetail(false);
							handleGetAllQuestions();
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
						</div>
					</div>
				</form>
			)}
		</div>
	);
};
