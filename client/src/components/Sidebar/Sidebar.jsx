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
import { useState } from 'react';

export const Sidebar = () => {
	const [activeItem, setActiveItem] = useState(null);

	const handleMouseEnter = (item) => {
		setActiveItem(item);
	};

	const handleMouseLeave = () => {
		setActiveItem(null);
	};
	return (
		<div className="sidebar">
			<div
				className="sidebar-item"
				onMouseEnter={() => handleMouseEnter('Trang chủ')}
				onMouseLeave={handleMouseLeave}
			>
				<FaHome className="sidebar-icon mb-7 hover:cursor-pointer" />
				{activeItem === 'Trang chủ' && <div className="description">Trang chủ</div>}
			</div>
			<div
				className="sidebar-item"
				onMouseEnter={() => handleMouseEnter('Hồ sơ')}
				onMouseLeave={handleMouseLeave}
			>
				<IoPerson className="sidebar-icon mb-7 hover:cursor-pointer" />
				{activeItem === 'Hồ sơ' && <div className="description">Hồ sơ</div>}
			</div>
			<div
				className="sidebar-item"
				onMouseEnter={() => handleMouseEnter('Mời bạn bè')}
				onMouseLeave={handleMouseLeave}
			>
				<HiUsers className="sidebar-icon mb-7 hover:cursor-pointer" />
				{activeItem === 'Mời bạn bè' && <div className="description">Mời bạn bè</div>}
			</div>
			<div
				className="sidebar-item"
				onMouseEnter={() => handleMouseEnter('Tài khoản')}
				onMouseLeave={handleMouseLeave}
			>
				<RiMoneyDollarCircleFill className="sidebar-icon mb-7 hover:cursor-pointer" />
				{activeItem === 'Tài khoản' && <div className="description">Tài khoản</div>}
			</div>
			<div
				className="sidebar-item"
				onMouseEnter={() => handleMouseEnter('Ưu đãi')}
				onMouseLeave={handleMouseLeave}
			>
				<IoGiftSharp className="sidebar-icon mb-7 hover:cursor-pointer" />
				{activeItem === 'Ưu đãi' && <div className="description">Ưu đãi</div>}
			</div>
			<div
				className="sidebar-item"
				onMouseEnter={() => handleMouseEnter('Diễn đàn')}
				onMouseLeave={handleMouseLeave}
			>
				<GrNotes className="sidebar-icon mb-7 hover:cursor-pointer" />
				{activeItem === 'Diễn đàn' && <div className="description">Diễn đàn</div>}
			</div>
			<div
				className="sidebar-item"
				onMouseEnter={() => handleMouseEnter('Công việc')}
				onMouseLeave={handleMouseLeave}
			>
				<FaTasks className="sidebar-icon mb-7 hover:cursor-pointer" />
				{activeItem === 'Công việc' && <div className="description">Công việc</div>}
			</div>
			<div
				className="sidebar-item"
				onMouseEnter={() => handleMouseEnter('Hành trình')}
				onMouseLeave={handleMouseLeave}
			>
				<RiMapPinFill className="sidebar-icon mb-7 hover:cursor-pointer" />
				{activeItem === 'Hành trình' && <div className="description">Hành trình</div>}
			</div>
			<div
				className="sidebar-item"
				onMouseEnter={() => handleMouseEnter('Xếp hạng')}
				onMouseLeave={handleMouseLeave}
			>
				<FaRankingStar className="sidebar-icon mb-7 hover:cursor-pointer" />
				{activeItem === 'Xếp hạng' && <div className="description">Xếp hạng</div>}
			</div>
			<div
				className="sidebar-item"
				onMouseEnter={() => handleMouseEnter('Thời tiết')}
				onMouseLeave={handleMouseLeave}
			>
				<IoIosPartlySunny className="sidebar-icon mb-7 hover:cursor-pointer" />
				{activeItem === 'Thời tiết' && <div className="description">Thời tiết</div>}
			</div>
		</div>
	);
};
