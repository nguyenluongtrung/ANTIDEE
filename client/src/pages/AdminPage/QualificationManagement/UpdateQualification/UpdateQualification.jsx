import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './UpdateQualification.css';
import { useState } from 'react';
import { updateQualification } from '../../../../features/qualifications/qualificationSlice';

export const UpdateQualification = ({ setIsOpenUpdateQualification, handleGetAllQualifications, chosenQualificationId }) => {
	const { qualifications, isLoading } = useSelector((state) => state.qualifications);
	const [chosenQualification, setChosenQualification] = useState(
		 qualifications[qualifications.findIndex((qualification) => qualification._id == chosenQualificationId)]
	);

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
		const result = await dispatch(updateQualification({qualificationData:qualificateData, id:chosenQualificationId}));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Cập nhật chứng chỉ thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		setIsOpenUpdateQualification(false);
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
					onClick={() => setIsOpenUpdateQualification(false)}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					CẬP NHẬT CHỨNG CHỈ
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
                                    defaultValue={chosenQualification?.name}
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
                                    defaultValue={chosenQualification?.description}
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
					Cập nhật chứng chỉ
				</button>
			</form>
		</div>
	);
};
