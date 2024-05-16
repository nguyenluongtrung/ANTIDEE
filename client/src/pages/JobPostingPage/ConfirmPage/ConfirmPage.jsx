import { StepBar } from '../components/StepBar/StepBar';
import './ConfirmPage.css';

export const ConfirmPage = () => {
	return (
		<div className="w-full px-20">
			<StepBar />

			<div
				className="confirm-form mx-auto py-7 px-16 rounded-xl border-2 mt-5 border-light_gray"
				style={{ width: '70%' }}
			>
				<p className="font-extrabold text-brown mb-3">DỌN DẸP NHÀ CỬA</p>
				<p className="custom-border-bottom pb-3 mb-3 font-semibold">
					CHI TIẾT CÔNG VIỆC
				</p>
				<table>
					<tbody>
						<tr>
							<td>
								<p className="text-gray my-3">Địa chỉ</p>
							</td>
							<td style={{ paddingLeft: '150px' }}>
								<p>K69/72 Đống Đa - Hải Châu - Đà Nẵng</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Ghi chú</p>
							</td>
							<td style={{ paddingLeft: '150px' }}>
								<p>Lau 2 phòng ngủ, 1 phòng khách, dọn dẹp bếp, đổ rác</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Thời gian làm việc</p>
							</td>
							<td style={{ paddingLeft: '150px' }}>
								<p>10:00 - 12:00 thứ sáu, 20/04/2018</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Khối lượng công việc</p>
							</td>
							<td style={{ paddingLeft: '150px' }}>
								<p>55 mét vuông / 2 phòng</p>
							</td>
						</tr>
					</tbody>
				</table>
				<p className="custom-border-bottom pb-3 mb-3 font-semibold">
					THÔNG TIN LIÊN HỆ
				</p>
				<table>
					<tbody>
						<tr>
							<td>
								<p className="text-gray my-3">Tên liên hệ</p>
							</td>
							<td className="pl-32">
								<p>Thiên Phú</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Số điện thoại</p>
							</td>
							<td className="pl-32">
								<p>0909707347</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Email để nhận biên nhận</p>
							</td>
							<td className="pl-32">
								<p>phthienphu@gmail.com</p>
							</td>
						</tr>
					</tbody>
				</table>
				<p className="custom-border-bottom pb-3 mb-3 font-semibold">
					THANH TOÁN
				</p>
				<table>
					<tbody>
						<tr>
							<td>
								<p className="text-gray my-3">Giá tiền</p>
							</td>
							<td className="pl-32">
								<p>100,000 VND</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Phương thức thanh toán</p>
							</td>
							<td className="pl-32">
								<p>Tiền mặt</p>
							</td>
						</tr>
					</tbody>
				</table>

				<div className="confirm-text">
					<input type="checkbox" className="w-3" />{' '}
					<span>Xác nhận nội dung công việc</span>
				</div>
			</div>

			<div className="flex items-center justify-center">
				<button className="mt-10 w-[200px] py-3 bg-green rounded-full text-white hover:opacity-70">
					Hoàn tất
				</button>
			</div>
		</div>
	);
};