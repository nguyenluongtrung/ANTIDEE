import { useLocation, useParams } from 'react-router-dom';
import { StepBar } from '../components/StepBar/StepBar';
import './ConfirmPage.css';
import { formatDate, formatWorkingTime } from '../../../utils/format';
import { useState } from 'react';

export const ConfirmPage = () => {
	const { serviceId } = useParams();
	const [isChecked, setIsChecked] = useState(false);
	const location = useLocation();
	const address = location?.state?.address;
	const contactInfo = location?.state?.contactInfo;
	const workingTime = location?.state?.workingTime;
	const otherInfo = location?.state?.otherInfo;
	const inputOptions = location?.state?.inputOptions;

	return (
		<div className="w-full px-20">
			<StepBar serviceId={serviceId} />

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
								<p>
									{address?.houseType +
										', ' +
										address?.street +
										', ' +
										address?.ward +
										', ' +
										address?.district +
										', ' +
										address?.province}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Ghi chú</p>
							</td>
							<td style={{ paddingLeft: '150px' }}>
								<p>{otherInfo?.note || 'Không có'}</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Thời gian làm việc</p>
							</td>
							<td style={{ paddingLeft: '150px' }}>
								<p>{`${formatWorkingTime(
									workingTime?.startingHour
								)}, ${formatDate(workingTime?.startingDate)}`}</p>
							</td>
						</tr>
						<tr>
							<td className='w-36'>
								<p className="text-gray my-3">Khối lượng công việc</p>
							</td>
							<td style={{ paddingLeft: '150px' }}>
								{inputOptions?.map((option) => {
									return (
										<p>
											- {option?.optionName}: {option?.optionValue}
										</p>
									);
								})}
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
								<p style={{paddingLeft: '5px'}}>{contactInfo?.fullName}</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Số điện thoại</p>
							</td>
							<td className="pl-32">
								<p style={{paddingLeft: '5px'}}>{contactInfo?.phoneNumber}</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Email để nhận biên nhận</p>
							</td>
							<td className="pl-32">
								<p style={{paddingLeft: '5px'}}>{contactInfo?.email}</p>
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
								<p style={{paddingLeft: '5px'}}>{otherInfo?.totalPrice} VND</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Phương thức thanh toán</p>
							</td>
							<td className="pl-32">
								<p style={{paddingLeft: '5px'}}>{otherInfo?.paymentMethod}</p>
							</td>
						</tr>
					</tbody>
				</table>

				<div className="confirm-text">
					<input
						type="checkbox"
						className="w-3"
						onChange={() => setIsChecked(!isChecked)}
					/>{' '}
					<span>Xác nhận nội dung công việc</span>
				</div>
			</div>

			<div className="flex items-center justify-center">
				<button
					className={`mt-10 w-[200px] py-3 rounded-full text-white hover:opacity-70 ${
						!isChecked ? 'bg-gray' : 'bg-green'
					}`}
					disabled={!isChecked}
				>
					Hoàn tất
				</button>
			</div>
		</div>
	);
};
