import {useForm} from 'react-hook-form'
import { useDispatch } from 'react-redux';
import { cancelJobPost } from '../../../../features/jobPosts/jobPostsSlice';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';

export const JobPostCancel = ({ jobPostId, setIsOpenCancelForm, myAccountId }) => {
	const {register, handleSubmit} = useForm();
	const dispatch = useDispatch();

	const onSubmit = async (data) => {
		const result = await dispatch(cancelJobPost({ isCanceled: true, reason: data.reason, account: myAccountId, jobPostId }));

		if (result.type.endsWith('fulfilled')) {
			toast.success('Hủy công việc thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
	}

	return (
		<form className="px-8 py-5" style={{ width: '600px', height: '518px' }} onSubmit={handleSubmit(onSubmit)}>
			<p className="grid text-green font-bold text-xl justify-center mb-3">
				LÍ DO HỦY VIỆC
			</p>
			<div className="grid grid-cols-2 gap-4">
				<input
					type="radio"
					id="select1"
					className="hidden"
					name="select"
					value="Bận việc đột xuất"
					{...register('reason')}
				/>
				<label
					for="select1"
					className="flex justify-center rounded-md 
                            cursor-pointer items-center h-24 shadow-2xl hover:bg-light_yellow"
				>
					Bận việc đột xuất
				</label>
				<input
					type="radio"
					id="select2"
					className="hidden"
					name="select"
					value="Đăng nhầm ngày"
					{...register('reason')}
				/>
				<label
					for="select2"
					className="flex justify-center rounded-md 
                            cursor-pointer items-center h-24 shadow-2xl  hover:bg-light_yellow"
				>
					Đăng nhầm ngày
				</label>
				<input
					type="radio"
					id="select3"
					className="hidden"
					name="select"
					value="Không cần việc này nữa"
					{...register('reason')}
				/>
				<label
					htmlFor="select3"
					className="flex justify-center rounded-md
                             cursor-pointer items-center h-24 shadow-2xl hover:bg-light_yellow"
				>
					Không cần việc này nữa
				</label>
				<textarea placeholder="Lí do khác" name="select" className="p-3 focus:outline-none" {...register('reason')}></textarea>
			</div>
			<div className="mt-5">
				<p>(*) Quý khách được hủy miễn phí trong 2 trường hợp sau:</p>
				<p className="pl-10">1. Hủy khi chưa có ai nhận việc</p>
				<p className="pl-10">2. Hủy trước giờ làm việc 2 tiếng</p>
				<p>
					Ngoài 2 trường hợp trên, chúng tôi sẽ tính phí <span className='font-bold'>30%</span> giá trị công việc.
				</p>
				<p>Độ tin cậy của bạn sẽ giảm sau mỗi lần hủy việc.</p>
				<p>Bạn chắc chắn hủy công việc này?</p>
			</div>
			<div className="flex mt-5">
				<button
					className="p-2 rounded-xl bg-yellow text-white mr-28"
					onClick={() => setIsOpenCancelForm(false)}
				>
					<span>Đóng</span>
				</button>
				<button className="p-2 rounded-xl text-white bg-brown" type='submit'>
					<span>Hủy công việc</span>
				</button>
			</div>
		</form>
	);
};
