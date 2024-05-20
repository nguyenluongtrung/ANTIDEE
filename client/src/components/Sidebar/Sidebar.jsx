import { FaHome } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5';
import { HiUsers } from 'react-icons/hi2';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { IoGiftSharp } from 'react-icons/io5';
import { GrNotes } from 'react-icons/gr';
import { FaTasks } from 'react-icons/fa';
import { RiMapPinFill } from 'react-icons/ri';
import { FaRankingStar } from 'react-icons/fa6';
import { IoIosPartlySunny } from 'react-icons/io';
import './Sidebar.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountInformation } from '../../features/auth/authSlice';

export const Sidebar = () => {
	const [activeItem, setActiveItem] = useState(null);
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

	return (
		<div className="sidebar">
			{account && (
				<>
					<div
						className="sidebar-item"
						onMouseEnter={() => handleMouseEnter('Trang chủ')}
						onMouseLeave={handleMouseLeave}
						onClick={() => navigate('/')}
					>
						<FaHome className="sidebar-icon mb-7 hover:cursor-pointer hover:text-primary" />
						{activeItem === 'Trang chủ' && (
							<div className="description">Trang chủ</div>
						)}
					</div>
					<div
						className="sidebar-item"
						onMouseEnter={() => handleMouseEnter('Tài khoản')}
						onMouseLeave={handleMouseLeave}
						onClick={() => navigate('/my-account')}
					>
						<IoPerson className="sidebar-icon mb-7 hover:cursor-pointer hover:text-primary"/>
						{activeItem === 'Tài khoản' && (
							<div className="description">Tài khoản</div>
						)}
					</div>
					<div
						className="sidebar-item"
						onMouseEnter={() => handleMouseEnter('Mời bạn bè')}
						onMouseLeave={handleMouseLeave}
						onClick={() => navigate('/invite-friend')}
					>
						<HiUsers className="sidebar-icon mb-7 hover:cursor-pointer hover:text-primary" />
						{activeItem === 'Mời bạn bè' && (
							<div className="description">Mời bạn bè</div>
						)}
					</div>
					<div
						className="sidebar-item"
						onMouseEnter={() => handleMouseEnter('Ưu đãi')}
						onMouseLeave={handleMouseLeave}
					>
						<IoGiftSharp className="sidebar-icon mb-7 hover:cursor-pointer hover:text-primary" />
						{activeItem === 'Ưu đãi' && (
							<div className="description">Ưu đãi</div>
						)}
					</div>
					<div
						className="sidebar-item"
						onMouseEnter={() => handleMouseEnter('Diễn đàn')}
						onMouseLeave={handleMouseLeave}
					>
						<GrNotes className="sidebar-icon mb-7 hover:cursor-pointer hover:text-primary" />
						{activeItem === 'Diễn đàn' && (
							<div className="description">Diễn đàn</div>
						)}
					</div>
				</>
			)}

			{account?.role === 'Người giúp việc' && (
				<>
					<div
						className="sidebar-item"
						onMouseEnter={() => handleMouseEnter('Công việc')}
						onMouseLeave={handleMouseLeave}
					>
						<FaTasks
							className="sidebar-icon mb-7 hover:cursor-pointer hover:text-primary"
							onClick={() => navigate('/job-posts')}
						/>
						{activeItem === 'Công việc' && (
							<div className="description">Công việc</div>
						)}
					</div>
					<div
						className="sidebar-item"
						onMouseEnter={() => handleMouseEnter('Hành trình')}
						onMouseLeave={handleMouseLeave}
					>
						<RiMapPinFill className="sidebar-icon mb-7 hover:cursor-pointer hover:text-primary" />
						{activeItem === 'Hành trình' && (
							<div className="description">Hành trình</div>
						)}
					</div>
					<div
						className="sidebar-item"
						onMouseEnter={() => handleMouseEnter('Xếp hạng')}
						onMouseLeave={handleMouseLeave}
					>
						<FaRankingStar className="sidebar-icon mb-7 hover:cursor-pointer hover:text-primary" />
						{activeItem === 'Xếp hạng' && (
							<div className="description">Xếp hạng</div>
						)}
					</div>
					<div
						className="sidebar-item"
						onMouseEnter={() => handleMouseEnter('Thời tiết')}
						onMouseLeave={handleMouseLeave}
					>
						<IoIosPartlySunny
							className="sidebar-icon mb-7 hover:cursor-pointer hover:text-primary"
							onClick={() => navigate('/weather-forecast')}
						/>
						{activeItem === 'Thời tiết' && (
							<div className="description">Thời tiết</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};
