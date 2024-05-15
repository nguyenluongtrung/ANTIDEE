import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './ServiceDetail.css';
import { useEffect, useState } from 'react';
import { getAllServices } from '../../../../features/services/serviceSlice';

export const ServiceDetail = ({ chosenServiceId, setIsOpenDetailService, handleGetAllServices }) => {
	const { services, isLoading: serviceLoading } = useSelector(
		(state) => state.services
	);
	const [chosenService, setChosenService] = useState(
		services[services.findIndex((service) => String(service._id) == String(chosenServiceId))]
	);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllServices());
	}, []);


	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form className="content rounded-md p-5" style={{ width: '35vw' }}>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => {setIsOpenDetailService(false) ; handleGetAllServices()}}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					XEM CHI TIẾT DỊCH VỤ
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td>
								<span className='font-bold'>Tên Dịch vụ</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenService?.name}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span className='font-bold'>Hình ảnh</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
                                <img className="mx-auto"
															src={chosenService?.image}
															style={{ width: '210px', height: '210px' }}
														/>
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Chứng chỉ cần có</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
									{chosenService?.requiredQualification?.name} 
								</p>
							</td>
						</tr>
                        
                        <tr>
							<td>
								<span className='font-bold'>Mô tả</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: '100%' }}>
                                {chosenService?.description} 
								</p>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</div>
	);
};
