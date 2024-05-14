import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './VoucherDetail.css';
import { useEffect, useState } from 'react';
import { formatDate } from '../../../../utils/format';

export const VoucherDetail = ({ chosenVoucherId, setIsOpenDetailVoucher, handleGetAllVouchers }) => {
	const { vouchers, isLoading: voucherLoading } = useSelector((state) => state.vouchers);
	const [chosenVoucher, setChosenVoucher] = useState(
		vouchers[vouchers.findIndex((voucher) => String(voucher._id) == String(chosenVoucherId))]
	);

	const dispatch = useDispatch();

	if (voucherLoading) {
		return <Spinner />;
	}

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form className="content rounded-md p-5" style={{ width: '35vw' }}>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => {setIsOpenDetailVoucher(false) ; handleGetAllVouchers()}}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					XEM CHI TIẾT VOUCHER
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td>
								<span className='font-bold'>Tên voucher</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenVoucher?.name}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span className='font-bold'>Mô tả</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenVoucher?.description}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Ngày bắt đầu</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{formatDate(chosenVoucher?.startDate)}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Ngày kết thúc</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
								{formatDate(chosenVoucher?.endDate)}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Giá trị chiết khấu</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenVoucher?.discountValue}%
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Số lượng</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenVoucher?.quantity}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Điểm trao đổi</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenVoucher?.price}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Trạng thái</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
								{new Date(chosenVoucher?.endDate)?.getTime() >= new Date().getTime()?'Đang hoạt động':'Đã hết hạn'}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Mã giảm giá</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenVoucher?.code}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Thương hiệu</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenVoucher?.brand}
								</p>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</div>
	);
};
