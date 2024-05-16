import { useNavigate } from 'react-router-dom';
import { StepBar } from '../components/StepBar/StepBar';
import { Switch } from '@headlessui/react';

export const TimeAndContactPage = () => {
	const navigate = useNavigate();

	const handleNextStep = () => {
		navigate('/job-posting/confirm');
	};
	return (
		<div className="w-full px-20">
			<StepBar />

			<div className="schedule-form px-40">
				<div className="flex justify-between">
					<div className="my-3">
						<p className="mr-3 mb-2">Chọn ngày làm</p>
						<div className="grid grid-cols-2 border-2 rounded-md w-52 p-3 border-gray text-center">
							<p className="border-r-2 border-gray text-center">Ngày mai</p>
							<p>23/4/2024</p>
						</div>
					</div>
					<div className="my-3">
						<p className="mr-3 mb-2">Làm trong</p>
						<div className="grid grid-cols-2 border-2 rounded-md w-52 p-3 border-gray text-center">
							<p className="border-r-2 border-gray text-center">Ngày mai</p>
							<p>23/4/2024</p>
						</div>
					</div>
					<div className="my-3">
						<p className="mr-3 mb-2">Chọn giờ làm</p>
						<div className="grid grid-cols-2 border-2 rounded-md w-52 p-3 border-gray text-center">
							<p className="border-r-2 border-gray text-center">Ngày mai</p>
							<p>23/4/2024</p>
						</div>
					</div>
				</div>
				<div className="flex justify-between">
					<div className="left-schedule-form pt-3">
						<div>
							<table>
								<tbody>
									<tr>
										<td>
											<p className="mr-3 mb-3">Ưu tiên người làm yêu thích</p>
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
											<p className="mr-3 mb-3">Bạn tự chọn người làm</p>
										</td>
										<td className="pl-32">
											<Switch className="group inline-flex h-6 w-11 items-center rounded-full bg-primary transition data-[checked]:bg-green">
												<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
											</Switch>
										</td>
									</tr>
								</tbody>
							</table>
							<div className="flex"></div>
						</div>
					</div>
					<div className="right-schedule-form pt-3">
						<table>
							<tbody>
								<tr>
									<td>
										{' '}
										<p className="mr-3 mb-3">Đăng việc lặp lại</p>
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
										<p className="mr-3 mb-3">Cần gấp</p>
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
											type="number"
											className="rounded-xl p-1 border-2 border-gray mb-5"
										/>
									</td>
								</tr>
								<tr className='border-light_gray border-t-2'>
									<td>
										<p className="font-extrabold text-lg mt-5">GIÁ TIỀN</p>
									</td>
									<td className="pl-32">
										<p className="font-extrabold text-green text-lg">200,000</p>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div
				className="contact-form shadow-xl p-10 hover:shadow-2xl hover:cursor-pointer mx-auto"
				style={{ width: '500px' }}
			>
				<p className="font-extrabold mb-5">THÔNG TIN LIÊN HỆ</p>
				<div>
					<p className="font-semibold">Tên liên hệ</p>
					<input
						type="text"
						placeholder="Nguyễn Văn A"
						className="p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none"
					/>
				</div>
				<div>
					<p className="font-semibold">Số điện thoại</p>
					<input
						type="text"
						placeholder="0123456789"
						className="p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none"
					/>
				</div>
				<div>
					<p className="font-semibold">Email để nhận biên nhân</p>
					<input
						type="text"
						placeholder="abc@gmail.com"
						className="p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none"
					/>
				</div>
				<div>
					<p className="font-semibold">Ghi chú</p>
					<input
						type="text"
						placeholder="Số nhà 1, hẻm 2"
						className="p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none"
					/>
				</div>
				<div>
					<p className="font-semibold">Thanh toán</p>
					<input
						type="text"
						placeholder="Tiền mặt"
						className="p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none"
					/>
				</div>
			</div>

			<div className="flex items-center justify-center">
				<button
					className="mt-10 w-[500px] py-3 bg-primary rounded-full text-white hover:opacity-70"
					onClick={handleNextStep}
				>
					Tiếp theo
				</button>
			</div>
		</div>
	);
};
