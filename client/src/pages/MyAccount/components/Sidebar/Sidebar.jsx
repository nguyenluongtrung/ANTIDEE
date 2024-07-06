import { IoIosArrowForward } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillSendArrowUpFill } from 'react-icons/bs';
import { BsFillSendArrowDownFill } from 'react-icons/bs';
import { FaHistory } from "react-icons/fa";
import Ellipse_16 from '../../../../assets/img/Ellipse 16.png'
import clarity_avatar_solid from '../../../../assets/img/clarity_avatar-solid.png'
import mdi_voucher from '../../../../assets/img/mdi_voucher.png'
import mingcute_card from '../../../../assets/img/mingcute_card-pay-fill.png'
import mdi_heart from '../../../../assets/img/mdi_heart.png'
import lucide_list from '../../../../assets/img/lucide_list-x.png'
import mdi_gift from '../../../../assets/img/mdi_gift.png'
import vaadin_piggy from '../../../../assets/img/vaadin_piggy-bank-coin.png'

export const Sidebar = ({ account }) => {
	const navigate = useNavigate();
	return (
		<div>
			<div className="flex mb-4">
				<img
					src={`${account?.avatar}` || Ellipse_16}
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
			<div
				className="mb-2.5 hover:text-primary hover:cursor-pointer"
				onClick={() => navigate('/my-account')}
			>
				<img
					src={clarity_avatar_solid}
					className="inline w-4 mr-2"
				/>
				<span>Tài khoản của tôi</span>
			</div>
			<div className="mb-2.5 hover:text-primary hover:cursor-pointer">
				<img
					src={mingcute_card}
					className="inline w-4 mr-2"
				/>
				<span>aPay</span>
			</div>
			<div className="mb-2.5 hover:text-primary hover:cursor-pointer"
				onClick={() => navigate('/voucher-history')}
			>
				<img src={mdi_voucher} className="inline w-4 mr-2" />
				<span>Kho Voucher</span>
			</div>
			<div
				className="mb-2.5 hover:text-primary hover:cursor-pointer"
				onClick={() => navigate('/job-posting-history')}
			>
				<BsFillSendArrowUpFill className="inline w-4 mr-2" />
				<span>Công việc đã đăng</span>
			</div>
			{account?.role === 'Người giúp việc' && (
				<div
					className="mb-2.5 hover:text-primary hover:cursor-pointer"
					onClick={() => navigate('/my-jobs')}
				>
					<BsFillSendArrowDownFill className="inline w-4 mr-2" />
					<span>Công việc đã nhận</span>
				</div>
			)}
			<div
				className="mb-2.5 hover:text-primary hover:cursor-pointer"
				onClick={() => navigate('/exam-result-history')}
			>
				<FaHistory className="inline w-4 mr-2" />
				<span>Lịch sử bài kiểm tra</span>
			</div>
			<div
				className="mb-2.5 hover:text-primary hover:cursor-pointer"
				onClick={() => navigate('/favorite-list')}
			>
				<img src={mdi_heart} className="inline w-4 mr-2" />
				<span>Tasker yêu thích</span>
			</div>
			<div
				className="mb-2.5 hover:text-primary hover:cursor-pointer"
				onClick={() => navigate('/black-list')}
			>
				<img
					src={lucide_list}
					className="inline w-4 mr-2"
				/>
				<span>Danh sách chặn</span>
			</div>
			<div className="mb-2.5 hover:text-primary hover:cursor-pointer">
				<img src={mdi_gift} className="inline w-4 mr-2" />
				<span>Săn quà giới thiệu</span>
			</div>
			<div className="mb-2.5 hover:text-primary hover:cursor-pointer"
			onClick={()=> navigate('/apoints')}>
				<img
					src={vaadin_piggy}
					className="inline w-4 mr-2"
				/>
				<span>Điểm tích lũy</span>
			</div>
		</div>
	);
};
