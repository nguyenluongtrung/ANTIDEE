import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import './ServiceManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import {
	deleteService,
	getAllServices,
} from '../../../features/services/serviceSlice';
import { Spinner } from '../../../components';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { UpdateService } from './UpdateService/UpdateService';
import { ServiceDetail } from './ServiceDetail/ServiceDetail';
import { CreateService } from './CreateService/CreateService';
import { IoAddOutline } from 'react-icons/io5';
export const ServiceManagement = () => {
	const [isOpenCreateService, setIsOpenCreateService] = useState(false);
	const [isOpenUpdateService, setIsOpenUpdateService] = useState(false);
	const [isOpenDetailService, setIsOpenDetailService] = useState(false);
	const [chosenServiceId, setChosenServiceId] = useState('');
	const { services, isLoading } = useSelector((state) => state.services);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllServices());
	}, []);

	const handleDeleteService = async (id) => {
		const result = await dispatch(deleteService(id));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Xoá dịch vụ thành công', successStyle);
			dispatch(getAllServices());
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
	};

	const handleGetAllServices = () => {
		Promise.all([dispatch(getAllServices())]).catch((error) => {
			console.error('Error during dispatch:', error);
		});
	};

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

				{isOpenCreateService && (
					<CreateService
						setIsOpenCreateService={setIsOpenCreateService}
						handleGetAllServices={handleGetAllServices}
					/>
				)}
				{isOpenUpdateService && (
					<UpdateService
						setIsOpenUpdateService={setIsOpenUpdateService}
						handleGetAllServices={handleGetAllServices}
						chosenServiceId={chosenServiceId}
					/>
				)}
				{isOpenDetailService && (
					<ServiceDetail
						setIsOpenDetailService={setIsOpenDetailService}
						handleGetAllServices={handleGetAllServices}
						chosenServiceId={chosenServiceId}
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
						className="bg-pink text-white rounded-md block mx-auto"
						style={{ width: '150px' }}
						onClick={() => setIsOpenCreateService(true)}
					>
						<div className="flex items-center">
							<IoAddOutline className="size-8 pl-2 mr-2" />
							<span className="text-sm pr-2">Thêm dịch vụ</span>
						</div>
					</button>
				</div>
				<table className="w-full border-b border-gray mt-3">
					<thead>
						<tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
							<td className="py-2 px-4 text-center font-bold">STT</td>
							<td className="py-2 px-4 text-center font-bold">Tên</td>
							<td className="py-2 px-4 text-center font-bold">Hình ảnh</td>
							<td className="py-2 px-4 text-center font-bold">
								Chứng chỉ cần có
							</td>
							<td className="py-2 px-4 text-center font-bold">Chi tiết</td>
							<td className="py-2 px-4 text-center font-bold">Hành động</td>
						</tr>
					</thead>
					<tbody>
						{services?.map((services, index) => {
							return (
								<tr className="hover:bg-light_purple transition-colors group odd:bg-light_purple hover:cursor-pointer">
									<td className="font-medium text-center text-gray p-3">
										<span>{index + 1}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>{services?.name}</span>
									</td>
									<td className="font-medium mx-auto text-gray">
										<img
											className="mx-auto"
											src={services?.image}
											style={{ width: '40px', height: '40px'  }}
										/>
									</td>
									<td className="font-medium text-center text-gray">
										<span>{services?.requiredQualification?.name}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<button
											className="hover:cursor-pointer text-xl pt-1.5"
											onClick={() => {
												setIsOpenDetailService(true);
												setChosenServiceId(services._id);
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
													setIsOpenUpdateService(true);
													setChosenServiceId(services._id);
												}}
											>
												<BiEdit className="text-green" />
											</button>
											<button className="flex items-center justify-start py-3 pl-2 text-xl">
												<BiTrash
													className="text-red"
													onClick={() => handleDeleteService(services._id)}
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
	);
};
