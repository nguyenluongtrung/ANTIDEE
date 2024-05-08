/* eslint-disable react/jsx-key */
import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import './PromotionManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import { deletePromotion, getAllPromotions } from '../../../features/promotions/promotionSlice';
import { Spinner } from '../../../components';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { CreatePromotion } from './CreatePromotion/CreatePromotion';
import { UpdatePromotion } from './UpdatePromotion/UpdatePromotion';
import { PromotionDetail } from './PromotionDetail/PromotionDetail';
import {formatDate} from '../../../utils/format'
export const PromotionManagement = () => {
    const [isOpenCreatePromotion, setIsOpenCreatePromotion] = useState(false);
	const [isOpenUpdatePromotion, setIsOpenUpdatePromotion] = useState(false);
	const [isOpenDetailPromotion, setIsOpenDetailPromotion] = useState(false);
	const [chosenPromotionId, setChosenPromotionId] = useState('');
	const { promotions, isLoading } = useSelector((state) => state.promotions);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllPromotions());
	}, []);

	const handleDeletePromotion = async (id) => {
		const result = await dispatch(deletePromotion(id));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Xoá mã giảm giá thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
	};

	const handleGetAllPromotions = () => {
		Promise.all([dispatch(getAllPromotions())]).catch((error) => {
			console.error('Error during dispatch:', error);
		});
	};

	if (isLoading) {
		return <Spinner />;
	}
    return (
        <div className="w-full min-h-screen bg-white flex flex-row">
			<AdminSidebar />
			<div className="flex-1 px-10 pt-5">
				<Toaster>
					{(t) => (
						<ToastBar
							toast={t}
							style={{
								...t.style,
								animation: t.visible
									? 'custom-enter 1s ease'
									: 'custom-exit 1s ease',
							}}
						/>
					)}
				</Toaster>

				{isOpenCreatePromotion && (
					<CreatePromotion
						setIsOpenCreatePromotion={setIsOpenCreatePromotion}
						handleGetAllPromotions={handleGetAllPromotions}
					/>
				)}
				{isOpenUpdatePromotion && (
					<UpdatePromotion
						setIsOpenUpdatePromotion={setIsOpenUpdatePromotion}
						handleGetAllPromotions={handleGetAllPromotions}
						chosenPromotionId={chosenPromotionId}
					/>
				)}
				{isOpenDetailPromotion && (
					<PromotionDetail
						setIsOpenDetailPromotion={setIsOpenDetailPromotion}
						handleGetAllPromotions={handleGetAllPromotions}
						chosenPromotionId={chosenPromotionId}
					/>
				)}

				<div className="flex">
					<div className="flex-1 pt-2">
						<span>Hiển thị </span>
						<select
							className="rounded-md p-1 mx-1 hover:cursor-pointer"
							style={{ backgroundColor: '#E0E0E0' }}
						>
							<option>10</option>
							<option>20</option>
							<option>30</option>
						</select>
						<span> hàng</span>
					</div>
					<button
						className="bg-pink text-white py-2 rounded-md block mx-auto"
						style={{ width: '100px' }}
						onClick={() => setIsOpenCreatePromotion(true)}
					>
						<span>Thêm mã ưu đãi</span>
					</button>
				</div>
				<table className="w-full border-b border-gray mt-3">
					<thead>
						<tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
							<td className="py-2 px-1 text-center font-bold">Tên mã giảm giá</td>
							<td className="py-2 px-1 text-center font-bold">Thời gian bắt đầu</td>
							<td className="py-2 px-1 text-center font-bold">Thời gian kết thúc</td>
							<td className="py-2 px-1 text-center font-bold">Giá trị ưu đãi</td>
							<td className="py-2 px-1 text-center font-bold">Mã giảm giá</td>
							<td className="py-2 px-1 text-center font-bold">Số lượng mã</td>
                            <td className="py-2 px-1 text-center font-bold">Chi tiết</td>
                            <td className="py-2 px-1 text-center font-bold">Hành động</td>
						</tr>
					</thead>
					<tbody>
					
						{promotions?.map((promotion) => {
							
							return (
								<tr className="hover:bg-light_purple transition-colors group odd:bg-light_purple hover:cursor-pointer">
									<td className="font-medium text-center text-gray p-3">
										<span>{promotion?.promotionName}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>{formatDate(promotion?.startDate)}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>{formatDate(promotion?.endDate)}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>{promotion?.promotionValue}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>
											{promotion?.promotionCode}
										</span>
									</td>
                                   
                                    <td className="font-medium text-center text-gray">
										<span>
											{promotion?.promotionQuantity}
										</span>
									</td>
                                    
									<td className="font-medium text-center text-gray">
										<button
											className="hover:cursor-pointer text-xl pt-1.5"
											onClick={() => {
												setIsOpenDetailPromotion(true);
												setChosenPromotionId(promotion._id);
											}}
										>
											<MdOutlineRemoveRedEye className="block mx-auto" />
										</button>
									</td>
									<td className="">
										<div className="flex items-center justify-center">
											<button
												className="flex items-center justify-end py-3 pr-2 text-xl"
												onClick={() => {
													setIsOpenUpdatePromotion(true);
													setChosenPromotionId(promotion._id);
												}}
											>
												<BiEdit className="text-green" />
											</button>
											<button className="flex items-center justify-start py-3 pl-2 text-xl">
												<BiTrash
													className="text-red"
													onClick={() => handleDeletePromotion(promotion._id)}
												/>
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
    )
}