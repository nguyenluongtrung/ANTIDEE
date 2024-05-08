import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './PromotionDetail.css';
import { useEffect, useState } from 'react';
import { getAllServices } from '../../../../features/services/serviceSlice';
import {formatDate} from '../../../../utils/format'
export const PromotionDetail = ({ chosenPromotionId, setIsOpenDetailPromotion, handleGetAllPromotions }) => {
	const { promotions, isLoading: promotionLoading } = useSelector((state) => state.promotions);
	const { services, isLoading: serviceLoading } = useSelector(
		(state) => state.services
	);
	const [chosenPromotion, setChosenPromotion] = useState(
		promotions[promotions.findIndex((promotion) => String(promotion._id) == String(chosenPromotionId))]
	);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllServices());
	}, []);

	if (promotionLoading || serviceLoading) {
		return <Spinner />;
	}

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form className="content rounded-md p-5" style={{ width: '35vw' }}>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => {setIsOpenDetailPromotion(false) ; handleGetAllPromotions()}}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					XEM CHI TIẾT MÃ GIẢM GIÁ
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td>
								<span className='font-bold'>Tên khuyến mãi</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenPromotion?.promotionName}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span className='font-bold'>Ngày bắt đầu</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
                                {formatDate(chosenPromotion?.startDate)}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Ngày kết thúc</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
                                {formatDate(chosenPromotion?.endDate)}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Giá trị khuyến mãi</span>
							</td>
							<td className="pl-6 py-1 w-80">
                            <p className="text-center" style={{ width: '100%' }}>
									{chosenPromotion?.promotionValue} 
								</p>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span className='font-bold'>Mã khuyến mãi</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenPromotion?.promotionCode}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Số lượng mã khuyến mãi</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenPromotion?.promotionQuantity}{' '}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Dịch vụ áp dụng</span>
							</td>
							<td className="pl-6 py-1 w-80">
							{chosenPromotion?.serviceIds.map((service) => <p>{service?.name}</p>)}

							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</div>
	);
};
