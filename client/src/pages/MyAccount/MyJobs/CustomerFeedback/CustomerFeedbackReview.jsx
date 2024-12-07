import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { Spinner } from '../../../../components';
import { AiOutlineClose } from 'react-icons/ai';

export const CustomerFeedBackReview = ({
	selectedJobPost,
	selectedFeedback,
	onClose,
}) => {
	const { isLoading } = useState();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [colorChosen, setColorChosen] = useState(false);

	useEffect(() => {
		setColorChosen(true);
	}, []);

	if (isLoading) {
		return <Spinner />;
	}
	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<div className="rounded-md p-5 lg:w-[470px] sm:w-[50%] md:w-[25%] !min-w-[370px]">
				<form className="content rounded-md p-5">
					<AiOutlineClose
						className="absolute text-sm hover:cursor-pointer"
						onClick={onClose}
					/>
					<h2 className="text-center text-green font-bold text-xl">
						REVIEW ĐÁNH GIÁ CHỦ NHÀ
					</h2>
					<div>
						<p className="text-brown font-bold text-center mt-4">
							{selectedJobPost?.serviceId?.name?.toUpperCase()}
						</p>
					</div>
					<div className="flex justify-center mb-4">
						{[...Array(5)].map((star, i) => {
							const ratingValue = i + 1;
							return (
								<label key={i}>
									<FaStar
										className="star "
										color={
											ratingValue <= selectedFeedback?.rating
												? '#EBEA0B'
												: 'rgba(136, 114, 114, 0.8)'
										}
										size={25}
									/>
								</label>
							);
						})}
					</div>
					<div>
						<p className="text-[14px] font-semibold mb-2">
							Điều gì bạn mong muốn tốt hơn?
						</p>
						<div className="grid grid-cols-2 gap-4">
							<label
								for="select1"
								className={`flex justify-center rounded-md 
                            cursor-pointer items-center h-24 text-sm p-5 shadow-2xl ${
															selectedFeedback?.content ===
															'Cung cấp chỉ dẫn cụ thể hơn'
																? 'bg-light_yellow'
																: ''
														}`}
							>
								Cung cấp chỉ dẫn cụ thể hơn
							</label>
							<label
								for="select2"
								className={`flex justify-center rounded-md 
                  cursor-pointer items-center h-24 text-sm p-5 shadow-2xl ${
										selectedFeedback?.content === 'Đối xử lịch sự, tôn trọng'
											? 'bg-light_yellow'
											: ''
									}`}
							>
								Đối xử lịch sự, tôn trọng
							</label>
							<label
								htmlFor="select3"
								className={`flex justify-center rounded-md 
                  cursor-pointer items-center h-24 text-sm p-5 shadow-2xl ${
										selectedFeedback?.content === 'Thanh toán đúng hạn'
											? 'bg-light_yellow'
											: ''
									}`}
							>
								Thanh toán đúng hạn
							</label>
							<label
								htmlFor="select4"
								className={`flex justify-center rounded-md 
                  cursor-pointer items-center h-24 text-sm p-5 shadow-2xl
                   ${
											![
												'Thanh toán đúng hạn',
												'Đối xử lịch sự, tôn trọng',
												'Cung cấp chỉ dẫn cụ thể hơn',
											].includes(selectedFeedback?.content)
												? 'bg-light_yellow'
												: ''
										}`}
							>
								Khác
							</label>{' '}
						</div>
					</div>
					{colorChosen &&
						![
							'Thanh toán đúng hạn',
							'Đối xử lịch sự, tôn trọng',
							'Cung cấp chỉ dẫn cụ thể hơn',
						].includes(selectedFeedback?.content) && (
							<>
								<div className="focus:outline-none flex justify-center mt-5">
									<textarea
										rows={5}
										cols={60}
										defaultValue={selectedFeedback?.content}
										className=" rounded-md shadow-2xl text-sm shadow-gray p-5 focus:outline-none "
										readOnly
									/>
								</div>
							</>
						)}
				</form>
			</div>
			{isModalOpen && (
				<div className="modal">
					<div className="modal-content">
						<span className="close" onClick={toggleModal}>
							&times;
						</span>
						<img
							src={avatar}
							alt="Enlarged avatar"
							className="enlarged-avatar"
						/>
					</div>
				</div>
			)}
		</div>
	);
};
