import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import './UpdateExam.css';
import { getExam, updateExam } from '../../../../features/exams/examSlice';
import { useEffect, useState } from 'react';
import { getAllQualifications } from '../../../../features/qualifications/qualificationSlice';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';

export const UpdateExam = () => {
	const [chosenExam, setChosenExam] = useState();
	const navigate = useNavigate();
	const params = useParams();
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

	useEffect(() => {
		const fetchExam = async () => {
			const response = await dispatch(getExam(params.examId));
			setChosenExam(response.payload);
		};
		fetchExam();
	}, []);

	const onSubmit = async (data) => {
		const examData = {
			...data,
			numOfQuestions:
				Number(data.numOfHardQuestion) +
				Number(data.numOfMediumQuestion) +
				Number(data.numOfEasyQuestion),
		};
		const result = await dispatch(updateExam({ examData, id: chosenExam._id }));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Cập nhật bài kiểm tra thành công', successStyle);
			navigate('/admin-exam')
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
	};

	if (examLoading || qualificationLoading) {
		return <Spinner />;
	}

	if (chosenExam) {
		return (
			<div className="w-full min-h-screen bg-white flex flex-row">
				<AdminSidebar />
				<div className="w-full p-10">
					<div className="flex mb-10 text-2xl font-bold">
						Đang <p className="text-primary text-2xl px-2">Cập nhật</p> bài thi{' '}
					</div>
					<form onSubmit={handleSubmit(onSubmit)} className="content">
						<div className="flex gap-2 mb-5">
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Nhập tên</div>
								<input
									type="text"
									{...register('name')}
									defaultValue={chosenExam?.name}
									className="shadow appearance-none border py-3 px-3 rounded"
								/>
							</div>
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Chứng chỉ</div>
								<select
									{...register('qualificationId')}
									className="shadow  border py-3 px-3 rounded"
									defaultValue={chosenExam?.qualificationId._id}
								>
									{qualifications?.map((qualification) => (
										<option value={qualification._id}>
											{qualification.name}
										</option>
									))}
								</select>
							</div>
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Điểm cần đạt</div>
								<input
									type="number"
									{...register('passGrade')}
									defaultValue={chosenExam?.passGrade}
									className="shadow appearance-none border py-3 px-3 rounded"
								/>
							</div>
						</div>
						<div className="flex gap-2 mb-5">
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Số lượng câu dễ</div>
								<input
									type="number"
									{...register('numOfEasyQuestion')}
									defaultValue={
										chosenExam?.questions.easyQuestion.numOfEasyQuestion
									}
									className="shadow appearance-none border py-3 px-3 rounded"
								/>
							</div>
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Số lượng câu bình thường</div>
								<input
									type="number"
									{...register('numOfMediumQuestion')}
									defaultValue={
										chosenExam?.questions.mediumQuestion.numOfMediumQuestion
									}
									className="shadow appearance-none border py-3 px-3 rounded"
								/>
							</div>
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Số lượng câu khó</div>
								<input
									type="number"
									{...register('numOfHardQuestion')}
									defaultValue={
										chosenExam?.questions.hardQuestion.numOfHardQuestion
									}
									className="shadow appearance-none border py-3 px-3 rounded"
								/>
							</div>
						</div>
						<div className="flex gap-2 mb-2">
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Danh mục</div>
								<div>
									<input
										type="radio"
										{...register('category')}
										defaultChecked={chosenExam.category == 'Kiểm tra đầu vào' ? true : false}
										value={'Kiểm tra đầu vào'}
										className="w-5"
									/>{' '}
									<span className="mr-3">Kiểm tra đầu vào</span>
									<input
										type="radio"
										{...register('category')}
										defaultChecked={chosenExam.category == 'Kiểm tra training' ? true : false}
										value={'Kiểm tra training'}
										className="w-5"
									/>{' '}
									<span>Kiểm tra training</span>
								</div>
							</div>
						</div>
						<button
							type="submit"
							className="block w-[200px] bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-5"
						>
							Cập nhật bài thi
						</button>
					</form>
				</div>
			</div>
		);
	}
};
