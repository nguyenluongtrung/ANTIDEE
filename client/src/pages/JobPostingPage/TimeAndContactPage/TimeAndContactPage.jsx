import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { StepBar } from '../components/StepBar/StepBar';
import { useForm } from 'react-hook-form';
import './TimeAndContactPage.css';
import toast from 'react-hot-toast';
import { errorStyle } from '../../../utils/toast-customize';
import { formatDateInput } from '../../../utils/format';

export const TimeAndContactPage = () => {
	const { serviceId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	const address = location?.state?.address;
	const otherInfo = location?.state?.otherInfo;
	const workingTime = location?.state?.workingTime;
	const inputOptions = location?.state?.inputOptions;
	const isUrgent = location?.state?.isUrgent;
	const isChosenYourself = location?.state?.isChosenYourself;
	const isChosenYourFav = location?.state?.isChosenYourFav;
	const invitationCodeOwnerId = location?.state?.invitationCodeOwnerId;
	const promoId = location?.state?.promoId;
	const accountApoints= location?.state?.accountApoints;
	const isUsedPoint = location?.state?.isUsedPoint;
	const promotionId = location?.state?.promotionId;
	const promotionQuantity = location?.state?.promotionQuantity;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = (data) => {
		if (!data.fullName.trim()) {
			toast.error('Vui lòng điền "Tên liên hệ"', errorStyle);
			return;
		}
		if (!data.phoneNumber.trim()) {
			toast.error('Vui lòng điền "Số điện thoại"', errorStyle);
			return;
		}
		if (!data.email.trim()) {
			toast.error('Vui lòng điền "Email để biên nhận"', errorStyle);
			return;
		}
		if (!data.dueDate) {
			toast.error('Vui lòng chọn "Hạn chốt cho bài đăng"', errorStyle);
			return;
		}
		const contactInfo = {
			fullName: data.fullName,
			email: data.email,
			phoneNumber: data.phoneNumber,
		};
		navigate(`/job-posting/confirm/${serviceId}`, {
			state: {
				address,
				contactInfo,
				otherInfo: {
					...otherInfo,
					note: data.note,
					paymentMethod: data.paymentMethod,
				},
				dueDate: data.dueDate,
				workingTime,
				inputOptions,
				isUrgent,
				isChosenYourself,
				isChosenYourFav,
				invitationCodeOwnerId,
				promoId,
				accountApoints,
				isUsedPoint,
				promotionId,
				promotionQuantity,
			},
		});
	};

	return (
		<div className="w-full md:px-20">
			<StepBar serviceId={serviceId} />
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="schedule-form md:px-20 flex justify-center">
					<div
						className="contact-form shadow-xl p-10 hover:shadow-2xl hover:cursor-pointer"
						style={{ width: '500px' }}
					>
						<p className="font-extrabold mb-5">THÔNG TIN LIÊN HỆ</p>
						<div>
							<p className="font-semibold">Tên liên hệ</p>
							<input
								type="text"
								placeholder="Nguyễn Văn A"
								{...register('fullName')}
								className="p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none"
							/>
						</div>
						<div>
							<p className="font-semibold">Số điện thoại</p>
							<input
								type="text"
								placeholder="0123456789"
								{...register('phoneNumber')}
								className="p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none"
							/>
						</div>
						<div>
							<p className="font-semibold">Email để nhận biên nhận</p>
							<input
								type="text"
								placeholder="abc@gmail.com"
								{...register('email')}
								className="p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none"
							/>
						</div>
						<div className='flex items-center justify-between mb-2'>
							<p className="font-semibold">Hạn chốt cho bài đăng</p>
							<input
								type="date"
								{...register('dueDate')}
								max={new Date(workingTime.startingDate).toISOString().split('T')[0]}
								min={new Date().toISOString().split('T')[0]}
								defaultValue={formatDateInput(new Date())}
								className="border-2 rounded-md w-40 p-1.5 border-light_gray text-center focus:outline-none hover:cursor-pointer"
							/>
						</div>
						<div>
							<p className="font-semibold">Ghi chú</p>
							<input
								type="text"
								placeholder="Sau lưng bệnh viện 600 giường"
								{...register('note')}
								className="p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none"
							/>
						</div>
						<div>
							<p className="font-semibold">Thanh toán</p>
							<select
								className="p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none"
								style={{ width: '100%' }}
								{...register('paymentMethod')}
								defaultValue={'Tiền mặt'}
							>
								<option value={'Tiền mặt'}>Tiền mặt</option>
								<option value={'Ví người dùng'}>Ví người dùng</option>
							</select>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-center">
					<button
						className="mt-10 w-60 md:w-[500px] mb-10 py-3 bg-primary rounded-full text-white hover:opacity-70"
						type="submit"
					>
						Tiếp theo
					</button>
				</div>
			</form>
		</div>
	);
};
