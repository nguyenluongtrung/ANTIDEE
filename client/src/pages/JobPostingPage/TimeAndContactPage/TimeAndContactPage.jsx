import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { StepBar } from '../components/StepBar/StepBar';
import { Switch } from '@headlessui/react';
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
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = (data) => {
		if (!data.startingHour.trim()) {
			toast.error('Vui lòng chọn giờ làm', errorStyle);
			return;
		} 
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
		const workingTime = {
			startingDate: data.startingDate,
			startingHour: data.startingHour,
			workingHours: data.workingHours,
		}
		const contactInfo = {
			fullName: data.fullName,
			email: data.email,
			phoneNumber: data.phoneNumber,
		}
		const otherInfo = {
			note: data.note,
			paymentMethod: data.paymentMethod
		}
		navigate(`/job-posting/confirm/${serviceId}`, { state: { address, workingTime, contactInfo, otherInfo } });
	};

	return (
		<div className="w-full px-20">
			<StepBar />
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="schedule-form px-20">
					<div className="flex justify-between">
						<div className="left-schedule-form shadow-xl p-10 hover:shadow-2xl hover:cursor-pointer pt-12">
							<div>
								<p className="font-extrabold mb-5">LỰA CHỌN THỜI GIAN</p>
								<table>
									<tbody>
										<tr>
											<td>
												<p className="mr-3 mb-8">Chọn ngày làm</p>
											</td>
											<td className="pl-32">
												<input
													type="date"
													{...register('startingDate')}
													min={new Date().toISOString().split('T')[0]}
													defaultValue={formatDateInput(new Date())}
													className="border-2 rounded-md w-52 p-1.5 border-light_gray text-center focus:outline-none hover:cursor-pointer"
												/>
											</td>
										</tr>
										<tr>
											<td>
												<p className="mr-3 mb-8">Làm trong</p>
											</td>
											<td className="pl-32">
												<select className="border-2 rounded-md w-52 p-2 border-light_gray text-center focus:outline-none" {...register('workingHours')}>
													<option value={2}>2 tiếng</option>
													<option value={3}>3 tiếng</option>
													<option value={4}>4 tiếng</option>
													<option value={5}>5 tiếng</option>
												</select>
											</td>
										</tr>
										<tr>
											<td>
												<p className="mr-3 mb-6">Chọn giờ làm</p>
											</td>
											<td className="pl-32">
												<input
													type="time"
													{...register('startingHour')}
													className="focus:outline-none hover:cursor-pointer"
												/>
											</td>
										</tr>
										<tr>
											<td>
												<p className="mr-3 mb-6 mt-3">
													Ưu tiên người làm yêu thích
												</p>
											</td>
											<td className="pl-32">
												{' '}
												<Switch className="group inline-flex h-6 w-11 items-center rounded-full bg-primary transition data-[checked]:bg-green">
													<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
												</Switch>
											</td>
										</tr>
										<tr>
											<td>
												<p className="mr-3 mb-6 mt-3">Bạn tự chọn người làm</p>
											</td>
											<td className="pl-32">
												<Switch className="group inline-flex h-6 w-11 items-center rounded-full bg-primary transition data-[checked]:bg-green">
													<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
												</Switch>
											</td>
										</tr>
										<tr>
											<td>
												{' '}
												<p className="mr-3 mb-6 mt-3">Đăng việc lặp lại</p>
											</td>
											<td className="pl-32">
												{' '}
												<Switch className="group inline-flex h-6 w-11 items-center rounded-full bg-primary transition data-[checked]:bg-green">
													<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
												</Switch>
											</td>
										</tr>
										<tr>
											<td>
												<p className="mr-3 mb-2 mt-3">Cần gấp</p>
											</td>
											<td className="pl-32">
												<Switch className="group inline-flex h-6 w-11 items-center rounded-full bg-primary transition data-[checked]:bg-green">
													<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
												</Switch>
											</td>
										</tr>
										<tr>
											<td>
												<p className="mr-3">Nhập mã khuyến mãi</p>
											</td>
											<td className="pl-32">
												<input
													type="text"
													className="border-2 rounded-md w-52 p-1.5 border-light_gray text-center focus:outline-none mb-5"
												/>
											</td>
										</tr>
										<tr className="border-light_gray border-t-2">
											<td>
												<p className="font-extrabold text-lg mt-5">GIÁ TIỀN</p>
											</td>
											<td className="pl-32">
												<p className="font-extrabold text-green text-lg mt-5">
													200,000
												</p>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

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
									<option value={'Tiền mặt'} >
										Tiền mặt
									</option>
									<option value={'Chuyển khoản'}>Chuyển khoản</option>
								</select>
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-center">
					<button
						className="mt-10 w-[500px] py-3 bg-primary rounded-full text-white hover:opacity-70"
						type="submit"
					>
						Tiếp theo
					</button>
				</div>
			</form>
		</div>
	);
};
