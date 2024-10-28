import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createExam } from '../../../../features/exams/examSlice';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import './CreateExam.css';
import { useEffect } from 'react';
import { getAllQualifications } from '../../../../features/qualifications/qualificationSlice';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';

export const CreateExam = () => {
	const { isLoading: examLoading } = useSelector((state) => state.exams);
	const { qualifications, isLoading: qualificationLoading } = useSelector(
		(state) => state.qualifications
	);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllQualifications());
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
	};

	if (examLoading || qualificationLoading) {
		return <Spinner />;
	}

	return (
		<div className="w-full min-h-screen bg-white flex flex-row">
			<AdminSidebar />
			<div className="w-full p-10">
				<div className="flex mb-10 text-2xl font-bold">
					Đang <p className="text-primary text-2xl px-2">Tạo mới</p> bài thi{' '}
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="content">
					<div className="flex gap-2 mb-5">
						<div className="flex flex-col w-full col-span-1 lg:col-span-8">
							<div className="text-gray mb-2">Nhập tên đề thi</div>
							<input
								type="text"
								{...register('name')}
								className="shadow appearance-none border py-3 px-3 rounded"
							/>
						</div>
						<div className="flex flex-col w-full col-span-1 lg:col-span-8">
							<div className="text-gray mb-2">Thời gian</div>
							<input
								type="number"
								{...register('duration')}
								className="shadow appearance-none border py-3 px-3 rounded"
							/>
						</div>
						<div className="flex flex-col w-full col-span-1 lg:col-span-8">
							<div className="text-gray mb-2">Điểm cần đạt</div>
							<input
								type="number"
								{...register('passGrade')}
								className="shadow appearance-none border py-3 px-3 rounded"
							/>
						</div>
					</div>
					<div className="flex gap-2 mb-2">
						<div className="flex flex-col w-full col-span-1 lg:col-span-8">
							<div className="text-gray mb-2">Số lượng câu dễ</div>
							<input
								type="number"
								{...register('numOfEasyQuestion')}
								className="shadow appearance-none border py-3 px-3 rounded"
							/>
						</div>
						<div className="flex flex-col w-full col-span-1 lg:col-span-8">
							<div className="text-gray mb-2">Số lượng câu bình thường</div>
							<input
								type="number"
								{...register('numOfMediumQuestion')}
								className="shadow appearance-none border py-3 px-3 rounded"
							/>
						</div>
						<div className="flex flex-col w-full col-span-1 lg:col-span-8">
							<div className="text-gray mb-2">Số lượng câu khó</div>
							<input
								type="number"
								{...register('numOfHardQuestion')}
								className="shadow appearance-none border py-3 px-3 rounded"
							/>
						</div>
					</div>
					<div className="flex gap-7 mb-2">
						<div className="w-full col-span-1 lg:col-span-4">
							<div className="text-gray mb-2">Chứng chỉ</div>
							<select
								{...register('qualificationId')}
								className="shadow  border py-3 px-3 rounded"
								style={{ width: '100%' }}
							>
								{qualifications?.map((qualification) => (
									<option value={qualification._id}>
										{qualification.name}
									</option>
								))}
							</select>
						</div>
						<div className="w-full col-span-1 lg:col-span-4">
							<div className="text-gray mb-2">Danh mục</div>
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
						</div>
					</div>
					<button
						type="submit"
						className="block w-[200px] bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-5"
					>
						Tạo bài thi
					</button>
				</form>
			</div>
		</div>
	);
};
