import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { StepBar } from '../components/StepBar/StepBar';
import './ConfirmPage.css';
import { formatDate, formatWorkingTime } from '../../../utils/format';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createJobPost } from '../../../features/jobPosts/jobPostsSlice';
import {
	getAccountInformation,
	loadMoneyAfterUsingInvitationCode,
	updateAPoint,
	updateIsUsedVoucher,
} from '../../../features/auth/authSlice';
import { Spinner } from '../../../components';
import toast from 'react-hot-toast';
import { errorStyle } from '../../../utils/toast-customize';
import { getAllServices } from '../../../features/services/serviceSlice';
import { LoginPage } from '../../LoginPage/LoginPage';
import { createAccountPromotion, updatePromotionQuantity } from '../../../features/promotions/promotionSlice';

export const ConfirmPage = () => {
	const { serviceId } = useParams();
	const [services, setServices] = useState([]);
	const [isOpenLoginForm, setIsOpenLoginForm] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const location = useLocation();
	const address = location?.state?.address;
	const contactInfo = location?.state?.contactInfo;
	const workingTime = location?.state?.workingTime;
	const otherInfo = location?.state?.otherInfo;
	const inputOptions = location?.state?.inputOptions;
	const isUrgent = location?.state?.isUrgent;
	const isChosenYourself = location?.state?.isChosenYourself;
	const isChosenYourFav = location?.state?.isChosenYourFav;
	const invitationCodeOwnerId = location?.state?.invitationCodeOwnerId;
	const dueDate = location?.state?.dueDate;

	const promoId = location?.state?.promoId;
	const accountApoints = location?.state?.accountApoints;
	const isUsedPoint = location?.state?.isUsedPoint;
	const promotionId = location?.state?.promotionId;
	const promotionQuantity = location?.state?.promotionQuantity;


	const { isLoading: jobPostLoading } = useSelector((state) => state.jobPosts);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	async function initiateAccountInformation() {
		const account = JSON.parse(localStorage.getItem('account'));
		if (!account) {
			setIsOpenLoginForm(true)
		}
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
		const account = JSON.parse(localStorage.getItem('account')).data.account;

		if (
			otherInfo?.paymentMethod == 'Ví người dùng' &&
			account.accountBalance < Math.round(otherInfo?.totalPrice)
		) {
			toast.error(
				'Tài khoản của bạn không đủ số dư để đăng công việc này',
				errorStyle
			);
			return;
		}

		const jobPostData = {
			workingTime,
			serviceId: serviceId,
			note: otherInfo?.note,
			contactInfo: {
				address:
					'Đường ' +
					address?.street +
					', ' +
					address?.ward +
					', ' +
					address?.district +
					', ' +
					address?.province,
				email: contactInfo?.email,
				phoneNumber: contactInfo?.phoneNumber,
				fullName: contactInfo?.fullName,
			},
			workload: inputOptions,
			customerId: account._id,
			paymentMethod: otherInfo?.paymentMethod,
			totalPrice: otherInfo?.totalPrice,
			dueDate,
			isUrgent,
			isChosenYourself,
			isChosenYourFav,
		};

		if (invitationCodeOwnerId) {
			let ownerId = invitationCodeOwnerId;
			await dispatch(loadMoneyAfterUsingInvitationCode(ownerId));
		}
		const result = await dispatch(createJobPost(jobPostData));

		if (result.type.endsWith('fulfilled')) {
			if (promoId) {
				await dispatch(
					updateIsUsedVoucher({ accountId: account._id, voucherId: promoId, isUsed: true })
				);
			}

			await dispatch(getAccountInformation());

			navigate(`/congrats`, {
				state: {
					congratsMsg: 'Chúc mừng bạn đã đăng công việc thành công',
					buttonContent: 'Quay về trang chủ',
					navigateTo: '/home',
				},
			});

			if (promotionQuantity !== undefined) {
				const quantity = promotionQuantity - 1;
				await dispatch(updatePromotionQuantity({ promotionId, quantity }));
				await dispatch(createAccountPromotion({ accountId: account._id, promotionId, serviceId }))
			}

			let newApoints = 0;

			if (!accountApoints) {
				newApoints = account.aPoints
			} else {
				newApoints = accountApoints

			}
			const apoint = otherInfo?.totalPrice
				? Math.floor((Number(otherInfo.totalPrice) * 5) / 100)
				: 0;

			if (!isNaN(apoint)) {
				if (!isNaN(apoint)) {
					// Trường hợp apoint = 0
					if (apoint === 0) {
						await dispatch(
							updateAPoint({
								accountId: account._id,
								aPoints: accountApoints, // Không thay đổi điểm
								apoint: 0, // Không áp dụng điểm mới
								serviceId,
								operationType: "add", // Bạn có thể định nghĩa một operationType tùy chỉnh
							})
						);
					} else {
						// Thực hiện trừ điểm trước
						if (isUsedPoint && isUsedPoint > 0 && apoint > 0) {
							await dispatch(
								updateAPoint({
									accountId: account._id,
									aPoints: accountApoints - isUsedPoint, // Trừ số điểm đã áp dụng
									apoint: isUsedPoint,
									serviceId,
									operationType: "subtract",
								})
							);
						}
						// Thực hiện cộng điểm sau khi trừ điểm hoàn tất
						if (apoint > 0) {
							await dispatch(
								updateAPoint({
									accountId: account._id,
									aPoints: accountApoints + apoint, // Cộng thêm điểm mới
									apoint: apoint,
									serviceId,
									operationType: "add",
								})
							);
						}
					}
				}
			}
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
	};

	if (jobPostLoading) {
		return <Spinner />;
	}

	return (
		<div className="w-full md:px-20">
			<StepBar serviceId={serviceId} />
			{isOpenLoginForm && <LoginPage setIsOpenLoginForm={setIsOpenLoginForm} />}

			<div
				className="confirm-form mx-auto py-7 px-2 sm:px-16 md:w-[70%] rounded-xl border-2 mt-5 border-light_gray"
				// style={{ width: '70%' }}
			>
				<p className="font-extrabold text-brown mb-3">
					{services
						?.find((service) => String(service?._id) === String(serviceId))
						?.name?.toUpperCase()}
				</p>
				<p className="custom-border-bottom pb-3 mb-3 font-semibold">
					CHI TIẾT CÔNG VIỆC
				</p>
				<table>
					<tbody>
						<tr>
							<td>
								<p className="text-gray my-3">Địa chỉ</p>
							</td>
							<td className="pl-0 md:pl-[150px]">
								<p>
									{'Đường ' +
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
							<td className="pl-0 md:pl-[150px]">
								<p>{otherInfo?.note || 'Không có'}</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Thời gian làm việc</p>
							</td>
							<td className="pl-0 md:pl-[150px]">
								<p>{`${formatWorkingTime(
									workingTime?.startingHour
								)}, ${formatDate(workingTime?.startingDate)}`}</p>
							</td>
						</tr>
						<tr>
							<td className="w-36">
								<p className="text-gray my-3">Khối lượng công việc</p>
							</td>
							<td className="pl-0 md:pl-[150px]">
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
							<td className="p-5 md:pl-32">
								<p style={{ paddingLeft: '5px' }}>{contactInfo?.fullName}</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Số điện thoại</p>
							</td>
							<td className="p-5 md:pl-32">
								<p style={{ paddingLeft: '5px' }}>{contactInfo?.phoneNumber}</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Email để nhận biên nhận</p>
							</td>
							<td className="p-5 md:pl-32">
								<p style={{ paddingLeft: '5px' }}>{contactInfo?.email}</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Hạn chốt cho bài đăng</p>
							</td>
							<td className="p-5 md:pl-32">
								<p style={{ paddingLeft: '5px' }}>{formatDate(dueDate)}</p>
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
							<td className="p-5 md:pl-32">
								<p style={{ paddingLeft: '5px' }}>
									{otherInfo?.totalPrice} VND
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<p className="text-gray my-3">Phương thức thanh toán</p>
							</td>
							<td className="p-5 md:pl-32">
								<p style={{ paddingLeft: '5px' }}>{otherInfo?.paymentMethod}</p>
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
					className={`mt-10 w-[200px] mb-10 py-3 rounded-full text-white hover:opacity-70 ${!isChecked ? 'bg-gray' : 'bg-green'
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
