import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { useEffect, useState } from 'react';
import { LoginPage } from '../../pages/LoginPage/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage/RegisterPage';
import { IoIosArrowDown } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountInformation, logout } from '../../features/auth/authSlice';

export const Header = () => {
	const [isOpenLoginForm, setIsOpenLoginForm] = useState(false);
	const [isOpenRegisterForm, setIsOpenRegisterForm] = useState(false);

	const { account } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getAccountInformation());
	}, [dispatch]);

	const onLogout = () => {
		navigate('/home');
		dispatch(logout());
		dispatch(reset());
	}

	return (
		<div className="mb-7">
			{isOpenLoginForm && <LoginPage setIsOpenLoginForm={setIsOpenLoginForm} />}
			{isOpenRegisterForm && (
				<RegisterPage
					setIsOpenRegisterForm={setIsOpenRegisterForm}
					setIsOpenLoginForm={setIsOpenLoginForm}
				/>
			)}
			<div className="navbar-container flex justify-between px-16 py-3">
				<Link to="/home">
					<p className="text-primary font-bold logo-text pt-2">Antidee</p>
				</Link>
				<ul className="navbar-menu flex text-gray normal-text pt-2">
					<li className="mr-5 dropdown">
						<Link to={''}>
							<span className="dropbtn">
								Dịch vụ <IoIosArrowDown className="inline" />
							</span>
						</Link>
						<div className="dropdown-content">
							<div className="mr-3">
								<Link to={''} className="block">
									<span>Dọn dẹp văn phòng</span>
								</Link>
								<Link to={''} className="block">
									<span>Vệ sinh máy lạnh</span>
								</Link>
								<Link to={''} className="block">
									<span>Giúp việc nhà theo giờ</span>
								</Link>
								<Link to={''} className="block">
									<span>Trông trẻ tại nhà</span>
								</Link>
								<Link to={''} className="block">
									<span>Chăm sóc người bệnh</span>
								</Link>
								<Link to={''} className="block">
									<span>Chăm sóc người cao tuổi</span>
								</Link>
							</div>
							<div>
								<Link to={''} className="block">
									<span>Tổng vệ sinh</span>
								</Link>
								<Link to={''} className="block">
									<span>Vệ sinh sofa, rèm, nệm</span>
								</Link>
								<Link to={''} className="block">
									<span>Đi chợ</span>
								</Link>
								<Link to={''} className="block">
									<span>Nấu ăn gia đình</span>
								</Link>
								<Link to={''} className="block">
									<span>Giặt ủi</span>
								</Link>
							</div>
						</div>
					</li>
					<li className="mr-5">
						<Link to={''}>
							<span>Về Antidee</span>
						</Link>
					</li>
					<li className="mr-5">
						<Link to={''}>
							<span>Trở thành người giúp việc</span>
						</Link>
					</li>
				</ul>
				<div className="flex">
					{account ? (
						<>
							<button className="header-login-btn text-primary text-center rounded-2xl font-medium w-28 border-primary border-2" onClick={onLogout}>
								<span>Đăng xuất</span>
							</button>
						</>
					) : (
						<>
							<button
								className="header-login-btn text-primary text-center rounded-2xl font-medium w-28 border-primary border-2"
								onClick={() => setIsOpenLoginForm(true)}
							>
								<span>Đăng nhập</span>
							</button>
							<button
								className="header-register-btn text-white text-center rounded-2xl font-medium w-28 ml-5 bg-primary"
								onClick={() => setIsOpenRegisterForm(true)}
							>
								<span>Đăng ký</span>
							</button>
						</>
					)}
				</div>
			</div>
			<hr className="hr-header"></hr>
		</div>
	);
};
