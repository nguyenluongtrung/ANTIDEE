import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../components';
import { useState } from 'react';
import { formatDate, formatTime } from '../../../utils/format';

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
					XEM CHI TIẾT CÔNG VIỆC
				</p>
				<div className="">
					<p className="text-brown font-bold mb-3">
						{chosenJobPost?.serviceId?.name.toUpperCase()}
					</p>
					<p className="text-gray mb-2">
						Bắt đầu lúc:{' '}
						<span className="text-brown">
							{formatDate(chosenJobPost?.startingTime)}{' '}
							{formatTime(chosenJobPost?.startingTime)}
						</span>
					</p>
					<p className="text-gray mb-2">
						Mô tả:{' '}
						<span className="text-black">{chosenJobPost?.description}</span>
					</p>
					<div className="border-2 border-gray grid grid-cols-2 my-3">
						<div className="border-r-2 border-gray">
							<p className="text-gray mb-2 text-center mt-3">Làm trong: </p>
							<p className="text-center text-brown font-bold mb-3">
								{chosenJobPost?.workingHours} giờ
							</p>
						</div>
						<div>
							<p className="text-gray mb-2 text-center mt-3">Số tiền: </p>
							<p className="text-center text-brown font-bold mb-3"></p>
						</div>
					</div>
					<p className="text-gray mb-2 ">
						Tại:{' '}
						<span className="text-black">
							{chosenJobPost?.contactInfo?.address}
						</span>
					</p>
					<p className="text-gray mb-3">
						Ghi chú: <span className="text-black">{chosenJobPost?.note}</span>
					</p>
					<div className="flex mb-3">
						<input type="checkbox" className="w-3 mr-2" onChange={() => setIsChecked(!isChecked)}/>
						<p className="text-red">
							Bạn đã đọc kỹ thông tin và muốn nhận việc?
						</p>
					</div>
					<div className="flex justify-center">
						<button
							className={`text-white rounded-2xl text-xs py-2.5 text-center  ${!isChecked ? 'bg-gray' : 'bg-brown hover:bg-light_yellow hover:text-brown'}`}
							style={{ width: '70%' }}
                            disabled={!isChecked}
						>
							<p className="text-center">Nhận việc</p>
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};