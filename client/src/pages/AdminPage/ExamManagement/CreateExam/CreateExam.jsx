import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createExam } from '../../../../features/exams/examSlice';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './CreateExam.css';
import { useEffect } from 'react';
import { getAllServices } from '../../../../features/services/serviceSlice';

export const CreateExam = ({ setIsOpenCreateExam, handleGetAllExams }) => {
	const { isLoading: examLoading } = useSelector((state) => state.exams);
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

	const onSubmit = async (data) => {
		const examData = {
			...data,
			numOfQuestions:
				Number(data.numOfHardQuestion) +
				Number(data.numOfMediumQuestion) +
				Number(data.numOfEasyQuestion),
		};
		const result = await dispatch(createExam(examData));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Thêm bài kiểm tra thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		setIsOpenCreateExam(false);
		handleGetAllExams();
	};

	if (examLoading || serviceLoading) {
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
					onClick={() => setIsOpenCreateExam(false)}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					TẠO ĐỀ THI
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td><span>Dịch vụ</span></td>
							<td>
								<select {...register('serviceId')} className="ml-6 py-1 create-exam-select hover:cursor-pointer text-center text-sm">
									{services?.map((service) => <option value={service._id}>{service.name}</option>)}
								</select>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span>Danh mục</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="radio"
									{...register('category')}
									defaultValue={'Kiểm tra đầu vào'}
									value={'Kiểm tra đầu vào'}
									className="w-5"
								/>{' '}
								<span className="mr-3">Kiểm tra đầu vào</span>
								<input
									type="radio"
									{...register('category')}
									value={'Kiểm tra training'}
									className="w-5"
								/>{' '}
								<span>Kiểm tra training</span>
							</td>
						</tr>
						<tr>
							<td>
								<span>Thời gian</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="number"
									{...register('duration')}
									className="create-exam-input text-center"
								/>
							</td>
						</tr>
						<tr>
							<td>
								<span>Điểm cần đạt</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="number"
									{...register('passGrade')}
									className="create-exam-input text-center"
								/>
							</td>
						</tr>
						<tr>
							<td>
								{' '}
								<span>Số lượng câu dễ</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="number"
									{...register('numOfEasyQuestion')}
									className="create-exam-input text-center"
								/>
							</td>
						</tr>
						<tr>
							<td>
								<span>Số lượng câu bình thường</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="number"
									{...register('numOfMediumQuestion')}
									className="create-exam-input text-center"
								/>
							</td>
						</tr>
						<tr>
							<td>
								<span>Số lượng câu khó</span>
							</td>
							<td className="pl-6 py-1">
								<input
									type="number"
									{...register('numOfHardQuestion')}
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
					Tạo bài thi
				</button>
			</form>
		</div>
	);
};
