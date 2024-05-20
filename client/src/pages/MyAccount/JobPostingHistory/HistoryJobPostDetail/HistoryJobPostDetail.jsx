import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import { AiOutlineClose } from 'react-icons/ai';
import { formatDate, formatTime, formatWorkingTime } from '../../../../utils/format';

export const HistoryJobPostDetail = ({
	chosenJobPostId,
	setIsOpenJobPostDetail,
}) => {
	const { jobPosts, isLoading } = useSelector((state) => state.jobPosts);
	const [chosenJobPost, setChosenJobPost] = useState(
		jobPosts?.find((jobPost) => String(jobPost._id) === String(chosenJobPostId))
	);

	const dispatch = useDispatch();

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
					<div className="border-2 border-gray grid grid-cols-2 my-3">
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
			</form>
		</div>
	);
};
