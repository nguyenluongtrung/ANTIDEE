import { FaHome } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5';
import { HiUsers } from 'react-icons/hi2';
import { IoGiftSharp } from 'react-icons/io5';
import { GrNotes } from 'react-icons/gr';
import { FaTasks } from 'react-icons/fa';
import { RiMapPinFill } from 'react-icons/ri';
import { FaRankingStar } from 'react-icons/fa6';
import { IoIosPartlySunny } from 'react-icons/io';
import { FaChevronRight } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountInformation } from '../../features/auth/authSlice';
import "./Sidebar.css"

export const Sidebar = () => {
	const [activeItem, setActiveItem] = useState(null);
	const [sidebarVisible, setSidebarVisible] = useState(false); // State for sidebar visibility
	const { account } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getAccountInformation());
	}, [dispatch]);

	const handleMouseEnter = (item) => {
		setActiveItem(item);
	};

	const handleMouseLeave = () => {
		setActiveItem(null);
	};

	const handleArrowMouseEnter = () => {
		setSidebarVisible(true);
	};

	const handleSidebarMouseLeave = () => {
		setSidebarVisible(false);
	};

	return (
		<div className="relative h-full">
			<div
				className={`fixed top-1/2 left-0 transform -translate-y-1/2 cursor-pointer transition-transform ${!sidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}
				onMouseEnter={handleArrowMouseEnter}
			>
				<FaChevronRight size={24} />
			</div>
			<div
				className={`fixed top-0 left-0 h-full bg-gray transition-transform ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}
				onMouseLeave={handleSidebarMouseLeave}
			>
				<div className="sidebar flex flex-col items-center justify-center h-full">
					{account && (
						<>
							<div
								className="sidebar-item p-4 cursor-pointer hover:text-primary"
								onMouseEnter={() => handleMouseEnter('Trang chủ')}
								onMouseLeave={handleMouseLeave}
								onClick={() => navigate('/')}
							>
								<FaHome className="mr-4" />
								{activeItem === 'Trang chủ' && (
									<div className="description">Trang chủ</div>
								)}
							</div>
							<div
								className="sidebar-item p-4 cursor-pointer hover:text-primary"
								onMouseEnter={() => handleMouseEnter('Tài khoản')}
								onMouseLeave={handleMouseLeave}
								onClick={() => navigate('/my-account')}
							>
								<IoPerson className="mr-4" />
								{activeItem === 'Tài khoản' && (
									<div className="description">Tài khoản</div>
								)}
							</div>
							<div
								className="sidebar-item p-4 cursor-pointer hover:text-primary"
								onMouseEnter={() => handleMouseEnter('Mời bạn bè')}
								onMouseLeave={handleMouseLeave}
								onClick={() => navigate('/invite-friend')}
							>
								<HiUsers className="mr-4" />
								{activeItem === 'Mời bạn bè' && (
									<div className="description">Mời bạn bè</div>
								)}
							</div>
							<div
								className="sidebar-item p-4 cursor-pointer hover:text-primary"
								onMouseEnter={() => handleMouseEnter('Ưu đãi')}
								onMouseLeave={handleMouseLeave}
								onClick={() => navigate('/vouchers')}
							>
								<IoGiftSharp className="mr-4" />
								{activeItem === 'Ưu đãi' && (
									<div className="description">Ưu đãi</div>
								)}
							</div>
							<div
								className="sidebar-item flex items-center p-4 cursor-pointer hover:text-primary"
								onMouseEnter={() => handleMouseEnter('Diễn đàn')}
								onMouseLeave={handleMouseLeave}
							>
								<GrNotes className="mr-4" />
								{activeItem === 'Diễn đàn' && (
									<div className="description">Diễn đàn</div>
								)}
							</div>
						</>
					)}

					{account?.role === 'Người giúp việc' && (
						<>
							<div
								className="sidebar-item flex items-center p-4 cursor-pointer hover:text-primary"
								onMouseEnter={() => handleMouseEnter('Công việc')}
								onMouseLeave={handleMouseLeave}
								onClick={() => navigate('/job-posts')}
							>
								<FaTasks className="mr-4" />
								{activeItem === 'Công việc' && (
									<div className="description">Công việc</div>
								)}
							</div>
							<div
								className="sidebar-item flex items-center p-4 cursor-pointer hover:text-primary"
								onMouseEnter={() => handleMouseEnter('Hành trình')}
								onMouseLeave={handleMouseLeave}
							>
								<RiMapPinFill className="mr-4" />
								{activeItem === 'Hành trình' && (
									<div className="description">Hành trình</div>
								)}
							</div>
							<div
								className="sidebar-item flex items-center p-4 cursor-pointer hover:text-primary"
								onMouseEnter={() => handleMouseEnter('Xếp hạng')}
								onMouseLeave={handleMouseLeave}
							>
								<FaRankingStar className="mr-4" />
								{activeItem === 'Xếp hạng' && (
									<div className="description">Xếp hạng</div>
								)}
							</div>
							<div
								className="sidebar-item flex items-center p-4 cursor-pointer hover:text-primary"
								onMouseEnter={() => handleMouseEnter('Thời tiết')}
								onMouseLeave={handleMouseLeave}
								onClick={() => navigate('/weather-forecast')}
							>
								<IoIosPartlySunny className="mr-4" />
								{activeItem === 'Thời tiết' && (
									<div className="description">Thời tiết</div>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};
