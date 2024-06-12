import React, { useEffect, useRef, useState } from 'react';
import './HomePage.css';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../components';
import { getAllServices } from '../../features/services/serviceSlice';
import { useNavigate } from 'react-router-dom';
import { FaAngleRight, FaArrowUp } from 'react-icons/fa';
import Marquee from 'react-fast-marquee';

export const HomePage = () => {
	const [services, setServices] = useState([]);
	const topRef = useRef();
	const serviceRef = useRef();
	const { isLoading } = useSelector((state) => state.services);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const benefit = [
		{
			name: 'Đặt lịch nhanh chóng',
			image: 'image/time.png',
			text: 'Thao tác 60 giây trên ứng dụng, có ngay người giúp việc sau 60 phút',
		},
		{
			name: 'Giá cả rõ ràng',
			image: 'image/money.png',
			text: 'Giá cả dịch vụ trên ứng dụng hiển thị rõ ràng, bạn không cần trả thêm bất kì khoản chi phí nào',
		},
		{
			name: 'Đa dạng dịch vụ',
			image: 'image/dadang.png',
			text: 'Antidee sẵn sàng hỗ trợ mọi nhu cầu việc nhà của bạn',
		},
		{
			name: 'An toàn tối đa',
			image: 'image/baove.png',
			text: 'Người làm uy tín, luôn có hồ sơ lý lịch rõ ràng và được công ty giám sát trong suốt quá trình làm việc ',
		},
	];
	const achievement = [
		{ name: '97%', image: 'image/nguoi.png', text: 'Khách hàng hài lòng' },
		{
			name: '3,600,000',
			image: 'image/tich.png',
			text: 'Công việc được hoàn thành',
		},
		{ name: '11,500,000+', image: 'image/dongho.png', text: 'Giờ làm việc' },
	];

	async function initiateServices() {
		let output = await dispatch(getAllServices());

		setServices(output.payload);
	}

	useEffect(() => {
		initiateServices();
	}, []);

	const scrolLWithUseRef = () => {
		topRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
	};

	const scrolLWithServiceRef = () => {
		serviceRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
	};

	const navigateToServicePage = (id) => {
		navigate(`/job-posting/view-service-detail/${id}`);
	};

	if (isLoading || !Array.isArray(services)) {
		return <Spinner />;
	}

	return (
		<div className="">
			<div
				className="fixed mr-3 mb-10 rounded-full p-5 hover:cursor-pointer bottom-0 right-10 bg-light_purple hover:border-0 hover:opacity-80"
				onClick={scrolLWithUseRef}
			>
				<FaArrowUp className="text-pink" />
			</div>
			<main className="w-full h-full relative px-20 py-9 bg-hero text-white" ref={topRef}>
				<div className="flex flex-col-reverse lg:flex-row mt-16 ">
					<section className="w-full lg:w-[50%] flex flex-col lg:translate-x-10 @md:px-2 lg:px-0 p-5 lg:p-10 lg:p-0">
						<div className="w-full h-auto  lg:pt-7  ">
							<h1 className="text-6xl mb-4 text-yellow font-extrabold">
								Cùng Antidee{' '}
							</h1>
							<h1 className="text-6xl mb-4 text-primary font-extrabold">
								nâng tầm{' '}
							</h1>
							<h1 className="__classNameName_e826f1 text-6xl  text-primary_dark font-extrabold  ">
								chất lượng cuộc sống{' '}
							</h1>
							<p className="max-w-sm py-5 text-gray-400 lg:text-lg">
								Hãy để chúng tôi mang lại cho bạn những trải nghiệm sống thư thả
								với những dịch vụ nhanh gọn, tiện lợi
							</p>
							<div className="">
								<div className="flex items-center justify-center p-3 bg-primary rounded-lg w-[220px] text-center text-white font-bold cursor-pointer fea-item hover:bg-primary_dark" onClick={scrolLWithServiceRef}>
									Khám phá ngay
									<FaAngleRight size={30} className="" />
								</div>
							</div>
						</div>
					</section>
					<section className="relative w-full lg:w-[50%] flex  items-center  justify-center p-10 ">
						<img
							src="public/image/chi_dep.png"
							alt="Hero Image"
							className="h-full w-full object-contain z-10 "
						/>
						<div class="container absolute left-32">
							<div class="blob"></div>
						</div>
					</section>
				</div>
				<div className="background absolute"></div>
			</main>

			<div className="mt-20" ref={serviceRef}>
				<p
					className="ml-[120px] mt-7"
					style={{ color: '#562A0E', fontSize: '30px' }}
				>
					Dịch vụ hàng đầu
				</p>

				<div className="flex justify-center">
					<div className=" w-[80%] ">
						<Marquee autoFill pauseOnHover className="h-64">
							{services.map((service, index) => (
								<div
									key={index}
									className="mx-4 transition duration-300 ease-in-out transform hover:scale-110 border-gray-300 shadow-2xl rounded-[15px] hover:cursor-pointer"
								>
									<div className="p-4">
										<p
											className="mb-3 text-primary font-bold opacity-80 mt-1"
											style={{ fontSize: '15px' }}
										>
											{service?.name}
										</p>
										<img
											src={service?.image}
											alt={service?.name}
											className="w-[175px] h-[155px] object-cover rounded-lg "
											onClick={() => navigateToServicePage(service?._id)}
										/>
									</div>
								</div>
							))}
						</Marquee>
					</div>
				</div>
			</div>

			<div className="mt-20">
				<p
					className="ml-[120px] mt-7"
					style={{ color: '#562A0E', fontSize: '30px' }}
				>
					An tâm với lựa chọn của bạn
				</p>
				<div className="flex justify-center mt-4 ml-10 grid grid-cols-4">
					{benefit.map((benefit, index) => (
						<div
							key={index}
							className="transition duration-300 ease-in-out transform hover:scale-110 mx-20"
						>
							<div className="flex-col justify-center">
								<img
									src={benefit.image}
									alt={benefit.name}
									className="w-[65px] h-[65px] object-cover "
								/>
								<p className=" mt-2 text-black text-lg font-bold ">
									{benefit.name}
								</p>
								<p className="w-40 text-xs text-gray">{benefit.text}</p>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="mt-20">
				<span
					className="ml-[120px] mt-7 font-bold"
					style={{ color: '#562A0E', fontSize: '30px' }}
				>
					100,000+
				</span>
				<span className="mt-7" style={{ color: '#562A0E', fontSize: '30px' }}>
					{' '}
					khách hàng sử dụng ứng dụng Antidee
				</span>
				<div className="flex ml-[100px] mt-4 grid grid-cols-3 ">
					{achievement.map((achievement, index) => (
						<div key={index} className="">
							<div className="p-5">
								<img
									src={achievement.image}
									alt={achievement.name}
									className="w-[40px] h-[40px] object-cover "
								/>
								<p className=" mt-2 text-primary text-2xl font-bold ">
									{achievement.name}
								</p>
								<p>{achievement.text}</p>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="mt-20">
				<div className="flex ml-20 mt-4 grid grid-cols-2 gap-10">
					<div>
						<img src="/image/giupdo.png" className="w-[640px] h-[430px] ml-9" />
					</div>
					<div>
						<p className="" style={{ color: '#562A0E', fontSize: '30px' }}>
							Chúng tôi luôn sẵn lòng giúp đỡ bạn
						</p>
						<span className="text-black">
							Nếu có bất kì thắc mắc gì, bạn liên hệ với chúng tôi thông qua -{' '}
						</span>
						<a
							style={{
								color: '#562A0E',
								fontSize: '12px',
								textDecoration: 'underline',
							}}
							href="#"
						>
							Nhận hỗ trợ
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};
