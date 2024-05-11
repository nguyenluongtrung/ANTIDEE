/* eslint-disable react/prop-types */
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import { useEffect,useState } from 'react';
import { updateService } from '../../../../features/services/serviceSlice';
import { getAllQualifications } from '../../../../features/qualifications/qualificationSlice';
export const UpdateService = ({ setIsOpenUpdateService, chosenServiceId, handleGetAllServices }) => {
    const { services, isLoading: serviceLoading } = useSelector((state) => state.services);
    const { qualifications, isLoading: qualificationLoading } = useSelector((state) => state.qualifications);
    const [chosenService] = useState(
		services[services.findIndex((service) => service._id == chosenServiceId)]
	);
    const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
    const dispatch = useDispatch();
    const onSubmit = async (data) => {
		const serviceData = {
			...data,
		};
        
        const result = await dispatch(updateService({ serviceData, id: chosenServiceId }));
       
		if (result.type.endsWith('fulfilled')) {
			toast.success('Cập nhật dịch vụ thành công', successStyle);
            
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
        
		setIsOpenUpdateService(false);
		handleGetAllServices();
	};
    useEffect(() => {
		dispatch(getAllQualifications());
	}, []);
    return(
    <div className="popup active">
        <div className="overlay"> </div>
            <form 
            onSubmit={handleSubmit(onSubmit)}
            className="content rounded-md p-5"
            style={{ width: '40vw' }}
            >
            <AiOutlineClose
            className="absolute text-sm hover:cursor-pointer"
            onClick={() => setIsOpenUpdateService(false)}
            />
            <p className="grid text-green font-bold text-xl justify-center">
					CẬP NHẬT DỊCH VỤ
				</p>
            <table className="mt-3">
                <tbody>
                    <tr>
                        <td>
                            <span className="font-bold">Tên dịch vụ</span>
                        </td>
                        <td className="pl-[30px] py-2">
                            <input  className="create-question-input text-center ml-[60px] text-sm w-[380px]"
                            type="text" 
                            {...register('name')}
                            defaultValue={chosenService?.name}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {' '}
                            <span className='font-bold'>Ảnh dịch vụ</span>
                        </td>
                        <td className="pl-[30px] py-2">
                            <input className="create-question-input text-center ml-[60px] text-sm w-[380px]" type="text" 
                            {...register('image')}
                            defaultValue={chosenService?.image}
                            />{' '}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {' '}
                            <span className="font-bold">Chứng chỉ </span>
                        </td>
                        <td className="pl-[30px] py-2">
                            <select
									{...register('requiredQualification')}
									className="create-question-input text-center ml-[60px] text-sm w-[380px]"
									defaultValue={chosenService?.requiredQualification?._id}
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
                            <span className="font-bold">Giá</span>
                        </td>
                        <td className="pl-[30px] py-2">
                            
                        {/* <input type="text"
                            {...register('description')}
                            defaultValue={chosenService?.description}
                            />{' '} */}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {' '}
                            <span className="font-bold">Mô tả</span>
                        </td>
                        <td className='pl-[30px] py-2'>
                        <input type="text"
                            {...register('description')}
                            className="create-question-input text-center ml-[60px] text-sm w-[380px]"
                            defaultValue={chosenService?.description}
                            />{' '}
                        </td>
                    </tr>
                </tbody>
            </table>
            <button
					type="submit"
					className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
				>
					Cập nhật dịch vụ
				</button>
                </form>
        </div>
        
   
);

};