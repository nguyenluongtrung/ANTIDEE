import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccountInformation } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";
import { FaMoneyBillWave, FaUserFriends, FaTags, FaTimes } from 'react-icons/fa';
import { BiHomeAlt, BiUser, BiCreditCardAlt } from "react-icons/bi";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { GiJourney } from "react-icons/gi";
import { MdPostAdd } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { FaRankingStar } from "react-icons/fa6";
import { GrSchedules } from "react-icons/gr";
import { useState } from "react";
import { IoIosArrowDown } from 'react-icons/io';

export const Sidebar = ({ sidebarVisible, setSidebarVisible, services, account, isServicesOpen, setIsServicesOpen }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAccountInformation());
	}, [dispatch]);
 
	const userMenu = [
		{ name: "Trang chủ", to: "/", icon: <BiHomeAlt /> },
		{ name: "Tài khoản", to: "/my-account", icon: <BiUser /> },
		{ name: "Mời bạn bè", to: "/invite-friend", icon: <FaUserFriends /> },
		{ name: "Lịch sử giao dịch", to: "/transaction-history", icon: <FaMoneyBillWave /> },
		{ name: "Diễn Đàn", to: "/discussions", icon: <BiCreditCardAlt />, },
	];
 
	const domesticMenu = [
		{ name: "Tài khoản", to: "/my-account", icon: <BiUser /> },
		{ name: "Công Việc", icon: <MdPostAdd />, to: "/job-posts" },
		{ name: "Hành Trình", icon: <GiJourney />, to: "/journey" },
		{ name: "Lịch làm việc", icon: <GrSchedules />, to: "/job-schedule" },
		{ name: "Diễn Đàn", to: "/discussions", icon: <BiCreditCardAlt />, },
		{ name: "Xếp Hạng", icon: <FaRankingStar />, to: "/ranking" },
		{ name: "Thời Tiết", icon: <TiWeatherPartlySunny />, to: "/weather-forecast" },
	];

	return (
		<div className="relative h-full"> 
			<div
				className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${sidebarVisible ? "translate-x-0" : "-translate-x-full"
					}`}
			> 
				<div className="flex justify-between items-center p-4 border-b bg-white border-gray">
					<span className="text-lg font-bold text-primary">Menu</span>
					<FaTimes size={24} className="cursor-pointer hover:text-primary" onClick={() => setSidebarVisible(false)} />
				</div>
 
				<div className="mt-4"> 
					{account && account?.role !== "Người giúp việc" && userMenu.map((item, index) => (
						<Link
							key={index}
							className="flex items-center p-4 hover:bg-primary text-black transition-colors duration-200 ease-in-out"
							to={item.to}
							onClick={() => setSidebarVisible(false)}
						>
							<span className="mr-3">{item.icon}</span>
							<span>{item.name}</span>
						</Link>
					))}
 
					{account?.role === "Người giúp việc" && domesticMenu.map((item, index) => (
						<Link
							key={index}
							className="flex items-center p-4 hover:bg-primary text-black transition-colors duration-200 ease-in-out"
							to={item.to}
							onClick={() => setSidebarVisible(false)}
						>
							<span className="mr-3">{item.icon}</span>
							<span>{item.name}</span>
						</Link>
					))}
 
					<div className="p-4 cursor-pointer hover:bg-primary" onClick={() => setIsServicesOpen(!isServicesOpen)}>
						<span className="flex items-center justify-between hover:bg-orange-100 text-black transition-colors duration-200 ease-in-out">
							Dịch vụ
							<IoIosArrowDown className={`transform transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
						</span>
					</div>
					{isServicesOpen && (
						<ul className="pl-8">
							{services?.map((service) => (
								<Link
									key={service._id}
									to={`/job-posting/view-service-detail/${service._id}`}
									className="flex items-center p-2 text-black hover:text-primary transition-colors duration-200 ease-in-out"
									onClick={() => setSidebarVisible(false)}
								>
									<span>{service.name}</span>
								</Link>
							))}
						</ul>
					)}
					<Link
						to={''}
						className="flex items-center p-4 hover:bg-primary text-black hover:text-orange-500 transition-colors duration-200 ease-in-out"
						onClick={() => setSidebarVisible(false)}
					>
						<span>Về Antidee</span>
					</Link>
				</div>
			</div>
		</div>
	);
};
