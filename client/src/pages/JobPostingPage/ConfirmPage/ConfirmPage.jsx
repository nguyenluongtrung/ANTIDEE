import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { StepBar } from '../components/StepBar/StepBar';
import './ConfirmPage.css';
import { formatDate, formatWorkingTime } from '../../../utils/format';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createJobPost } from '../../../features/jobPosts/jobPostsSlice';
import { getAccountInformation } from '../../../features/auth/authSlice';
import { Spinner } from '../../../components';
import toast from 'react-hot-toast';
import { errorStyle } from '../../../utils/toast-customize';
import { getAllServices } from '../../../features/services/serviceSlice';

export const ConfirmPage = () => {
	const { serviceId } = useParams();
	const [services, setServices] = useState([]); 
	const [isChecked, setIsChecked] = useState(false);
	const [customerId, setCustomerId] = useState();
	const location = useLocation();
	const address = location?.state?.address;
	const contactInfo = location?.state?.contactInfo;
	const workingTime = location?.state?.workingTime;
	const otherInfo = location?.state?.otherInfo;
	const inputOptions = location?.state?.inputOptions;
	const isUrgent = location?.state?.isUrgent;
	const isChosenYourself = location?.state?.isChosenYourself;
	const isChosenYourFav = location?.state?.isChosenYourFav;
	const { account, isLoading: authLoading } = useSelector((state) => state.auth);
	const { isLoading: jobPostLoading } = useSelector((state) => state.jobPosts);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	async function initiateAccountInformation() {
		let output = await dispatch(getAccountInformation());

		setCustomerId(output.payload._id);
	}

	async function initiateService() {
		let output = await dispatch(getAllServices());

		setServices(output.payload);
	}

	useEffect(() => {
		initiateAccountInformation();
		initiateService();
	}, []);

	const handleSubmitJobPost = async () => {
		const jobPostData = {
			workingTime,
			serviceId: serviceId,
			note: otherInfo?.note,
			contactInfo: {
				address: address?.houseType + ', ' + address?.street + ', ' + address?.ward + ', ' + address?.district + ', ' + address?.province,
				email: contactInfo?.email,
				phoneNumber: contactInfo?.phoneNumber,
				fullName: contactInfo?.fullName,
			},
			workload: inputOptions,
			customerId,
			paymentMethod: otherInfo?.paymentMethod,
			totalPrice: otherInfo?.totalPrice,
			isUrgent,
			isChosenYourself,
			isChosenYourFav
		}
		const result = await dispatch(createJobPost(jobPostData));

		if (result.type.endsWith('fulfilled')) {
			navigate(`/congrats`, {
				state: {
					congratsMsg: 'Chúc mừng bạn đã đăng công việc thành công',
					buttonContent: 'Quay về trang chủ',
					navigateTo: '/home'
				},
			});
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
	}

	if(authLoading || jobPostLoading){
		return <Spinner />
	}

	return (
		<div className="w-full px-20">
			<StepBar serviceId={serviceId} />

			<div
				className="confirm-form mx-auto py-7 px-16 rounded-xl border-2 mt-5 border-light_gray"
				style={{ width: '70%' }}
			>
				<p className="font-extrabold text-brown mb-3">{services?.find((service) => String(service?._id) === String(serviceId))?.name?.toUpperCase()}</p>
				<p className="custom-border-bottom pb-3 mb-3 font-semibold">
					CHI TIẾT CÔNG VIỆC
				</p>
				<table>
					<tbody>
						<tr>
							<td>
								<p className="text-gray my-3">Địa chỉ</p>
							</td>
							<td style={{ paddingLeft: '150px' }}>
								<p>
									{address?.houseType +
										', ' +
										address?.street +
										', ' +
										address?.ward +
										', ' +
										address?.district +
										', ' +
										address?.province}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Ghi chú</p>
							</td>
							<td style={{ paddingLeft: '150px' }}>
								<p>{otherInfo?.note || 'Không có'}</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Thời gian làm việc</p>
							</td>
							<td style={{ paddingLeft: '150px' }}>
								<p>{`${formatWorkingTime(
									workingTime?.startingHour
								)}, ${formatDate(workingTime?.startingDate)}`}</p>
							</td>
						</tr>
						<tr>
							<td className='w-36'>
								<p className="text-gray my-3">Khối lượng công việc</p>
							</td>
							<td style={{ paddingLeft: '150px' }}>
								{inputOptions?.map((option) => {
									return (
										<p>
											- {option?.optionName}: {option?.optionValue}
										</p>
									);
								})}
							</td>
						</tr>
					</tbody>
				</table>
				<p className="custom-border-bottom pb-3 mb-3 font-semibold">
					THÔNG TIN LIÊN HỆ
				</p>
				<table>
					<tbody>
						<tr>
							<td>
								<p className="text-gray my-3">Tên liên hệ</p>
							</td>
							<td className="pl-32">
								<p style={{paddingLeft: '5px'}}>{contactInfo?.fullName}</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Số điện thoại</p>
							</td>
							<td className="pl-32">
								<p style={{paddingLeft: '5px'}}>{contactInfo?.phoneNumber}</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Email để nhận biên nhận</p>
							</td>
							<td className="pl-32">
								<p style={{paddingLeft: '5px'}}>{contactInfo?.email}</p>
							</td>
						</tr>
					</tbody>
				</table>
				<p className="custom-border-bottom pb-3 mb-3 font-semibold">
					THANH TOÁN
				</p>
				<table>
					<tbody>
						<tr>
							<td>
								<p className="text-gray my-3">Giá tiền</p>
							</td>
							<td className="pl-32">
								<p style={{paddingLeft: '5px'}}>{otherInfo?.totalPrice} VND</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Phương thức thanh toán</p>
							</td>
							<td className="pl-32">
								<p style={{paddingLeft: '5px'}}>{otherInfo?.paymentMethod}</p>
							</td>
						</tr>
					</tbody>
				</table>

				<div className="confirm-text">
					<input
						type="checkbox"
						className="w-3"
						onChange={() => setIsChecked(!isChecked)}
					/>{' '}
					<span>Xác nhận nội dung công việc</span>
				</div>
			</div>

			<div className="flex items-center justify-center">
				<button
					className={`mt-10 w-[200px] py-3 rounded-full text-white hover:opacity-70 ${
						!isChecked ? 'bg-gray' : 'bg-green'
					}`}
					disabled={!isChecked}
					onClick={handleSubmitJobPost}
				>
					Hoàn tất
				</button>
			</div>
		</div>
	);
};
