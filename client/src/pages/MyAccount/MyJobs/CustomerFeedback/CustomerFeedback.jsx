import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import {
	createFeedback,
	getAllFeedbacks,
} from '../../../../features/domesticHelperFeedback/domesticHelperFeedbackSlice';
import { useForm } from 'react-hook-form';
import {
	getAccountInformation,
	updateRatingCustomer,
	updateRatingDomesticHelper,
} from '../../../../features/auth/authSlice';
import { Spinner } from '../../../../components';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';

export const CustomerFeedback = ({
	serviceName,
	serviceAddress,
	customerId,
	avatar,
	jobPostId,
    role
}) => {
	const { account, isLoading: isAuthLoading } = useSelector(
		(state) => state.auth
	);
	const [rating, setRating] = useState(0);
	const [hover, setHover] = useState(0);
	const [feedback, setFeedback] = useState('');

	const [showOtherFeedback, setShowOtherFeedback] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = async (data) => {
		const feedbackData = {
			...data,
			jobPostId,
			domesticHelperId: account?._id,
			feedbackFrom: role
		};
		const result = await dispatch(createFeedback(feedbackData));
		console.log(result);
		if (result.type.endsWith('fulfilled')) {
			toast.success('Feedback thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}

		if (rating != 0) {
			const ratingData = {
				rating: Number(rating),
			};
			await dispatch(
				updateRatingCustomer({
					ratingData,
					customerId: customerId,
				})
			);
		}

		await dispatch(getAccountInformation());
		await dispatch(getAllFeedbacks());
	};

	if (isAuthLoading) {
		return <Spinner />;
	}
	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	return (
		<div className="popup active">
			<div className="mx-auto bg-white shadow-2xl rounded-lg max-w-2xl p-10 max-h-[90vh] overflow-y-auto">
				<h2 className="text-center p-3 font-bold text-xl">
					ĐÁNH GIÁ CHỦ NHÀ
				</h2>
				<div>
					<p className="text-green">
						<span className="font-semibold">Dịch vụ: </span>
						{serviceName}
					</p>
					<p>
						<span className="font-semibold">Hoàn thành lúc: </span>17:24
						25/04/202
					</p>
					<p>
						<span className="font-semibold">Địa chỉ: </span>
						{serviceAddress}
					</p>
				</div>
				<div className="flex justify-center">
					<img
						src={avatar}
						alt="avatar"
						className="ml-3 rounded-full w-14 h-14 bg-green"
						onClick={toggleModal}
					/>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="p-5">
					<input
						{...register('customerId')}
						hidden="true"
						value={customerId}
					/>
					<div className="flex justify-center">
						{[...Array(5)].map((star, i) => {
							const ratingValue = i + 1;
							return (
								<label key={i}>
									<input
										{...register('rating')}
										type="radio"
										name="rating"
										className="hidden"
										value={ratingValue}
										onClick={(e) => setRating(e.target.value)}
									/>

									<FaStar
										className="star "
										color={
											ratingValue <= (hover || rating)
												? '#EBEA0B'
												: 'rgba(136, 114, 114, 0.8)'
										}
										size={25}
										onMouseEnter={() => setHover(ratingValue)}
										onMouseLeave={() => setHover(null)}
									/>
								</label>
							);
						})}
					</div>
					<div className="flex justify-center font-semibold mt-3 text-light_gray">
						<span>
							{rating == 1
								? ' RẤT TỆ'
								: rating == 2
								? 'TỆ'
								: rating == 3
								? 'ỔN'
								: rating == 4
								? 'TỐT'
								: rating == 5
								? 'TUYỆT VỜI'
								: ''}
						</span>
					</div>
					<div>
						<h3>Điều gì bạn mong muốn tốt hơn?</h3>
						<div className="grid grid-cols-2 gap-4">
							<input
								type="radio"
								id="select1"
								className="hidden"
								name="select"
								{...register('content')}
								value="Cung cấp chỉ dẫn cụ thể hơn"
								onClick={() => setShowOtherFeedback(false)}
							/>
							<label
								for="select1"
								className="flex justify-center rounded-md 
                            cursor-pointer items-center h-24 shadow-2xl hover:bg-light_yellow"
							>
								Cung cấp chỉ dẫn cụ thể hơn
							</label>

							<input
								type="radio"
								id="select2"
								className="hidden"
								name="select"
								{...register('content')}
								value="Đối xử lịch sự, tôn trọng"
								onClick={() => setShowOtherFeedback(false)}
							/>
							<label
								for="select2"
								className="flex justify-center rounded-md 
                            cursor-pointer items-center h-24 shadow-2xl  hover:bg-light_yellow"
							>
								Đối xử lịch sự, tôn trọng
							</label>

							<input
								type="radio"
								id="select3"
								className="hidden"
								name="select"
								{...register('content')}
								value="Thanh toán đúng hạn"
								onClick={() => setShowOtherFeedback(false)}
							/>
							<label
								htmlFor="select3"
								className="flex  justify-center rounded-md
                             cursor-pointer items-center h-24 shadow-2xl  hover:bg-light_yellow"
							>
								Thanh toán đúng hạn
							</label>

							<input
								type="radio"
								id="select4"
								className="hidden"
								name="select"
								{...register('content')}
								value="Khác"
								onClick={() => setShowOtherFeedback(true)}
							/>
							<label
								htmlFor="select4"
								className="flex  justify-center rounded-md
                             cursor-pointer items-center h-24 shadow-2xl  hover:bg-light_yellow"
							>
								Khác
							</label>
						</div>
					</div>

					{showOtherFeedback && (
						<>
							<div className=" flex justify-center mt-10 pb-10">
								<textarea
									rows={10}
									cols={60}
									{...register('content')}
									value={feedback}
									onChange={(e) => setFeedback(e.target.value)}
									placeholder="Enter your feedback"
									className=" rounded-md shadow-2xl shadow-gray p-3"
									required
								/>
							</div>
						</>
					)}
					<div className="flex items-center justify-center mt-10">
						<button
							type="submit"
							className="text-white hover:bg-yellow bg-green rounded-full p-2 w-44"
						>
							Đánh giá
						</button>
					</div>
				</form>
			</div>
			{/* mở to avatar */}
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
