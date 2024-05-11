import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createService } from '../../../../features/services/serviceSlice';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './CreateService.css';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getAllServices } from '../../../../features/services/serviceSlice';
import { getAllQualifications } from '../../../../features/qualifications/qualificationSlice';
export const CreateService = ({ setIsOpenCreateService, handleGetAllServices }) => {
	const { qualifications, isLoading: qualificationLoading } = useSelector((state) => state.qualifications);
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
		const examData = {
			...data,
		};
		const result = await dispatch(createService(examData));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Thêm dịch vụ thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		setIsOpenCreateService(false);
		handleGetAllServices();
	};


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
					onClick={() => setIsOpenCreateService(false)}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					TẠO DỊCH VỤ
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td>
								{' '}
								<span className='font-bold'>Tên dịch vụ</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="text"
									{...register('name')}
									className="create-question-input text-center text-sm w-80"
								/>{' '}
								
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Hình ảnh dịch vụ</span>
							</td>
							<td className="pl-6 py-1">
                            <input
									type="text"
									{...register('image')}
									className="create-question-input text-center text-sm w-80"
								/>{' '}
							</td>
						</tr>
						<tr>
							<td>
								<span className='font-bold'>Chứng chỉ cần đạt được</span>
							</td>
							<td className="pl-6 py-1">
							<select
									{...register('requiredQualification')}
									className="ml-6 py-1 create-exam-select hover:cursor-pointer text-center text-sm"
								>
                            {qualifications?.map((qualification) => (
									<option key={qualification._id} value={qualification._id}>{qualification.name}</option>
									))}
								</select>
                            
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span className='font-bold'>Giá</span>
							</td>
							<td className="pl-6 py-1">
								{/* <input
									type="number"
									{...register('numOfEasyQuestion')}
									className="create-service-input text-center"
								/> */}
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span className='font-bold'>Mô tả</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="text"
									{...register('description')}
									className="create-service-input text-center"
								/>
							</td>
						</tr>
						
					</tbody>
				</table>
				<button
					type="submit"
					className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
				>
					Tạo dịch vụ
				</button>
			</form>
		</div>
	);
};
