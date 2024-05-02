import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createExam } from '../../../../features/exams/examSlice';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';

export const CreateExam = () => {
    const { isLoading } = useSelector((state) => state.exams);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const dispatch = useDispatch();

    const onSubmit = async (data) => {
        const examData = {...data, numOfQuestions: Number(data.numOfHardQuestion) + Number(data.numOfMediumQuestion) + Number(data.numOfEasyQuestion)};
        const result = await dispatch(createExam(examData));
        if (result.type.endsWith('fulfilled')) {
			toast.success('Thêm bài kiểm tra thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
    }

    if(isLoading){
        return <Spinner />
    }

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input type="number" {...register('duration')} placeholder="duration" />
				<select {...register('category')}>
					<option defaultValue={'Kiểm tra đầu vào'} value={'Kiểm tra đầu vào'}>Kiểm tra đầu vào</option>
					<option value={'Kiểm tra training'}>Kiểm tra training</option>
				</select>
				<input
					type="number"
					{...register('passGrade')}
					placeholder="passGrade"
				/>
				<input
					type="number"
					{...register('numOfEasyQuestion')}
					placeholder="numOfEasyQuestion"
				/>
				<input
					type="number"
					{...register('numOfMediumQuestion')}
					placeholder="numOfMediumQuestion"
				/>
				<input
					type="number"
					{...register('numOfHardQuestion')}
					placeholder="numOfHardQuestion"
				/>
                <button type='submit'>Submit</button>
			</form>
		</div>
	);
};
