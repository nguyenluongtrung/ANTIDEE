import { Link } from 'react-router-dom';
import './MyAccount.css';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoIosArrowForward } from 'react-icons/io';
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../firebase';
import { useForm } from 'react-hook-form';
import {
	getAccountInformation,
	updateAccountInformation,
} from '../../features/auth/authSlice';
import { Spinner } from './../../components';
import { rules } from '../../utils/rules';
import { formatDate, formatDateInput } from '../../utils/format';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../utils/toast-customize';

export const MyAccount = () => {
	const fileRef = useRef(null);
	const { account, isLoading } = useSelector((state) => state.auth);
	const [file, setFile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState('');
	const [isUpdateAccountInformation, setIsUpdateAccountInformation] =
		useState(false);

	const dispatch = useDispatch();

	const maxDate = new Date();
	maxDate.setFullYear(maxDate.getFullYear() - 18);
	const maxDateString = maxDate.toISOString().split('T')[0];

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
	}, [file]);

	async function initiateAccountInformation() {
		let output = await dispatch(getAccountInformation());

		setAvatarUrl(output.payload.avatar);
	}

	useEffect(() => {
		initiateAccountInformation();
	}, []);

	const handleClickPencilIcon = () => {
		setIsUpdateAccountInformation(true);
	};

	const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, `avatars/${fileName}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePerc(Math.round(progress));
			},
			(error) => {
				setFileUploadError(true);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
					setAvatarUrl(downloadURL)
				);
			}
		);
	};

	const onSubmit = async (data) => {
		setIsUpdateAccountInformation(false);
		const account =
			avatarUrl !== '' ? { ...data, avatar: avatarUrl } : { ...data };
		const result = await dispatch(updateAccountInformation(account));

		if (result.type.endsWith('fulfilled')) {
			toast.success('Cập nhật thông tin tài khoản thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		await dispatch(getAccountInformation());
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<div className="flex px-16">
			<div className="left-container pr-24 pt-3">
				<div className="flex mb-4">
					<img
						src={`${account?.avatar}` || 'src/assets/img/Ellipse 16.png'}
						className="block w-12 mr-2 rounded-full"
					/>
					<div className="mt-2">
						<p className="font-bold">{account?.name}</p>
						<Link to={''}>
							<p className="text-primary">
								Xem hồ sơ <IoIosArrowForward className="inline" />
							</p>
						</Link>
					</div>
				</div>
				<div className="mb-2.5 hover:text-primary hover:cursor-pointer">
					<img
						src="src/assets/img/clarity_avatar-solid.png"
						className="inline w-4 mr-2"
					/>
					<span>Tài khoản của tôi</span>
				</div>
				<div className="mb-2.5 hover:text-primary hover:cursor-pointer">
					<img
						src="src/assets/img/mingcute_card-pay-fill.png"
						className="inline w-4 mr-2"
					/>
					<span>aPay</span>
				</div>
				<div className="mb-2.5 hover:text-primary hover:cursor-pointer">
					<img
						src="src/assets/img/mdi_voucher.png"
						className="inline w-4 mr-2"
					/>
					<span>Kho Voucher</span>
				</div>
				<div className="mb-2.5 hover:text-primary hover:cursor-pointer">
					<img src="src/assets/img/mdi_heart.png" className="inline w-4 mr-2" />
					<span>Tasker yêu thích</span>
				</div>
				<div className="mb-2.5 hover:text-primary hover:cursor-pointer">
					<img
						src="src/assets/img/lucide_list-x.png"
						className="inline w-4 mr-2"
					/>
					<span>Danh sách chặn</span>
				</div>
				<div className="mb-2.5 hover:text-primary hover:cursor-pointer">
					<img src="src/assets/img/mdi_gift.png" className="inline w-4 mr-2" />
					<span>Săn quà giới thiệu</span>
				</div>
				<div className="mb-2.5 hover:text-primary hover:cursor-pointer">
					<img
						src="src/assets/img/material-symbols_help.png"
						className="inline w-4 mr-2"
					/>
					<span>Trợ giúp</span>
				</div>
				<div className="mb-2.5 hover:text-primary hover:cursor-pointer">
					<img
						src="src/assets/img/vaadin_piggy-bank-coin.png"
						className="inline w-4 mr-2"
					/>
					<span>Điểm tích lũy</span>
				</div>
				<div className="mb-2.5 hover:text-primary hover:cursor-pointer">
					<img
						src="src/assets/img/ic_sharp-settings.png"
						className="inline w-4 mr-2"
					/>
					<span>Cài đặt</span>
				</div>
			</div>
			<div className="right-container rounded-xl p-5 relative">
				<img
					src="src/assets/img/material-symbols_edit-outline.png"
					className="w-6 absolute top-5 right-5 hover:cursor-pointer"
					onClick={handleClickPencilIcon}
				/>
				<h5 className="font-bold">Hồ sơ của tôi</h5>
				<p className="mb-2 bottom-horizontal pb-3">
					Quản lí hồ sơ tài khoản của bạn
				</p>
				<div className="flex">
					<div className="pl-5 customized-width">
						<form onSubmit={handleSubmit(onSubmit)}>
							<table className="">
								<thead></thead>
								<tbody>
									<tr>
										<td className="py-1.5">
											<span className="text-gray">Họ và tên</span>
										</td>
										<td>
											{isUpdateAccountInformation ? (
												<input
													type="text"
													className="update-input ml-10 w-40"
													{...register('name')}
													defaultValue={account?.name}
												/>
											) : (
												<span className="pl-10">{account?.name}</span>
											)}
										</td>
									</tr>
									<tr>
										<td className="py-1.5">
											<span className="text-gray">Email</span>
										</td>
										<td>
											{isUpdateAccountInformation ? (
												<input
													type="text"
													className={`update-input ml-10 w-40 ${
														errors.email && 'text-red'
													}`}
													{...register('email', rules.email)}
													defaultValue={account?.email}
												/>
											) : (
												<span className="pl-10">{account?.email}</span>
											)}
										</td>
									</tr>
									<tr>
										<td className="py-1.5">
											<span className="text-gray">Số điện thoại</span>
										</td>
										<td>
											{isUpdateAccountInformation ? (
												<input
													type="text"
													className={`update-input ml-10 w-40 ${
														errors.phoneNumber && 'text-red'
													}`}
													{...register('phoneNumber', rules.phoneNumber)}
													defaultValue={account?.phoneNumber}
												/>
											) : (
												<span className="pl-10">{account?.phoneNumber}</span>
											)}
										</td>
									</tr>
									<tr>
										<td className="py-1.5">
											<span className="text-gray">Giới tính</span>
										</td>
										<td>
											{isUpdateAccountInformation ? (
												<div className="flex">
													<input
														type="radio"
														className="block update-input ml-10 mr-2 w-3"
														value={'Nam'}
														{...register('gender')}
														defaultChecked={account?.gender === 'Nam'}
													/>{' '}
													<span className="mr-2">Nam</span>
													<input
														type="radio"
														className="block update-input mr-2 w-3"
														value={'Nữ'}
														{...register('gender')}
														defaultChecked={account?.gender === 'Nữ'}
													/>{' '}
													<span className="mr-2">Nữ</span>
													<input
														type="radio"
														className="block update-input mr-2 w-3"
														value={'Khác'}
														{...register('gender')}
														defaultChecked={account?.gender === 'Khác'}
													/>{' '}
													<span className="mr-2">Khác</span>
												</div>
											) : (
												<span className="pl-10">{account?.gender}</span>
											)}
										</td>
									</tr>
									<tr>
										<td className="py-1.5">
											<span className="text-gray">aPoints</span>
											<span className="right-vertical px-10">
												{account?.aPoints} điểm
											</span>
										</td>
										<td>
											<span className="text-gray px-10">Ngày sinh</span>
											{isUpdateAccountInformation ? (
												<input
													type="date"
													className="update-input w-28"
													{...register('dob')}
													max={maxDateString}
													min={new Date(1900, 0, 1).toISOString().split('T')[0]}
													defaultValue={formatDateInput(account?.dob)}
												/>
											) : (
												<span className="">{account?.dob ? formatDate(account?.dob) : 'Chưa cập nhật'}</span>
											)}
										</td>
									</tr>
									<tr>
										<td className="py-1.5">
											<span className="text-gray">Hạng khách hàng</span>
										</td>
										<td>
											<span className="pl-10">
												{account?.accountLevel?.customerLevel?.name}
											</span>
										</td>
									</tr>
									<tr>
										<td className="py-1.5">
											<span className="text-gray">Hạng giúp việc</span>
										</td>
										<td>
											<span className="pl-10">
												{account?.accountLevel?.domesticHelperLevel?.name}
											</span>
										</td>
									</tr>
									<tr>
										<td className="py-1.5">
											<span className="text-gray">Mật khẩu</span>
										</td>
										<td>
											<span className="pl-10">***********</span>
										</td>
									</tr>
								</tbody>
							</table>
							{isUpdateAccountInformation ? (
								<div className="flex">
									<button
										type="submit"
										className="cancel-btn block bg-gray text-white text-center rounded-md font-medium mb-1 mt-5 ml-24"
										onClick={() => setIsUpdateAccountInformation(false)}
									>
										<p>Hủy</p>
									</button>
									<button
										type="submit"
										className="updated-btn block bg-primary text-white text-center rounded-md font-medium mb-1 mt-5 ml-3"
									>
										<p>Cập nhật thông tin</p>
									</button>
								</div>
							) : (
								<button
									type="submit"
									className="update-btn block bg-primary text-white text-center rounded-md font-medium mb-1 mt-5 ml-32"
								>
									<p>Cập nhật thông tin</p>
								</button>
							)}
						</form>
					</div>
					<div className="left-vertical mb-4 px-14 h-60 pt-10 mt-2">
						<img
							src={`${avatarUrl}` || 'src/assets/img/Ellipse 16.png'}
							className="block w-16 mr-2 mb-5 ml-10 rounded-full"
						/>
						<button
							className="rounded-md rounded-customized-gray p-1 hover:cursor-pointer"
							onClick={() => fileRef.current.click()}
						>
							<span>Chọn ảnh đại diện</span>
						</button>
						<div className="mt-2">
							<p className='text-xs'>Dung lượng file tối đa 2MB</p>
						</div>
						<input
							type="file"
							ref={fileRef}
							hidden
							onChange={(e) => setFile(e.target.files[0])}
						/>
						<p className="text-sm self-center pl-2">
							{fileUploadError ? (
								<span className="text-red">
									Tải ảnh lên thất bại (dung lượng ảnh phải nhỏ hơn 2MB)
								</span>
							) : filePerc > 0 && filePerc < 100 ? (
								<span className="text-gray">{`Đang tải lên ${filePerc}%`}</span>
							) : filePerc === 100 ? (
								<span className="text-green">Tải ảnh lên thành công!</span>
							) : (
								''
							)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
