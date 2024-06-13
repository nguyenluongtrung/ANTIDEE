import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import { createAppFeedback } from '../../../features/appFeedbacks/appFeedbackSlice';
import { rules } from '../../../utils/rules';

export const CreateAppFeedback = ({setIsOpenCreateAppFeedback}) => {
	
    const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const dispatch = useDispatch();

	const onSubmit = async (data) => {
		console.log(data)
		const appFeedbackData = {
			...data
		};

		const {name, phoneNumber, email, description} = data;
		if (!name.trim()) {
			toast.error('Vui lòng nhập tên', errorStyle);
			return;
		}
        
        if (!phoneNumber.trim()) {
			toast.error('Vui lòng nhập số điện thoại', errorStyle);
			return;
		} 

        if (!email.trim()) {
			toast.error('Vui lòng nhập email', errorStyle);
			return;
		} 

		if (!description.trim()) {
			toast.error('Vui lòng nhập ý kiến của bạn', errorStyle);
			return;
		}


		const result = await dispatch(createAppFeedback(appFeedbackData));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Gửi ý kiến phản hồi thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		setIsOpenCreateAppFeedback(false);
	};




	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="content rounded-md p-5"
				style={{ width: '40vw' }}
			>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => setIsOpenCreateAppFeedback(false)}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					Ý kiến của bạn về website
				</p>
				
					<div>
						<div className='p-1'>
								<label>Tên của bạn</label>
							
								<input
									type="text"
									{...register('name', rules.name)}
									className={`bg-light_gray h-10 rounded-md text-center focus:outline-none ${errors.name && 'border-red'}`}
								/>
								</div>
							<div className='flex'>
								<div className='p-1'>
								<label>Số điện thoại</label>
							
								<input
									type="text"
									{...register('phoneNumber', rules.phoneNumber)}
									className={`bg-light_gray h-10 rounded-md text-center focus:outline-none ${errors.phoneNumber && 'border-red'}`}
								/>
						</div>
						<div className='p-1'>
								<label>Email</label>
							
								<input
									type="text"
									{...register('email', rules.email)}
									className={`bg-light_gray h-10 rounded-md text-center focus:outline-none ${errors.email && 'border-red'}`}
								/>
								</div>
						</div>
						<div className='p-1'>
								<label>Ý kiến</label>
							<br />
								<textarea
									type="text"
									{...register('description', rules.description)} 
									className={`bg-light_gray rounded-md p-1 focus:outline-none ${errors.description && 'border-red'}`}
									rows="4" cols="60"
								/>
							</div>
						
					
				<button
					type="submit"
					className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
				>
					Gửi ý kiến
				</button>
				</div>
			</form>
			
		</div>
	);
};
