import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../components';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { BiCheck } from 'react-icons/bi';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { IoAddOutline } from 'react-icons/io5';
import { getAllAccounts, updateRole } from '../../../features/auth/authSlice';
import { QualificationDetail } from './QualificationDetail/QualificationDetail';
import { ImageDetail } from './ImageDetail/ImageDetail';
export const UpdateAccountRole = () => {
	const [isOpenDetailAccount, setIsOpenDetailAccount] = useState(false);
	const [isOpenImageDetail, setIsOpenImageDetail] = useState(false);
	const [chosenAccountId, setChosenAccountId] = useState('');
	const [accounts, setAccounts] = useState('');
	const dispatch = useDispatch();

	const handleGetAllAccount = async () => {
		const response = await dispatch(getAllAccounts())
		let result = response.payload.filter((acc)=>acc.resume.length>=1 && acc.resume[0].qualifications?.length>=1 && acc.resume[0].frontIdCard && acc.resume[0].backIdCard && acc.resume[0].curriculumVitae && acc.resume[0].certificateOfResidence && acc.role === 'Khách hàng')
	console.log(response.payload)
		setAccounts(result)
	};

	useEffect(() => {
		handleGetAllAccount();
	}, []);

	if (!Array.isArray(accounts)) {
		return <Spinner />;
	}

	const handleSubmitUpdateRole = async (id) => {
		const response = await dispatch(updateRole(id))
		if (response.type.endsWith('fulfilled')) {
			toast.success('Cập nhật thành công', successStyle);
		} else if (response?.error?.message === 'Rejected') {
			toast.error(response?.payload, errorStyle);
		}
		handleGetAllAccount()
	}

	return (
		<div className="w-full min-h-screen bg-white flex flex-row">
			<AdminSidebar />
			<div className="flex-1 px-10 pt-5">
				<Toaster>
					{(t) => (
						<ToastBar
							toast={t}
							style={{
								...t.style,
								animation: t.visible
									? 'custom-enter 1s ease'
									: 'custom-exit 1s ease',
							}}
						/>
					)}
				</Toaster>

			
				{isOpenDetailAccount && (
					<QualificationDetail
						setIsOpenDetailAccount={setIsOpenDetailAccount}
						chosenAccountId={chosenAccountId}
						accounts={accounts}
					/>
				)}

{isOpenImageDetail && (
					<ImageDetail
						setIsOpenImageDetail={setIsOpenImageDetail}
						chosenAccountId={chosenAccountId}
						accounts={accounts}
					/>
				)}

				<div className="flex">
					<div className="flex-1 pt-2">
						<span>Hiển thị </span>
						<select
							className="rounded-md p-1 mx-1 hover:cursor-pointer"
							style={{ backgroundColor: '#E0E0E0' }}
						>
							<option>10</option>
							<option>20</option>
							<option>30</option>
						</select>
						<span> hàng</span>
					</div>
			
				</div>
				<table className="w-full border-b border-gray mt-3">
					<thead>
						<tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
							<td className="py-2 px-4 text-center font-bold">STT</td>
							<td className="py-2 px-4 text-center font-bold">Người dùng</td>
							<td className="py-2 px-4 text-center font-bold">Chứng chỉ</td>
							<td className="py-2 px-4 text-center font-bold">Các giấy tờ liên quan</td>
							<td className="py-2 px-4 text-center font-bold">Hành Động</td>
						</tr>
					</thead>
					<tbody>
					{accounts?.filter((acc)=>String(acc.role)!=='Người giúp việc')?.map((account, index) => {
							return (
								<tr className="hover:bg-light_purple transition-colors group odd:bg-light_purple hover:cursor-pointer">
									<td className="font-medium text-center text-gray p-3">
										<span>{index + 1}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>{account?.name}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<button
											className="hover:cursor-pointer text-xl pt-1.5"
											onClick={() => {
												setIsOpenDetailAccount(true);
												setChosenAccountId(account._id);
											}}
										>
											<MdOutlineRemoveRedEye className="block mx-auto" />
										</button>
									</td>
									<td className="font-medium text-center text-gray">
										<button
											className="hover:cursor-pointer text-xl pt-1.5"
											onClick={() => {
												setIsOpenImageDetail(true);
												setChosenAccountId(account._id);
											}}
										>
											<MdOutlineRemoveRedEye className="block mx-auto" />
										</button>
									</td>
									<td className="font-medium text-center text-gray">
										<button
											className="hover:cursor-pointer text-xl pt-1.5"
											onClick={() =>handleSubmitUpdateRole(account._id)}
										>
											<BiCheck className="block mx-auto text-green" />
										</button>
									</td>
									<td className="">
										<div className="flex items-center justify-center">
										
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};
