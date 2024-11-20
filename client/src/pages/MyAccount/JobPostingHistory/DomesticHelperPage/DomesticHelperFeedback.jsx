import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import './DomesticHelper.css';
import toast from 'react-hot-toast';
import {
	createFeedback,
} from '../../../../features/domesticHelperFeedback/domesticHelperFeedbackSlice';
import { useForm } from 'react-hook-form';
import {
	addDomesticHelperToBlackList,
	addDomesticHelperToFavoriteList,
	updateRatingDomesticHelper,
} from '../../../../features/auth/authSlice';
import { Spinner } from '../../../../components';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { ratingService } from '../../../../features/services/serviceSlice';
import { AiOutlineClose } from 'react-icons/ai';

export const DomesticHelperFeedback = ({ selectedJobPost, onClose }) => {
	const { account, isLoading: isAuthLoading } = useSelector(
		(state) => state.auth
	);
	const [domesticHelperRating, setDomesticHelperRating] = useState(0);
	const [serviceRating, setServiceRating] = useState(0);
	const [domesticHelperRatingHover, setDomesticHelperRatingHover] = useState(0);
	const [serviceRatingHover, setServiceRatingHover] = useState(0);
	const [feedback, setFeedback] = useState('');

	const [blacklist, setBlacklist] = useState(false);
	const [favoriteList, setFavoriteList] = useState(false);

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
			jobPostId: selectedJobPost._id,
			feedbackFrom: 'Khách hàng',
			rating: domesticHelperRating,
			content: data.content
		};
		const createFeedbackResult = await dispatch(createFeedback(feedbackData));
		const ratingServiceResult = await dispatch(
			ratingService({
				serviceId: selectedJobPost.serviceId._id,
				rating: serviceRating,
			})
		);
		if (
			createFeedbackResult.type.endsWith('fulfilled') &&
			ratingServiceResult.type.endsWith('fulfilled')
		) {
			toast.success('Đánh giá thành công', successStyle);
			if (blacklist) {
				const blacklistResult = await dispatch(
					addDomesticHelperToBlackList(selectedJobPost.domesticHelperId._id)
				);
				if (blacklistResult.type.endsWith('fulfilled')) {
					toast.success('Thêm vào danh sách đen thành công', successStyle);
				} else {
					toast.error('Thêm vào danh sách đen thất bại', errorStyle);
				}
			}
			if (favoriteList) {
				const favoriteListResult = await dispatch(
					addDomesticHelperToFavoriteList(selectedJobPost.domesticHelperId._id)
				);
				if (favoriteListResult.type.endsWith('fulfilled')) {
					toast.success(
						'Thêm vào danh sách yêu thích thành công',
						successStyle
					);
				} else {
					toast.error('Thêm vào danh sách yêu thích thất bại', errorStyle);
				}
			}
		} else if (createFeedbackResult?.error?.message === 'Rejected') {
			toast.error(createFeedbackResult?.payload, errorStyle);
		} else if (ratingServiceResult?.error?.message === 'Rejected') {
			toast.error(ratingServiceResult?.payload, errorStyle);
		}

		if (domesticHelperRating != 0) {
			const domesticHelperRatingData = {
				domesticHelperRating: Number(domesticHelperRating),
			};
			await dispatch(
				updateRatingDomesticHelper({
					domesticHelperRatingData,
					domesticHelperId: selectedJobPost.domesticHelperId._id,
				})
			);
		}
		onClose();
	};

	if (isAuthLoading) {
		return <Spinner />;
	}
	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<div className="mx-auto bg-white shadow-2xl rounded-lg max-w-2xl mt-5 p-10 max-h-[80vh] overflow-y-auto">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="content rounded-md p-5"
				>
					<AiOutlineClose
						className="absolute text-sm hover:cursor-pointer"
						onClick={onClose}
					/>
					<h2 className="text-center text-green font-bold text-xl">
						ĐÁNH GIÁ TRẢI NGHIỆM
					</h2>
					<div>
						<p className="text-brown font-bold mb-3 text-center">
							{selectedJobPost?.serviceId?.name?.toUpperCase()}
						</p>
					</div>
					<div className="flex flex-col mb-2">
						<div className="flex gap-3">
							<p className="text-[14px]">Đánh giá giúp việc </p>
							<div className="flex justify-center">
								{[...Array(5)].map((star, i) => {
									const domesticHelperRatingValue = i + 1;
									return (
										<label key={i}>
											<input
												{...register('domesticHelperRating')}
												type="radio"
												name="domesticHelperRating"
												className="hidden"
												value={domesticHelperRatingValue}
												onClick={(e) => setDomesticHelperRating(e.target.value)}
											/>

											<FaStar
												className="star "
												color={
													domesticHelperRatingValue <=
													(domesticHelperRatingHover || domesticHelperRating)
														? '#EBEA0B'
														: 'rgba(136, 114, 114, 0.8)'
												}
												size={20}
												onMouseEnter={() =>
													setDomesticHelperRatingHover(
														domesticHelperRatingValue
													)
												}
												onMouseLeave={() => setDomesticHelperRatingHover(null)}
											/>
										</label>
									);
								})}
							</div>
						</div>
						<div className="flex gap-3">
							<p>Đánh giá trải nghiệm</p>
							<div className="flex justify-center">
								{[...Array(5)].map((_star, i) => {
									const serviceRatingValue = i + 1;
									return (
										<label key={i}>
											<input
												{...register('serviceRating')}
												type="radio"
												name="serviceRating"
												className="hidden"
												value={serviceRatingValue}
												onClick={(e) => setServiceRating(e.target.value)}
											/>

											<FaStar
												className="star "
												color={
													serviceRatingValue <=
													(serviceRatingHover || serviceRating)
														? '#EBEA0B'
														: 'rgba(136, 114, 114, 0.8)'
												}
												size={20}
												onMouseEnter={() =>
													setServiceRatingHover(serviceRatingValue)
												}
												onMouseLeave={() => setServiceRatingHover(null)}
											/>
										</label>
									);
								})}
							</div>
						</div>
					</div>

					<div>
						<p className="text-[14px] font-semibold mb-2">
							Điều gì bạn mong muốn tốt hơn?
						</p>
						<div className="grid grid-cols-2 gap-4">
							<input
								type="radio"
								id="select1"
								className="hidden"
								name="select"
								{...register('content')}
								value="Mặc đồng phục khi đi làm"
								onClick={() => setShowOtherFeedback(false)}
							/>
							<label
								for="select1"
								className="flex justify-center rounded-md 
                            cursor-pointer items-center h-24 shadow-2xl text-sm p-5 hover:bg-light_yellow"
							>
								Mặc đồng phục khi đi làm
							</label>

							<input
								type="radio"
								id="select2"
								className="hidden"
								name="select"
								{...register('content')}
								value="Làm cẩn thận hơn"
								onClick={() => setShowOtherFeedback(false)}
							/>
							<label
								for="select2"
								className="flex justify-center rounded-md 
                            cursor-pointer items-center h-24 shadow-2xl  text-sm p-5 hover:bg-light_yellow"
							>
								Làm cẩn thận hơn
							</label>

							<input
								type="radio"
								id="select3"
								className="hidden"
								name="select"
								{...register('content')}
								value="Thân thiện hơn"
								onClick={() => setShowOtherFeedback(false)}
							/>
							<label
								htmlFor="select3"
								className="flex  justify-center rounded-md
                             cursor-pointer items-center h-24 shadow-2xl  text-sm p-5 hover:bg-light_yellow"
							>
								Thân thiện hơn
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
                             cursor-pointer items-center h-24 shadow-2xl  text-sm p-5 hover:bg-light_yellow"
							>
								Khác
							</label>
						</div>
					</div>

					<div class="grid grid-rows-2 gap-2 mt-5 text-sm">
						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="options"
								value="option1"
								class="h-3 w-3"
								onClick={() => setFavoriteList(true)}
							/>
							Thêm người giúp việc vào danh sách yêu thích
						</label>

						<label className="flex items-center gap-2">
							<input
								type="radio"
								name="options"
								value="option2"
								class="h-3 w-3"
								onClick={() => setBlacklist(true)}
							/>
							Đưa người giúp việc vào danh sách đen
						</label>
					</div>

					{showOtherFeedback && (
						<>
							<div className="flex justify-center mt-10 pb-10">
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
					<div className="flex items-center justify-center mt-5">
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
