import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './UpdatePromotion.css';
import { updatePromotion } from '../../../../features/promotions/promotionSlice';
import { useEffect, useState } from 'react';
import { getAllServices } from '../../../../features/services/serviceSlice';
import { formatDateInput } from '../../../../utils/format';
import { FaTimes } from 'react-icons/fa';

export const UpdatePromotion = ({ setIsOpenUpdatePromotion, chosenPromotionId, handleGetAllPromotions }) => {
	const { promotions, isLoading: promotionLoading } = useSelector((state) => state.promotions);
	const { services, isLoading: serviceLoading } = useSelector((state) => state.services);
    const [selectedServices, setSelectedServices] = useState([]);
	const [chosenPromotion, setChosenPromotion] = useState(
		promotions[promotions.findIndex((promotion) => promotion._id == chosenPromotionId)]
	);	
const [existingServices, setExistingServices] = useState(chosenPromotion?.serviceIds || []);
	const handleServiceDeselect = (serviceId) => {
		const updatedSelectedServices = selectedServices.filter(
			(service) => service !== serviceId
		);
		setSelectedServices(updatedSelectedServices);
	};
	
	
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllServices());
	}, []);

	const onSubmit = async (data) => {
		const promotionData = {
			...data,
			serviceIds:selectedServices,
		};
		const result = await dispatch(updatePromotion({ promotionData, id: chosenPromotionId }));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Cập nhật mã khuyến mãi thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		setIsOpenUpdatePromotion(false);
		handleGetAllPromotions();
	};

	if (promotionLoading || serviceLoading) {
		return <Spinner />;
	}

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="content rounded-md p-5"
				style={{ width: '35vw' }}
			>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => setIsOpenUpdatePromotion(false)}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					CẬP NHẬT KHUYẾN MÃI
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td><span className='font-bold'>Tên ưu đãi</span><span className="text-red"> * </span></td>
							<td>
                            <input
									type="text"
									{...register('promotionName')}
									className="create-promotion-input text-center"
                                    defaultValue={chosenPromotion?.promotionName}
                                    placeholder="Nhập tên của khuyến mãi"
									required
								/>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span className='font-bold'>Ngày bắt đầu</span><span className="text-red"> * </span>
							</td>
							<td>
								<input
									type="date"
									{...register('startDate')}
									min={new Date().toISOString().split('T')[0]}
                                    defaultValue={formatDateInput(chosenPromotion?.startDate)}
									required
								/>{' '}
                                </td>
                                </tr>
                                <tr>
                                <td>
                                <span className="font-bold">Ngày kết thúc</span><span className="text-red"> * </span>
                                </td>
								<td>
                                <input
									type="date"
									{...register('endDate')}
									min={new Date().toISOString().split('T')[0]}
                                    defaultValue={formatDateInput(chosenPromotion?.endDate)}
									required
								/>{' '}
                                </td>
                                </tr>
                               <tr>
                               <td>
                                <span className="font-bold">Mã giảm giá</span><span className="text-red"> * </span>
                                </td>
								<td>
                                <input
									type="text"
									{...register('promotionCode')}
									placeholder="Nhập mã giảm giá"
                                    defaultValue={chosenPromotion?.promotionCode}
									required
								/>
                                </td>
                               </tr>

							   <tr>
                               <td>
                                <span className="font-bold">Giá trị của mã</span><span className="text-red"> * </span>
                                </td>
								<td>
                                <input
									type="text"
									{...register('promotionValue')}
									placeholder="Nhập giá trị giảm giá"
                                    defaultValue={chosenPromotion?.promotionValue}
									required
								/>
                                </td>
                               </tr>
						<tr>
							<td>
								<span className='font-bold'>Số lượng mã</span><span className="text-red"> * </span>
							</td>
							<td className="pl-6 py-1">
                            <input
									type="number"
									{...register('promotionQuantity')}
									placeholder="Nhập số lượng mã"
                                    defaultValue={chosenPromotion?.promotionQuantity}
									required
								/>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Lựa chọn dịch vụ</span>
							</td>
							 <td className="pl-6 py-1">
							<div className="input-box">
                           
								<select
									size={6}
									{...register('serviceIds')}
									multiple
									onChange={(e) => {
										setSelectedServices([...selectedServices, e.target.value]);
									}}
								>
									{services.map((service) => {
										if (
											selectedServices.findIndex(
												(selectedId) => selectedId == service._id
											) == -1
										)
											return (
												<option key={service._id} value={service._id}>
													{service.name}
												</option>
											);
									})}
								</select>
							</div>
							</td>
							</tr>
							<tr>
							
							 <td>
								<span className='font-bold'>Các dịch vụ đã chọn:</span>
							</td>
							<td className="pl-6 py-1">
							{chosenPromotion?.serviceIds.map((service) =>
							 <li>{service?.name} {service?._id}
							 					<button
													className="w-1"
													onClick={() => removeServiceById(service?._id)}
												>
													<FaTimes />
                                                    
												</button></li> )}
												
							{selectedServices.map((selectedId) => {
										return (
											<li className='flex' key={selectedId}>
												{
													services[
														services.findIndex(
															(service) => service._id == selectedId
														)
													].name
                                                    
												}
                                                
												<button
													className="w-1"
													onClick={() => handleServiceDeselect(selectedId)}
												>
													<FaTimes />
                                                    
												</button>
                                                
											</li>
                                            
										);
                                        
									})}
								</td>  
                                
							</tr> 
					</tbody>
				</table>
				<button
					type="submit"
					className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
				>
					Cập nhật khuyến mãi
				</button>
			</form>
		</div>
	);
};
