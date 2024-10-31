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
import { calculateTotalPages, getPageItems, nextPage, previousPage } from '../../../utils/pagination';
import Pagination from '../../../components/Pagination/Pagination';
import DeletePopup from '../../../components/DeletePopup/DeletePopup';
export const ServiceManagement = () => {
	const [isOpenCreateService, setIsOpenCreateService] = useState(false);
	const [isOpenUpdateService, setIsOpenUpdateService] = useState(false);
	const [isOpenDetailService, setIsOpenDetailService] = useState(false);
	const [chosenServiceId, setChosenServiceId] = useState('');
	const [services, setServices] = useState([])
	const dispatch = useDispatch();

	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
	const [selectedIdDelete, setSelectedIdDelete] = useState('');
	async function initiateServices() {
		let output = await dispatch(getAllServices());
		setServices(output.payload);
	}

	useEffect(() => {
		initiateServices();
	}, []);

	useEffect(() => {
		dispatch(getAllServices());
	}, []);

	const openDeletePopup = (serviceId) => {
		setSelectedIdDelete(serviceId);
		setIsDeletePopupOpen(true);
	};

	const closeDeletePopup = () => {
		setIsDeletePopupOpen(false);
		setSelectedIdDelete('');
	};

	const handleDeleteService = async () => {
		const result = await dispatch(deleteService(selectedIdDelete));
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

	const handleRowsPerPageChange = (e) => {
		setRowsPerPage(Number(e.target.value));
		setCurrentPage(1);
	};


	const totalPages = calculateTotalPages(services.length, rowsPerPage);
	const selectedServices = getPageItems(services, currentPage, rowsPerPage);

	const handleNextPage = () => {
		setCurrentPage(nextPage(currentPage, totalPages));
	};

	const handlePreviousPage = () => {
		setCurrentPage(previousPage(currentPage));
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

				<DeletePopup
					open={isDeletePopupOpen}
					onClose={closeDeletePopup}
					deleteAction={handleDeleteService}
					itemName="dịch vụ"
				/>

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
							value={rowsPerPage}
							onChange={handleRowsPerPageChange}
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
						{selectedServices?.map((services, index) => {
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
											style={{ width: '40px', height: '40px' }}
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
													onClick={() => openDeletePopup(services._id)}
												/>
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				<div className="flex items-center justify-between border-t border-gray bg-white px-4 py-3 sm:px-6">
					<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
						<div>
							<p className="text-sm text-gray">
								Hiển thị <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> đến{' '}
								<span className="font-medium">
									{Math.min(currentPage * rowsPerPage, services.length)}
								</span>{' '}
								trong <span className="font-medium">{services.length}</span> kết quả
							</p>
						</div>
						<div>
							<Pagination totalPages={totalPages}
								currentPage={currentPage}
								onPageChange={(page) => setCurrentPage(page)}
								onNextPage={handleNextPage}
								onPreviousPage={handlePreviousPage}
								rowsPerPage={rowsPerPage} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};