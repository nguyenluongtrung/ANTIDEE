import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './CreateQualification.css';
import { createQualification } from '../../../../features/qualifications/qualificationSlice';

export const CreateQualification = ({ setIsOpenCreateQualification, handleGetAllQualifications }) => {
	const { isLoading } = useSelector((state) => state.qualifications);
	
    const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const dispatch = useDispatch();

	const onSubmit = async (data) => {
		const qualificateData = {
			...data
		};
		const result = await dispatch(createQualification(qualificateData));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Thêm chứng chỉ thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		setIsOpenCreateQualification(false);
		handleGetAllQualifications();
	};

	if (isLoading) {
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
					onClick={() => setIsOpenCreateQualification(false)}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					TẠO CHỨNG CHỈ
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td>
								<span>Tên chứng chỉ</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="text"
									{...register('name')}
									className="create-exam-input text-center"
								/>
							</td>
						</tr>
                        <tr>
							<td>
								<span>Mô tả</span>
							</td>
							<td className="pl-6 py-1">
								<textarea
									type="text"
									{...register('description')}
									className="create-exam-input text-center"
								/>
							</td>
						</tr>
					</tbody>
				</table>
				<button
					type="submit"
					className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
				>
					Tạo chứng chỉ
				</button>
			</form>
		</div>
	);
};
