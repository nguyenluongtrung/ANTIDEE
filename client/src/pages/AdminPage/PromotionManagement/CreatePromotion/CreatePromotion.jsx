import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createPromotion } from '../../../../features/promotions/promotionSlice';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './CreatePromotion.css';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getAllServices } from '../../../../features/services/serviceSlice';

export const CreatePromotion = ({ setIsOpenCreatePromotion, handleGetAllPromotions }) => {
	const { isLoading: promotionLoading } = useSelector((state) => state.promotions);
    const [selectedServices, setSelectedServices] = useState([]);
	const { services, isLoading: serviceLoading } = useSelector((state) => state.services);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllServices());
	}, []);
    const handleServiceDeselect = (serviceId) => {
		const updatedSelectedServices = selectedServices.filter(
			(service) => service !== serviceId
		);
		setSelectedServices(updatedSelectedServices);
	};
	const onSubmit = async (data) => {
		console.log(data);
		const promotionData = {
			...data,
		serviceIds:selectedServices,
		};
		const result = await dispatch(createPromotion(promotionData));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Thêm mã giảm giá thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		setIsOpenCreatePromotion(false);
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
					onClick={() => setIsOpenCreatePromotion(false)}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					TẠO MÃ GIẢM GIÁ
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td><span className='font-bold'>Tên ưu đãi</span><span className="text-red"> * </span></td>
							<td>
                            <input
									type="text"
									{...register('promotionName')}
									className="create-question-input text-center ml-[60px] text-sm w-[300px]"
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
									required
									className='create-question-input text-center ml-[60px] text-sm w-[300px]'
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
									required
									className='create-question-input text-center ml-[60px] text-sm w-[300px]'
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
									required
									className='create-question-input text-center ml-[60px] text-sm w-[300px]'
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
									{...register('promotionValue', { required: 'Giá trị mã là bắt buộc', min: { value: 0, message: 'Giá trị mã phải lớn hơn 0' }, max: { value: 1, message: 'Giá trị mã phải nhỏ hơn hoặc bằng 1' } })}
                                    placeholder="Nhập giá trị giảm giá"
                                    className={`create-question-input text-center ml-[60px] text-sm w-[300px] ${errors.promotionValue ? 'border-red' : ''}`}
                                />
								
                                {errors.promotionValue && <p className="text-red text-center">{errors.promotionValue.message}</p>}
                                </td>
                               </tr>
						<tr>
							<td>
								<span className='font-bold'>Số lượng mã</span><span className="text-red"> * </span>
							</td>
							<td className="">
                            <input
									type="number"
									{...register('promotionQuantity', { required: 'Số lượng mã là bắt buộc', min: { value: 1, message: 'Số lượng mã phải lớn hơn 0' }, pattern: { value: /^[1-9]\d*$/, message: 'Số lượng mã phải là số nguyên dương' } })}
                                    placeholder="Nhập số lượng mã"
                                    className={`create-question-input text-center ml-[60px] text-sm w-[300px] ${errors.promotionQuantity ? 'border-red' : ''}`}
                                />
                                {errors.promotionQuantity && <p className="text-red text-center">{errors.promotionQuantity.message}</p>}
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Lựa chọn dịch vụ</span>
							</td>
							 <td className="">
							<div className="input-box">
                           
								<select
									size={6}
									{...register('serviceIds')}
									multiple
									onChange={(e) => {
										setSelectedServices([...selectedServices, e.target.value]);
									}}
									className='create-question-input text-center ml-[60px] text-sm w-[300px]'
								>
									{services?.map((service) => {
										if (
											selectedServices?.findIndex(
												(selectedId) => selectedId == service?._id
											) == -1
										)
											return (
												<option key={service?._id} value={service?._id}>
													{service?.name}
												</option>
											);
									})}
								</select>
							</div>
							</td>
							</tr>
							<tr>
							
							 <td>
								<span className='font-bold'>Đã chọn:</span>
							</td>
							<td className="pl-6 py-1 ">
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
					Tạo mã giảm giá
				</button>
			</form>
		</div>
	);
};
