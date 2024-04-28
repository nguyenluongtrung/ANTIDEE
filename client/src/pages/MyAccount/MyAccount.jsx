import { Link } from 'react-router-dom';
import './MyAccount.css';
import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoIosArrowForward } from 'react-icons/io';

export const MyAccount = () => {
	const fileRef = useRef(null);
	const { account } = useSelector((state) => state.auth.account.data);

	return (
		<div className="flex px-16">
			<div className="left-container pr-24 pt-3">
				<div className="flex mb-4">
					<img
						src="src/assets/img/Ellipse 16.png"
						className="block w-12 mr-2"
					/>
					<div className="mt-2">
						<p className="font-bold">{account.name}</p>
						<Link to={""}>
							<p className="text-primary">Xem hồ sơ <IoIosArrowForward className='inline' /></p>
						</Link>
					</div>
				</div>
				<div className="mb-2 hover:text-primary hover:cursor-pointer">
					<img
						src="src/assets/img/clarity_avatar-solid.png"
						className="inline w-4 mr-2"
					/>
					<span>Tài khoản của tôi</span>
				</div>
				<div className="mb-2 hover:text-primary hover:cursor-pointer">
					<img
						src="src/assets/img/mingcute_card-pay-fill.png"
						className="inline w-4 mr-2"
					/>
					<span>aPay</span>
				</div>
				<div className="mb-2 hover:text-primary hover:cursor-pointer">
					<img
						src="src/assets/img/mdi_voucher.png"
						className="inline w-4 mr-2"
					/>
					<span>Kho Voucher</span>
				</div>
				<div className="mb-2 hover:text-primary hover:cursor-pointer">
					<img src="src/assets/img/mdi_heart.png" className="inline w-4 mr-2" />
					<span>Tasker yêu thích</span>
				</div>
				<div className="mb-2 hover:text-primary hover:cursor-pointer">
					<img
						src="src/assets/img/lucide_list-x.png"
						className="inline w-4 mr-2"
					/>
					<span>Danh sách chặn</span>
				</div>
				<div className="mb-2 hover:text-primary hover:cursor-pointer">
					<img src="src/assets/img/mdi_gift.png" className="inline w-4 mr-2" />
					<span>Săn quà giới thiệu</span>
				</div>
				<div className="mb-2 hover:text-primary hover:cursor-pointer">
					<img
						src="src/assets/img/material-symbols_help.png"
						className="inline w-4 mr-2"
					/>
					<span>Trợ giúp</span>
				</div>
				<div className="mb-2 hover:text-primary hover:cursor-pointer">
					<img
						src="src/assets/img/vaadin_piggy-bank-coin.png"
						className="inline w-4 mr-2"
					/>
					<span>Điểm tích lũy</span>
				</div>
				<div className="mb-2 hover:text-primary hover:cursor-pointer">
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
				/>
				<h5 className="font-bold">Hồ sơ của tôi</h5>
				<p className="mb-2 bottom-horizontal pb-3">
					Quản lí hồ sơ tài khoản của bạn
				</p>
				<div className="flex">
					<div className="pl-5 pr-24">
						<table className="">
							<tr>
								<td className="py-1">
									<span className="text-gray">Họ và tên</span>
								</td>
								<td>
									<span className="pl-10">{account.name}</span>
								</td>
							</tr>
							<tr>
								<td className="py-1">
									<span className="text-gray">Email</span>
								</td>
								<td>
									<span className="pl-10">{account.email}</span>
								</td>
							</tr>
							<tr>
								<td className="py-1">
									<span className="text-gray">Số điện thoại</span>
								</td>
								<td>
									<span className="pl-10">{account.phoneNumber}</span>
								</td>
							</tr>
							<tr>
								<td className="py-1">
									<span className="text-gray">Giới tính</span>
								</td>
								<td>
									<span className="pl-10">{account.email}</span>
								</td>
							</tr>
							<tr>
								<td className="py-1">
									<span className="text-gray">aPoints</span>
									<span className="right-vertical px-10">
										{account.aPoints} điểm
									</span>
								</td>
								<td>
									<span className="text-gray px-10">Ngày sinh</span>
									<span className="">{account.dob}</span>
								</td>
							</tr>
							<tr>
								<td className="py-1">
									<span className="text-gray">Hạng khách hàng</span>
								</td>
								<td>
									<span className="pl-10">
										{account.accountLevel.customerLevel.name}
									</span>
								</td>
							</tr>
							<tr>
								<td className="py-1">
									<span className="text-gray">Hạng giúp việc</span>
								</td>
								<td>
									<span className="pl-10">
										{account.accountLevel.domesticHelperLevel.name}
									</span>
								</td>
							</tr>
							<tr>
								<td className="py-1">
									<span className="text-gray">Mật khẩu</span>
								</td>
								<td>
									<span className="pl-10">***********</span>
								</td>
							</tr>
						</table>
						<button
							type="submit"
							className="update-btn block bg-primary text-white text-center rounded-md font-medium mb-1 mt-5 ml-32"
						>
							<p>Cập nhật thông tin</p>
						</button>
					</div>
					<div className="left-vertical mb-4 px-14 h-60 pt-10 mt-2">
						<img
							src="src/assets/img/Ellipse 16.png"
							className="block w-16 mr-2 mb-5 ml-10"
						/>
						<button
							className="rounded-md rounded-customized-gray p-1"
							onClick={() => fileRef.current.click()}
						>
							<span>Chọn ảnh đại diện</span>
						</button>
						<div className="mt-2">
							<p>Dung lượng file tối đa 2MB</p>
							<p className="pl-2">Định dạng: .JEPG, .PNG</p>
						</div>
						<input type="file" ref={fileRef} hidden />
					</div>
				</div>
			</div>
		</div>
	);
};
