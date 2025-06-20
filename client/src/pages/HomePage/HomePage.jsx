import React, { useEffect, useRef, useState } from 'react';
import './HomePage.css';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../components';
import {
	getAllServices,
	getRecommendedServices,
} from '../../features/services/serviceSlice';
import { useNavigate } from 'react-router-dom';
import {
	FaAngleRight,
	FaArrowUp,
	FaPaperPlane,
	FaStar,
	FaUserCheck,
} from 'react-icons/fa';
import { GiBowTieRibbon } from 'react-icons/gi';
import Marquee from 'react-fast-marquee';
import AOS from 'aos';
import { PiArrowBendDownRightBold, PiMoneyWavyLight } from 'react-icons/pi';
import features2 from '../../assets/img/features2.jpg';
import features3 from '../../assets/img/features3.jpg';
import { getAllJobPosts } from '../../features/jobPosts/jobPostsSlice';
import {
	formatDate,
	formatWorkingTime,
	getCurrentTimeString,
} from '../../utils/format';
import PromotionPage from './Promotion/PromotionPage';
import { LuClock } from 'react-icons/lu';
import { CreateAppFeedback } from './AppFeedback/AppFeedbackPage';

export const HomePage = () => {
	const [services, setServices] = useState([]);
	const [recommendedServices, setRecommendedServices] = useState();
	const [isOpenCreateAppFeedback, setIsOpenCreateAppFeedback] = useState(false);
	const [jobPosts, setJobPosts] = useState([]);
	const topRef = useRef();
	const serviceRef = useRef();
	const { isLoading } = useSelector((state) => state.services);
	const { account } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const benefit = [
		{
			name: 'Đặt lịch nhanh chóng',
			image: 'image/nhanh-chong-icon.webp',
			text: 'Chỉ mất chưa đến một phút qua ứng dụng, bạn có thể dễ dàng đặt lịch hẹn với người giúp việc chuyên nghiệp. Sau khi hoàn tất đặt lịch, chỉ trong vòng 60 phút, người giúp việc sẽ có mặt tại nhà bạn, sẵn sàng hỗ trợ và làm sạch không gian sống của bạn một cách nhanh chóng và hiệu quả.',
		},
		{
			name: 'Giá cả hợp lí',
			image: 'image/ro-rang-icon.jpg',
			text: 'Giá cả của từng dịch vụ hợp lí rõ ràng, bạn không cần trả thêm bất kỳ khoản chi phí nào. Tất cả các khoản phí đều được minh bạch và chi tiết, giúp bạn yên tâm sử dụng dịch vụ mà không lo ngại về các chi phí ẩn. Chúng tôi cam kết cung cấp cho bạn những thông tin chính xác và trung thực về giá cả ngay từ đầu, đảm bảo bạn nhận được giá trị dịch vụ đúng với số tiền bỏ ra.',
		},
		{
			name: 'Đa dạng dịch vụ',
			image: 'image/da-dang.png',
			text: 'Antidee sẵn sàng hỗ trợ mọi nhu cầu của bạn từ dọn dẹp nhà cửa, giặt là, nấu ăn đến chăm sóc cây cảnh và thú cưng, chúng tôi cung cấp một loạt các dịch vụ đa dạng để đáp ứng mọi yêu cầu của bạn. Sự đa dạng và linh hoạt trong dịch vụ giúp bạn tiết kiệm thời gian và tận hưởng cuộc sống tiện nghi hơn.',
		},
		{
			name: 'An toàn tuyệt đối',
			image: 'image/an-toan-icon.jpg',
			text: 'Chúng tôi hiểu rằng an toàn và tin cậy là yếu tố hàng đầu khi lựa chọn dịch vụ giúp việc nhà. Vì vậy, tất cả nhân viên của chúng tôi đều phải trải qua quy trình kiểm tra nghiêm ngặt và được đào tạo bài bản. Hơn nữa, chúng tôi luôn theo dõi và đánh giá hiệu suất làm việc của họ để đảm bảo bạn nhận được dịch vụ tốt nhất và an toàn nhất.',
		},
	];

	const achievement = [
		{
			name: '99%',
			image: 'image/khach-hang-icon.png',
			text: 'Khách hàng hài lòng',
		},
		{
			name: '10,000,000+',
			image: 'image/truy-cap-icon.png',
			text: 'Lượt truy cập',
		},
		{
			name: '3,600,000',
			image: 'image/cong-viec-hoan-thanh-icon.png',
			text: 'Công việc được hoàn thành',
		},
	];

	async function initiateServices() {
		let output = await dispatch(getAllServices());

		setServices(output.payload);
	}

	async function initiateRecommendedServices() {
		let output = await dispatch(getRecommendedServices());
		if (output.type.includes('fulfilled')) {
			setRecommendedServices(output.payload);
		} else {
			setRecommendedServices([]);
		}
	}

	useEffect(() => {
		initiateRecommendedServices();
	}, [account]);

	useEffect(() => {
		initiateServices();
	}, []);

	useEffect(() => {
		initiateJobPosts();
	}, []);

	async function initiateJobPosts() {
		let output = await dispatch(getAllJobPosts());
		if (output.type.endsWith('fulfilled')) {
			const filteredJobPosts = output.payload
				?.filter(
					(jobPost) =>
						jobPost.domesticHelperId == null &&
						jobPost?.cancelDetails?.isCanceled === false
				)
				?.filter((jobPost) => {
					const startingDate = new Date(jobPost.workingTime.startingDate);
					startingDate.setMinutes(
						startingDate.getMinutes() - startingDate.getTimezoneOffset()
					);
					const startingHour = parseInt(
						jobPost.workingTime.startingHour.split(':')[0]
					);
					const startingMinute = parseInt(
						jobPost.workingTime.startingHour.split(':')[1]
					);
					const startingTime = `${startingHour
						.toString()
						.padStart(2, '0')}:${startingMinute.toString().padStart(2, '0')}`;

					if (startingDate.toISOString() > new Date().toISOString()) {
						return true;
					} else if (
						startingDate.toDateString() === new Date().toDateString() &&
						startingTime >= getCurrentTimeString()
					) {
						return true;
					} else {
						return false;
					}
				});
			setJobPosts(filteredJobPosts);
		} else {
			setJobPosts([]);
		}
	}

	useEffect(() => {
		AOS.init({
			duration: 600,
			easing: 'ease-in-out',
			delay: 50,
			once: true,
		});
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
		<div className="body-homepage pb-10">
			{isOpenCreateAppFeedback && (
				<CreateAppFeedback
					setIsOpenCreateAppFeedback={setIsOpenCreateAppFeedback}
				/>
			)}
			<div
				className="fixed right-4 sm:right-6 md:right-8 lg:right-10 bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 rounded-full p-3 sm:p-4 md:p-5 bg-light_purple hover:cursor-pointer hover:opacity-80"
				onClick={scrolLWithUseRef}
				style={{ zIndex: 10000 }}
			>
				<FaArrowUp className="text-pink text-xl sm:text-2xl md:text-3xl" />
			</div>

			<main
				className="w-full h-full relative px-5 py-9 bg-hero text-white"
				ref={topRef}
			>
				<div className="md:flex mt-8 md:mt-16 md:wrapper">
					<div className="w-full lg:w-[50%] flex flex-col lg:translate-x-10 pt-5 ">
						<div className="w-full h-auto lg:pt-7">
							<h1>
								<span className="text-5xl sm:text-5xl lg:text-6xl text-yellow font-extrabold">
									Cùng Antidee
								</span>
								<br/>
								<span className="text-5xl sm:text-5xl lg:text-6xl text-primary font-extrabold">
									nâng tầm
								</span>
								<br/>
								<span className="text-5xl sm:text-5xl lg:text-6xl text-primary_dark font-extrabold">
									chất lượng cuộc sống
								</span>
								<br/>
							</h1>
							<p className="max-w-sm py-5 text-gray-400 text-base md:text-lg">
								Hãy để chúng tôi mang lại cho bạn những trải nghiệm sống thư thả
								với những dịch vụ nhanh gọn, tiện lợi
							</p>
							<div>
								<div
									className="flex items-center justify-center p-3 bg-primary rounded-lg w-[180px] md:w-[220px] text-center text-white font-bold cursor-pointer hover:bg-primary_dark"
									onClick={scrolLWithServiceRef}
								>
									Khám phá ngay
									<FaAngleRight size={24} className="ml-2" />
								</div>
							</div>
						</div>
					</div>

					<div className="relative w-full lg:w-[50%] flex items-center justify-center p-5 lg:p-10">
						<div className="container relative w-[auto]">
							<div className="blob">
								<img
									src="image/chi_dep.png"
									alt="Hero Image"
									className="absolute h-[70%] md:h-[80%] lg:h-[90%] w-full object-cover bottom-0"
								/>
							</div>
						</div>
					</div>
				</div>
			</main>

			<section
				className="py-10 sm:py-16 lg:py-20 bg-white md:mt-0"
				ref={serviceRef}
			>
				<h2
					className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-10 px-[.625rem] sm:mb-12 lg:mb-16 flex justify-center items-center"
					data-aos="fade-down"
					data-aos-offset="200"
				>
					Các dịch vụ dành cho bạn{' '}
					<FaUserCheck className="ml-4 animate-bounce" size={50} />
				</h2>

				<div className="flex justify-center bg-primary py-4">
					<div
						className="w-[90%] sm:w-[85%] lg:w-[80%]"
						data-aos="slide-up"
						data-aos-offset="200"
					>
						<Marquee
							autoFill
							pauseOnHover
							className="h-60 lg:h-64 rounded-lg bg-primary"
						>
							{services?.map((service, index) => (
								<div
									key={index}
									className="bg-white rounded-2xl relative p-5 text-white mx-2 transition duration-300 hover:scale-105 cursor-pointer"
									onClick={() => navigateToServicePage(service?._id)}
								>
									{recommendedServices?.find(
										(recommend) =>
											String(recommend.itemId) == String(service._id)
									) && (
										<div
											className="absolute top-0 left-0"
											style={{ transform: 'rotate(-30deg)' }}
										>
											<GiBowTieRibbon size={60} color="#27c250" />
										</div>
									)}
									<div className="flex items-center rounded-sm">
										<div className="w-52 h-48 bg-white flex items-center justify-center overflow-hidden rounded-lg">
											<img
												src={service?.image}
												alt={service?.name}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="flex flex-col ml-4 gap-y-2">
											<h3 className="text-xl font-semibold min-w-[200px] text-primary ">
												{service.name}
											</h3>
											<p className="text-gray font-normal flex justify-center items-center">
												Chất lượng dịch vụ | {service.rating ? '5' : '5'}{' '}
												<FaStar size={15} className="mx-2 text-yellow" />
											</p>
											<div className="text-primary mt-4">
												<button className="flex justify-center items-center font-bold text-base rounded-lg hover:bg-primary hover:text-white">
													Trải nghiệm ngay
													<FaPaperPlane
														size={15}
														className="ml-2 animate-bounce"
													/>
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
						</Marquee>
					</div>
				</div>
			</section>

			<PromotionPage />

			{jobPosts.length > 0 && (
				<>
					<div className="mt-20  px-4 lg:px-25">
						<div
							className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-10"
							data-aos="fade-down"
							data-aos-offset="200"
						>
							Công việc dành cho bạn
						</div>
						<div className=" md:wrapper grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
							{jobPosts.slice(0, 3)?.map((post) => (
								<div
									className={`shadow-xl p-5 hover:shadow-2xl hover:cursor-pointer relative bg-super_light_purple ${
										post?.isUrgent && 'bg-light_pink'
									}`}
									style={{ minHeight: '21.875rem' }}
								>
									<p className="text-black font-bold text-lg md:text-base text-center mb-3">
										{post?.serviceId?.name?.toUpperCase()}
									</p>
									{post?.isUrgent && (
										<div className="triangle-down absolute top-0 right-0"></div>
									)}
									<p className="text-gray mb-2">
										Bắt đầu lúc:{' '}
										<span className="text-brown">
											{formatDate(post?.workingTime?.startingDate)}{' '}
											{formatWorkingTime(post?.workingTime?.startingHour)}
										</span>
									</p>
									<p className="text-gray mb-2">
										Hết hạn lúc:{' '}
										<span className="text-brown">
											{formatDate(post?.dueDate)}
										</span>
									</p>
									<div className="border-2 border-gray my-3">
										{post?.workload?.find(
											(option) => String(option?.optionName) === 'Thời gian'
										) == undefined ? (
											<div>
												<p className="flex items-center justify-center text-gray mb-2 text-center mt-3">
													Số tiền <PiMoneyWavyLight className="ml-2" />
												</p>
												<p className="text-center text-green font-bold mb-3">
													{Intl.NumberFormat().format(post?.totalPrice)} VND
												</p>
											</div>
										) : (
											<div className="grid grid-cols-2">
												<div className="border-r-2 border-gray">
													<p className="flex items-center justify-center text-gray mb-2 text-center mt-3">
														Làm trong <LuClock className="ml-2" />
													</p>
													<p className="text-center text-primary font-bold mb-3">
														{
															post?.workload?.find(
																(option) =>
																	String(option?.optionName) === 'Thời gian'
															)?.optionValue
														}{' '}
														giờ
													</p>
												</div>
												<div>
													<p className="flex items-center justify-center text-gray mb-2 text-center mt-3">
														Số tiền <PiMoneyWavyLight className="ml-2" />
													</p>
													<p className="text-center text-green font-bold mb-3">
														{Intl.NumberFormat().format(post?.totalPrice)} VND
													</p>
												</div>
											</div>
										)}
									</div>
									<p className="text-gray mb-2">
										Tại:{' '}
										<span
											className={`text-black ${
												!JSON.parse(localStorage.getItem('account')) &&
												'blur-text'
											}`}
										>
											{post?.contactInfo?.address}
										</span>
									</p>
									<p className="text-gray mb-3">
										Ghi chú:{' '}
										<span className="text-black">
											{post?.note || 'Không có'}
										</span>
									</p>
									<div className="flex flex-col items-center absolute bottom-5 left-1/2 transform -translate-x-1/2 w-full">
										<button
											className="mt-5 text-white bg-brown rounded-2xl text-sm py-2.5 w-3/4 text-center hover:bg-light_yellow hover:text-brown"
											onClick={() => {
												navigate(`/job-posts/${post?._id}`, {
													state: { isOpenJobPostDetail: true, jobPosts },
												});
											}}
										>
											Xem chi tiết công việc
										</button>
									</div>
								</div>
							))}
						</div>

						{jobPosts.length > 3 && (
							<div className="mx-auto mt-8 w-[150px]">
								<button
									className="rounded-sm border-2 py-2 px-4 text-center hover:bg-yellow"
									onClick={() => navigate('/job-posts')}
								>
									Xem thêm
								</button>
							</div>
						)}
					</div>
				</>
			)}

			<section className= "mt-20 flex flex-col bg-white gap-y-10 sm:gap-y-8 lg:gap-y-28">
				<h2
					className="mx-auto mt-8 text-2xl sm:text-2xl md:text-4xl font-bold text-center"
					data-aos="fade-down"
					data-aos-offset="200"
				>
					Ưu tiên trải nghiệm người dùng lên hàng đầu
				</h2>

				<h3 
					className="relative flex flex-col max-w-6xl mx-auto md:flex-row py-8 px-8 sm:px-4 md:px-16 lg:px-32 items-center justify-between rounded-lg"
					data-aos="fade-up-right"
					data-aos-offset="400"
				>
					<div className="text-4xl sm:text-3xl md:text-5xl lg:text-7xl font-semibold relative text-primary w-full md:w-[800px]">
						Nhanh chóng
						<div className="text-2xl sm:text-xl md:text-3xl lg:text-4xl font-bold mt-4 text-black">
							{benefit[0].name}
						</div>
						<div className="mt-4 md:ml-8 sm:ml-4 md:ml-16 text-base font-normal w-full text-gray text-justify">
							{benefit[0].text}
						</div>
					</div>
					<div className="mt-10 md:mt-0">
						<img
							src={benefit[0].image}
							alt="Time Icon"
							className="w-32 lg:w-40 h-auto animate-bounce"
						/>
					</div>
				</h3>

				<h3
					className="relative flex flex-col max-w-6xl mx-auto md:flex-row-reverse py-8 px-8 sm:px-4 md:px-16 lg:px-32 items-center justify-between bg-white rounded-lg"
					data-aos="fade-up-left"
					data-aos-offset="400"
				>
					<div className="text-4xl sm:text-3xl md:text-5xl lg:text-7xl font-semibold relative text-primary w-full md:w-[800px]">
						Rõ ràng
						<div className="text-2xl sm:text-xl md:text-3xl lg:text-4xl font-bold mt-4 text-black">
							{benefit[1].name}
						</div>
						<div className="mt-4 md:ml-8 sm:ml-4 md:ml-16 text-base font-normal w-full text-gray text-justify">
							{benefit[1].text}
						</div>
					</div>
					<div className="mt-10 md:mt-0">
						<img
							src={benefit[1].image}
							alt="Clarity Icon"
							className="w-32 lg:w-40 h-auto animate-bounce"
						/>
					</div>
				</h3>

				<h3
					className="relative flex flex-col max-w-6xl mx-auto md:flex-row py-8 px-8 sm:px-4 md:px-16 lg:px-32 items-center justify-between bg-white rounded-lg"
					data-aos="fade-up-right"
					data-aos-offset="400"
				>
					<div className="text-4xl sm:text-3xl md:text-5xl lg:text-7xl font-semibold relative text-primary w-full md:w-[800px]">
						Đa dạng
						<div className="text-2xl sm:text-xl md:text-3xl lg:text-4xl font-bold mt-4 text-black">
							{benefit[2].name}
						</div>
						<div className="mt-4 md:ml-8 sm:ml-4 md:ml-16 text-base font-normal w-full text-gray text-justify">
							{benefit[2].text}
						</div>
					</div>
					<div className="mt-10 md:mt-0">
						<img
							src={benefit[2].image}
							alt="Diversity Icon"
							className="w-32 lg:w-40 h-auto animate-bounce"
						/>
					</div>
				</h3>

				<h3
					className="relative flex flex-col max-w-6xl mx-auto md:flex-row-reverse py-8 px-8 sm:px-4 md:px-16 lg:px-32 items-center justify-between bg-white rounded-lg"
					data-aos="fade-up-left"
					data-aos-offset="400"
				>
					<div className="text-4xl sm:text-3xl md:text-5xl lg:text-7xl font-semibold relative text-primary w-full md:w-[800px]">
						An toàn
						<div className="text-2xl sm:text-xl md:text-3xl lg:text-4xl font-bold mt-4 text-black">
							{benefit[3].name}
						</div>
						<div className="mt-4 md:ml-8 sm:ml-4 md:ml-16 text-base font-normal w-full text-gray text-justify">
							{benefit[3].text}
						</div>
					</div>
					<div className="mt-10 md:mt-0">
						<img
							src={benefit[3].image}
							alt="Safety Icon"
							className="w-32 lg:w-40 h-auto animate-bounce"
						/>
					</div>
				</h3>
			</section>

			<section className="container mx-auto mt-20 px-4">
				<h2
					className="my-16 font-bold text-center"
					data-aos="fade-down"
					data-aos-offset="200"
				>
					<span className="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-primary">
						100,000+
					</span>
					<span className="text-2xl sm:text-3xl lg:text-4xl">
						{' '}
						khách hàng tin dùng Antidee
					</span>
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[30px] justify-center">
					{achievement.map((item, index) => (
						<div
							className="bg-slate-50 flex flex-col justify-center bg-white items-center gap-y-2 max-w-full h-auto rounded-md shadow-md p-4"
							data-aos="fade-left"
							data-aos-offset="400"
							data-aos-delay={300 + index * 200}
							key={index}
						>
							<img src={item.image} alt={item.name} className="w-16 h-16" />

							<span className="mt-2 text-primary text-xl sm:text-2xl font-bold">
								{item.name}
							</span>
							<p className="font-bold text-md sm:text-lg text-center">
								{item.text}
							</p>
						</div>
					))}
				</div>
			</section>

			<section className="mt-16">
				<div className="relative px-4 sm:px-12 lg:px-[12rem] flex flex-col lg:flex-row">
					<div
						className="w-full lg:w-1/2 mb-6 lg:mb-0"
						data-aos="fade-right"
						data-aos-delay="100"
						data-aos-offset="400"
					>
						<img className="w-full h-auto" src={features2} alt="" />
					</div>

					<div className="flex flex-col gap-y-4 lg:w-1/2 lg:mx-12">
						<h2
							className="text-3xl sm:text-4xl lg:text-[62px] text-primary leading-[38px] sm:leading-[52px] lg:leading-[62px] font-extrabold lg:absolute lg:top-0"
							data-aos="fade-up"
							data-aos-delay="700"
							data-aos-offset="400"
						>
							Xin chào chúng tôi là Antidee
						</h2>
						<div className="flex flex-col gap-y-4 pt-8 sm:pt-16 lg:pt-32">
							<h3 className="text-lg sm:text-xl text-start font-secondary font-medium text-four">
								Luôn sẵn sàng hỗ trợ khách hàng
							</h3>
							<span className="text-sm sm:text-lg">
								Tại Antidee, chúng tôi hiểu rằng cuộc sống bận rộn và công việc
								hàng ngày có thể khiến bạn không có đủ thời gian và năng lượng
								để chăm sóc ngôi nhà của mình. Chính vì vậy, chúng tôi tự hào
								mang đến dịch vụ dọn dẹp nhà chuyên nghiệp và tận tâm nhất...
							</span>
						</div>
					</div>
				</div>

				<div className="relative px-4 sm:px-12 lg:px-[12rem] mt-16 flex flex-col lg:flex-row">
					<div className="flex flex-col justify-center w-full lg:w-1/2 mb-6 lg:mb-0">
						<div className="flex flex-col gap-y-4 justify-center">
							<h3 className="text-lg sm:text-xl font-secondary font-medium">
								Sự hài lòng của khách hàng là niềm vinh hạnh của chúng tôi
							</h3>
							<span className="text-sm sm:text-lg">
								Tại đây, chúng tôi không chỉ đơn thuần là mang lại sự sạch sẽ
								cho ngôi nhà của bạn, mà còn tạo ra một trải nghiệm dịch vụ hoàn
								hảo từ đầu đến cuối...
							</span>

							<div
								className="text-xl font-bold hover:text-primary cursor-pointer"
								onClick={() => setIsOpenCreateAppFeedback(true)}
							>
								<PiArrowBendDownRightBold
									size={40}
									className="inline-block animate-bounce mr-2"
								/>
								Liên Hệ với chúng tôi nếu bạn cần hỗ trợ !!!
							</div>
						</div>
					</div>
					<div
						className="w-full lg:w-1/2 ml-0 lg:ml-10"
						data-aos="fade-left"
						data-aos-offset="400"
					>
						<img className="w-full h-auto" src={features3} alt="" />
					</div>
				</div>
			</section>
		</div>
	);
};
