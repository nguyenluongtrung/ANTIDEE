import './MyAccount.css';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { Sidebar } from './components/Sidebar/Sidebar';
import { GoPencil } from "react-icons/go";
import { FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
export const MyAccount = () => {
	const [isSidebarVisible, setIsSidebarVisible] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
			setFileUploadError(false);
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
		setFilePerc(0);
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
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
	
	return (
		<div className="flex account-wrapper mb-10">
			<div className={`sidebar transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-50'}`}>
				<Sidebar />
			</div>
			<div className={`menu-icon ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
				{!isSidebarOpen && <span>Danh mục</span>}
				{isSidebarOpen ? (
					<GoArrowLeft size={24} />
				) : (
					<GoArrowRight size={24} />
				)}
			</div>
			<div className="right-container rounded-xl relative">
				<GoPencil
					className="absolute top-5 right-5 hover:cursor-pointer"
					size={23}
					onClick={handleClickPencilIcon}
				/>
				<h5 className="font-bold">Hồ sơ của tôi</h5>
				<p className="mb-2 bottom-horizontal pb-3">
					Quản lí hồ sơ tài khoản của bạn
				</p>
				<div className="flex form-wrapper justify-center">
					<div className="pl-5 form-content customized-width w-2/3">
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
													className={`update-input ml-10 w-40 placeholder:text-red ${errors?.name && 'text-red'
														}`}
													placeholder={errors?.name?.message}
													{...register('name', rules.name)}
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
													className={`update-input ml-10 w-40 placeholder:text-red ${errors?.email && 'text-red'
														}`}
													placeholder={errors?.email?.message}
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
													className={`update-input ml-10 w-40 placeholder:text-red ${errors?.phoneNumber && 'text-red'
														}`}
													placeholder={errors?.phoneNumber?.message}
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
											<span className="text-gray">Apoints</span>
										</td>
										<td>
											<span className="pl-10">
												{account?.aPoints} điểm
											</span>
										</td>
									</tr>
									<tr>
										<td>
											<span className="text-gray">Ngày sinh</span>
										</td>
										<td>
											{isUpdateAccountInformation ? (
												<input
													type="date"
													className={`update-input ml-5 text-center w-40 ${errors?.dob && 'text-red'
														}`}
													{...register('dob', rules.dob)}
													max={maxDateString}
													min={new Date(1900, 0, 1).toISOString().split('T')[0]}
													defaultValue={formatDateInput(account?.dob)}
												/>
											) : (
												<span className="pl-10">
													{account?.dob
														? formatDate(account?.dob)
														: 'Chưa cập nhật'}
												</span>
											)}
										</td>
									</tr>
									<tr>
										<td className="py-1.5">
											<span className="text-gray">Cấp độ</span>
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
											<span className="flex items-center pl-10">***********
												<Link to={'change-password'}>
													<p className='ml-4 flex justify-center items-center bg-primary text-white rounded-lg p-2 cursor-pointer fea-item hover:bg-primary_dark'>
														<FaRegEdit />
													</p>
												</Link>
											</span>
										</td>
									</tr>
								</tbody>
							</table>
							{isUpdateAccountInformation && (
								<div className="flex">
									<button
										type="submit"
										className={`cancel-btn block bg-gray text-white text-center rounded-md font-medium mb-1 mt-5 ml-24 ${fileUploadError ? 'bg-primary' : 'bg-gray'}`}
										onClick={() => { setIsUpdateAccountInformation(false); setFileUploadError(false); setFilePerc(0); initiateAccountInformation() }}
									>
										<p>Hủy</p>
									</button>
									<button
										type="submit"
										disabled={fileUploadError}
										className={`updated-btn block  text-white text-center rounded-md font-medium mb-1 mt-5 ml-3 ${fileUploadError ? 'bg-gray' : 'bg-primary'}`}
									>
										<p>Cập nhật thông tin</p>
									</button>
								</div>
							)}
						</form>
					</div>
					<div className="left-vertical avatar-wrapper mb-4 h-60 pt-10 mt-2">
						<img
							src={`${avatarUrl}` || '../../assets/img/Ellipse 16.png'}
							className="block avatar-image mb-5 rounded-full"
						/>
						<button
							className={`rounded-md rounded-customized-gray p-1 ${!isUpdateAccountInformation ? 'bg-light_gray border-0 text-white' : 'hover:cursor-pointer'}`}
							onClick={() => fileRef.current.click()}
							disabled={!isUpdateAccountInformation}
						>
							<span>Chọn ảnh đại diện</span>
						</button>
						<div className="mt-2">
							<p className="text-xs">Dung lượng file tối đa 2MB</p>
						</div>
						<input
							type="file"
							ref={fileRef}
							hidden
							onChange={(e) => setFile(e.target.files[0])}
						/>
						<p className="text-sm self-center pl-2">
							{fileUploadError ? (
								<span className="text-red text-xs text-center">
									Tải ảnh thất bại (dung lượng &nbsp; &nbsp; &nbsp;ảnh phải nhỏ hơn 2MB)
								</span>
							) : filePerc > 0 && filePerc < 100 ? (
								<span className="text-gray text-xs ml-8">{`Đang tải lên ${filePerc}%`}</span>
							) : filePerc === 100 ? (
								<span className="text-green text-xs ml-3">Tải ảnh lên thành công!</span>
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
