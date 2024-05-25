import { IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

export const Sidebar = ({account}) => {
	const navigate = useNavigate();
	return (
		<div>
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
			<div className="mb-2.5 hover:text-primary hover:cursor-pointer" onClick={() => navigate('/my-account')}>
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
				<img src="src/assets/img/mdi_voucher.png" className="inline w-4 mr-2" />
				<span>Kho Voucher</span>
			</div>
			<div
				className="mb-2.5 hover:text-primary hover:cursor-pointer"
				onClick={() => navigate('/job-posting-history')}
			>
				<img src="src/assets/img/mdi_voucher.png" className="inline w-4 mr-2" />
				<span>Công việc đã đăng</span>
			</div>
			<div
				className="mb-2.5 hover:text-primary hover:cursor-pointer"
				onClick={() => navigate('/exam-result-history')}
			>
				<img src="src/assets/img/mdi_voucher.png" className="inline w-4 mr-2" />
				<span>Lịch sử bài kiểm tra</span>
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
	);
};
