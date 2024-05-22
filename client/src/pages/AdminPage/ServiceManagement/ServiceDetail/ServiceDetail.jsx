import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './ServiceDetail.css';
import { useEffect, useState } from 'react';
import { getAllServices } from '../../../../features/services/serviceSlice';

export const ServiceDetail = ({
	chosenServiceId,
	setIsOpenDetailService,
	handleGetAllServices,
}) => {
	const { services, isLoading: serviceLoading } = useSelector(
		(state) => state.services
	);
	const [chosenService, setChosenService] = useState(
		services[
			services.findIndex(
				(service) => String(service._id) == String(chosenServiceId)
			)
		]
	);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllServices());
	}, []);

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form className="content rounded-md p-5" style={{ width: '50vw' }}>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => {
						setIsOpenDetailService(false);
						handleGetAllServices();
					}}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					XEM CHI TIẾT DỊCH VỤ
				</p>
				<table className="mt-3" style={{ width: '45vw' }}>
					<tbody>
						<tr>
							<td style={{ width: '5vw' }}>
								<span className="font-bold">Tên Dịch vụ</span>
							</td>
							<td className="pl-6 py-1">
								<p className="" style={{ width: '100%' }}>
									{chosenService?.name}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Chứng chỉ cần có</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="" style={{ width: '100%' }}>
									{chosenService?.requiredQualification?.name}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Các lựa chọn</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<table>
									{chosenService?.priceOptions.map((option) => {
										return (
											<tr>
												<td>
													<p>{option?.optionName}: </p>
												</td>
												<td>
													{option?.optionList.map((list, index) => {
														return (
															<span>
																{list?.optionValue ? list?.optionValue : ' (tự chọn)'}
																{option?.optionList.length - 1 !== index &&
																	', '}
															</span>
														);
													})}
												</td>
											</tr>
										);
									})}
								</table>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Công thức giá</span>
							</td>
							<td className="pl-6 py-1 w-80">
								{chosenService?.priceFormula?.map((singleFormula, index) => {
									return (
										<p className="" style={{ width: '100%' }}>
											{`Lựa chọn ${index + 1}: ${singleFormula?.formula} ${
												singleFormula?.condition &&
												`nếu ${singleFormula?.condition}`
											}`}
										</p>
									);
								})}
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Ghi chú</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="" style={{ width: '100%' }}>
									{chosenService?.note}
								</p>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</div>
	);
};
