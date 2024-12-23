import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { cancelAJobDomesticHelper } from '../../../../features/jobPosts/jobPostsSlice';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { getAccountInformation } from '../../../../features/auth/authSlice';
import { AiOutlineClose } from 'react-icons/ai';

export const JobPostCancel = ({ jobPostId, onClose }) => {
	const [showOtherFeedback, setShowOtherFeedback] = useState(false);
	const [reason, setReason] = useState('');
	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await dispatch(
			cancelAJobDomesticHelper({
				reason,
				jobPostId,
			})
		);
		if (result.type.endsWith('fulfilled')) {
			toast.success(result?.payload?.msg, successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		await dispatch(getAccountInformation());
		onClose();
	};

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form
				className="content rounded-md px-8 py-5 overflow-y-auto"
				style={{ width: '600px', maxHeight: '518px' }}
				onSubmit={handleSubmit}
			>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={onClose}
				/>
				<p className="grid text-green font-bold text-xl justify-center mb-3">
					LÍ DO HỦY VIỆC
				</p>
				<div className="grid grid-cols-2 gap-4">
					<input
						type="radio"
						id="select1"
						className="hidden"
						name="select"
						onClick={() => {
							setShowOtherFeedback(false);
							setReason('Bận việc đột xuất');
						}}
					/>
					<label
						for="select1"
						className="flex justify-center rounded-md 
                            cursor-pointer items-center h-24 shadow-2xl hover:bg-light_yellow"
					>
						Bận việc đột xuất
					</label>
					<input
						type="radio"
						id="select2"
						className="hidden"
						name="select"
						onClick={() => {
							setShowOtherFeedback(false);
							setReason('Đăng nhầm ngày');
						}}
					/>
					<label
						for="select2"
						className="flex justify-center rounded-md 
                            cursor-pointer items-center h-24 shadow-2xl hover:bg-light_yellow"
					>
						Việc không phù hợp nữa
					</label>
					<input
						type="radio"
						id="select3"
						className="hidden"
						name="select"
						onClick={() => {
							setShowOtherFeedback(false);
							setReason('Không cần việc này nữa');
						}}
					/>
					<label
						htmlFor="select3"
						className="flex justify-center rounded-md
                             cursor-pointer items-center h-24 shadow-2xl hover:bg-light_yellow"
					>
						Không cần việc này nữa
					</label>
					<input
						type="radio"
						id="select4"
						className="hidden"
						name="select"
						onClick={() => setShowOtherFeedback(true)}
					/>
					<label
						htmlFor="select4"
						className={`${
							showOtherFeedback ? 'hover:bg-light_yellow' : ''
						} flex justify-center rounded-md
                             cursor-pointer items-center h-24 shadow-2xl`}
					>
						Khác
					</label>
				</div>
				{showOtherFeedback && (
					<div className=" flex justify-center mt-10 pb-10">
						<textarea
							rows={5}
							cols={60}
							placeholder="Nhập lí do khác"
							className=" rounded-md shadow-2xl shadow-gray p-3 focus:outline-none"
							required
							onChange={(e) => setReason(e.target.value)}
						/>
					</div>
				)}
				<div className="mt-5">
					<p>(*) Quy định hủy công việc như sau:</p>
					<p className="pl-10">1. Bạn sẽ mất tiền cọc khi nhận việc</p>
					<p className="pl-10">
						2. Độ tin cậy của bạn sẽ giảm sau mỗi lần hủy việc
					</p>
					<p>Bạn chắc chắn hủy công việc này?</p>
				</div>
				<div className="flex mt-5">
					<button
						className="p-2 rounded-xl bg-yellow text-white mr-28"
						onClick={onClose}
					>
						<span>Đóng</span>
					</button>
					<button className="p-2 rounded-xl text-white bg-brown" type="submit">
						<span>Hủy công việc</span>
					</button>
				</div>
			</form>
		</div>
	);
};
