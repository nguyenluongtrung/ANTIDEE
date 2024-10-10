import React, { useEffect, useRef, useState } from 'react';
import './HomePage.css';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../components';
import { getAllServices } from '../../features/services/serviceSlice';
import { useNavigate } from 'react-router-dom';
import { FaAngleRight, FaArrowUp } from 'react-icons/fa';
import Marquee from 'react-fast-marquee';
import AOS from 'aos';
import { PiArrowBendDownRightBold } from 'react-icons/pi';
import features2 from '../../assets/img/features2.jpg';
import features3 from '../../assets/img/features3.jpg';
import { getAllJobPosts } from '../../features/jobPosts/jobPostsSlice';
import {
	formatDate,
	formatWorkingTime,
	getCurrentTimeString,
} from '../../utils/format';
import { JobPostDetail } from '../JobPostListPage/JobPostDetail/JobPostDetail';
import PromotionPage from './Promotion/PromotionPage';

export const HomePage = () => {
	const [services, setServices] = useState([]);
	const [jobPosts, setJobPosts] = useState([]);
	const [isOpenJobPostDetail, setIsOpenJobPostDetail] = useState(false);
	const topRef = useRef();
	const serviceRef = useRef();
	const { isLoading } = useSelector((state) => state.services);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const benefit = [
		{
			name: 'Đặt lịch nhanh chóng',
			image: 'image/time.png',
			text: ' Thao tác chỉ mất 60 giây trên ứng dụng, giúp bạn dễ dàng đặt lịch hẹn với người giúp việc chuyên nghiệp. Sau khi hoàn tất đặt lịch, chỉ trong vòng 60 phút, người giúp việc sẽ có mặt tại nhà bạn, sẵn sàng hỗ trợ và làm sạch không gian sống của bạn một cách nhanh chóng và hiệu quả.',
		},
		{
			name: 'Giá cả rõ ràng',
			image: 'image/money.png',
			text: 'Giá cả dịch vụ trên ứng dụng hiển thị rõ ràng, bạn không cần trả thêm bất kỳ khoản chi phí nào. Tất cả các khoản phí đều được minh bạch và chi tiết, giúp bạn yên tâm sử dụng dịch vụ mà không lo ngại về các chi phí ẩn. Chúng tôi cam kết cung cấp cho bạn những thông tin chính xác và trung thực về giá cả ngay từ đầu, đảm bảo bạn nhận được giá trị dịch vụ đúng với số tiền bỏ ra.',
		},
		{
			name: 'Đa dạng dịch vụ',
			image: 'image/dadang.png',
			text: 'Antidee sẵn sàng hỗ trợ mọi nhu cầu việc nhà của bạn. Từ dọn dẹp nhà cửa, giặt là, nấu ăn đến chăm sóc cây cảnh và thú cưng, chúng tôi cung cấp một loạt các dịch vụ đa dạng để đáp ứng mọi yêu cầu của bạn. Sự đa dạng và linh hoạt trong dịch vụ giúp bạn tiết kiệm thời gian và tận hưởng cuộc sống tiện nghi hơn.',
		},
		{
			name: 'An toàn tối đa',
			image: 'image/baove.png',
			text: 'Người làm uy tín, luôn có hồ sơ lý lịch rõ ràng và được công ty giám sát trong suốt quá trình làm việc. Chúng tôi hiểu rằng an toàn và tin cậy là yếu tố hàng đầu khi lựa chọn dịch vụ giúp việc nhà. Vì vậy, tất cả nhân viên của chúng tôi đều phải trải qua quy trình kiểm tra nghiêm ngặt và được đào tạo bài bản. Hơn nữa, chúng tôi luôn theo dõi và đánh giá hiệu suất làm việc của họ để đảm bảo bạn nhận được dịch vụ tốt nhất và an toàn nhất.',
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

	useEffect(() => {
		initiateJobPosts();
	}, []);

	async function initiateJobPosts() {
		let output = await dispatch(getAllJobPosts());
		console.log(output);
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
				})
				?.filter((jobPost) => {
					const createdDate = new Date(jobPost.createdAt);
					const currentDate = new Date();
					const thirtyMinutesInMs = 30 * 60 * 1000;
					const createdDatePlus30Minutes = new Date(
						createdDate.getTime() + thirtyMinutesInMs
					);
					if (
						jobPost.isChosenYourFav === true &&
						currentDate <= createdDatePlus30Minutes
					) {
						if (
							accounts
								.find((acc) => String(acc._id) === String(jobPost.customerId))
								?.favoriteList?.find(
									(fav) => String(fav.domesticHelperId) === String(account._id)
								)
						) {
							return true;
						}
					} else {
						return true;
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
			<div
				className="fixed right-4 sm:right-6 md:right-8 lg:right-10 bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 rounded-full p-3 sm:p-4 md:p-5 bg-light_purple hover:cursor-pointer hover:opacity-80"
				onClick={scrolLWithUseRef}
				style={{ zIndex: 10000 }}
			>
				<FaArrowUp className="text-pink text-xl sm:text-2xl md:text-3xl" />
			</div>


			<main
				className="w-full h-full relative px-5 md:px-10 lg:px-20 py-9 bg-hero text-white"
				ref={topRef}
			>
				<div className="flex flex-col-reverse lg:flex-row mt-8 md:mt-16">
					<section className="w-full lg:w-[50%] flex flex-col lg:translate-x-10 p-5 lg:p-10">
						<div className="w-full h-auto lg:pt-7">
							<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-yellow font-extrabold">
								Cùng Antidee
							</h1>
							<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-primary font-extrabold">
								nâng tầm
							</h1>
							<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary_dark font-extrabold">
								chất lượng cuộc sống
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
					</section>

					<section className="relative w-full lg:w-[50%] flex items-center justify-center p-5 lg:p-10">
						<div className="container relative lg:left-32">
							<div className="blob">
								<img
									src="image/chi_dep.png"
									alt="Hero Image"
									className="absolute h-[70%] md:h-[80%] lg:h-[90%] w-full object-cover bottom-0"
								/>
							</div>
						</div>
					</section>
				</div>
				<div className="background absolute"></div>
			</main>

			<PromotionPage />

			<div className="py-10 sm:py-16 lg:py-20 bg-white md:mt-0 mt-72" ref={serviceRef}>
				<div
					className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-10 sm:mb-12 lg:mb-16"
					data-aos="fade-down"
					data-aos-offset="200"
				>
					Các dịch vụ hàng đầu
				</div>

				<div className="flex justify-center">
					<div className="w-[90%] sm:w-[85%] lg:w-[80%]" data-aos="slide-up" data-aos-offset="200">
						<Marquee autoFill pauseOnHover className="h-52 sm:h-56 lg:h-64 rounded-lg bg-white">
							{services?.map((service, index) => (
								<div
									key={index}
									className="mx-2 sm:mx-4 transition duration-300 ease-in-out transform hover:scale-110 border-gray-300 shadow-2xl rounded-[10px] sm:rounded-[12px] lg:rounded-[15px] hover:cursor-pointer"
								>
									<div className="p-3 sm:p-4">
										<img
											src={service?.image}
											alt={service?.name}
											className="w-[120px] h-[110px] sm:w-[150px] sm:h-[130px] lg:w-[175px] lg:h-[155px] object-cover rounded-lg"
											onClick={() => navigateToServicePage(service?._id)}
										/>
										<p className="mt-2 sm:mt-3 text-primary font-bold opacity-80 text-center text-xs sm:text-sm lg:text-base">
											{service?.name}
										</p>
									</div>
								</div>
							))}
						</Marquee>
					</div>
				</div>
			</div>




			<div className="mt-20 px-4 md:px-16 lg:px-28">
				<div
					className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-10"
					data-aos="fade-down"
					data-aos-offset="200"
				>
					Công việc dành cho bạn
				</div>

				<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
					{jobPosts.slice(0, 3)?.map((post) => (
						<div
							className={`shadow-xl p-5 hover:shadow-2xl hover:cursor-pointer relative bg-super_light_purple ${post?.isUrgent && 'bg-light_pink'}`}
							style={{ height: '350px' }}
						>
							<p className="text-brown font-bold mb-3">
								{post?.serviceId?.name?.toUpperCase()}
							</p>
							{post?.isUrgent && (
								<div className="triangle-down absolute top-0 right-0"></div>
							)}
							<p className="text-gray mb-2">
								Bắt đầu lúc: <span className="text-brown">{formatDate(post?.workingTime?.startingDate)} {formatWorkingTime(post?.workingTime?.startingHour)}</span>
							</p>
							<p className="text-gray mb-2">
								Hết hạn lúc: <span className="text-brown">{formatDate(post?.dueDate)}</span>
							</p>
							<div className="border-2 border-gray my-3">
								{post?.workload?.find((option) => String(option?.optionName) === 'Thời gian') == undefined ? (
									<div>
										<p className="text-gray mb-2 text-center mt-3">Số tiền:</p>
										<p className="text-center text-brown font-bold mb-3">
											{Intl.NumberFormat().format(post?.totalPrice)} VND
										</p>
									</div>
								) : (
									<div className="grid grid-cols-2">
										<div className="border-r-2 border-gray">
											<p className="text-gray mb-2 text-center mt-3">Làm trong:</p>
											<p className="text-center text-brown font-bold mb-3">
												{post?.workload?.find((option) => String(option?.optionName) === 'Thời gian')?.optionValue} giờ
											</p>
										</div>
										<div>
											<p className="text-gray mb-2 text-center mt-3">Số tiền:</p>
											<p className="text-center text-brown font-bold mb-3">
												{Intl.NumberFormat().format(post?.totalPrice)} VND
											</p>
										</div>
									</div>
								)}
							</div>
							<p className="text-gray mb-2">
								Tại: <span className={`text-black ${!JSON.parse(localStorage.getItem('account')) && 'blur-text'}`}>{post?.contactInfo?.address}</span>
							</p>
							<p className="text-gray mb-3">
								Ghi chú: <span className="text-black">{post?.note || 'Không có'}</span>
							</p>
							<div className="flex flex-col items-center absolute bottom-5 left-1/2 transform -translate-x-1/2 w-full">
								<button
									className="mt-5 text-white bg-brown rounded-2xl text-xs py-2.5 w-3/4 text-center hover:bg-light_yellow hover:text-brown"
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


			<div className="mt-20 flex flex-col bg-white gap-y-16 sm:gap-y-8 lg:gap-y-28">
				<div
					className="mx-auto mt-8 text-2xl sm:text-2xl md:text-4xl font-bold text-center"
					data-aos="fade-down"
					data-aos-offset="200"
				>
					An tâm với lựa chọn của bạn
				</div>

				<div
					className="relative flex flex-col md:flex-row py-8 px-8 sm:px-4 md:px-16 lg:px-32 items-center justify-between ml-4 mr-4 md:ml-10 md:mr-10 rounded-lg"
					data-aos="fade-up-right"
					data-aos-offset="400"
				>
					<div className="text-4xl sm:text-3xl md:text-5xl lg:text-8xl font-semibold relative text-primary w-full md:w-[800px]">
						Nhanh chóng
						<div className="text-2xl sm:text-xl md:text-3xl lg:text-4xl font-bold mt-4 text-black">
							{benefit[0].name}
						</div>
						<div className="mt-4 ml-8 sm:ml-4 md:ml-16 text-base font-normal w-full text-gray text-justify">
							{benefit[0].text}
						</div>
					</div>
					<div className="mt-6 md:mt-0">
						<img
							src={benefit[0].image}
							alt="Time Icon"
							className="w-24 sm:w-20 md:w-32 lg:w-40 h-auto animate-bounce"
						/>
					</div>
				</div>

				<div
					className="relative flex flex-col md:flex-row-reverse py-8 px-8 sm:px-4 md:px-16 lg:px-32 items-center justify-between ml-4 mr-4 md:ml-10 md:mr-10 bg-white rounded-lg"
					data-aos="fade-up-left"
					data-aos-offset="400"
				>
					<div className="text-4xl sm:text-3xl md:text-5xl lg:text-8xl font-semibold relative text-primary w-full md:w-[800px]">
						Rõ ràng
						<div className="text-2xl sm:text-xl md:text-3xl lg:text-4xl font-bold mt-4 text-black">
							{benefit[1].name}
						</div>
						<div className="mt-4 ml-8 sm:ml-4 md:ml-16 text-base font-normal w-full text-gray text-justify">
							{benefit[1].text}
						</div>
					</div>
					<div className="mt-6 md:mt-0">
						<img
							src={benefit[1].image}
							alt="Clarity Icon"
							className="w-24 sm:w-20 md:w-32 lg:w-40 h-auto animate-bounce"
						/>
					</div>
				</div>

				<div
					className="relative flex flex-col md:flex-row py-8 px-8 sm:px-4 md:px-16 lg:px-32 items-center justify-between ml-4 mr-4 md:ml-10 md:mr-10 bg-white rounded-lg"
					data-aos="fade-up-right"
					data-aos-offset="400"
				>
					<div className="text-4xl sm:text-3xl md:text-5xl lg:text-8xl font-semibold relative text-primary w-full md:w-[800px]">
						Đa dạng
						<div className="text-2xl sm:text-xl md:text-3xl lg:text-4xl font-bold mt-4 text-black">
							{benefit[2].name}
						</div>
						<div className="mt-4 ml-8 sm:ml-4 md:ml-16 text-base font-normal w-full text-gray text-justify">
							{benefit[2].text}
						</div>
					</div>
					<div className="mt-6 md:mt-0">
						<img
							src={benefit[2].image}
							alt="Diversity Icon"
							className="w-24 sm:w-20 md:w-32 lg:w-40 h-auto animate-bounce"
						/>
					</div>
				</div>

				<div
					className="relative flex flex-col md:flex-row-reverse py-8 px-8 sm:px-4 md:px-16 lg:px-32 items-center justify-between ml-4 mr-4 md:ml-10 md:mr-10 bg-white rounded-lg"
					data-aos="fade-up-left"
					data-aos-offset="400"
				>
					<div className="text-4xl sm:text-3xl md:text-5xl lg:text-8xl font-semibold relative text-primary w-full md:w-[800px]">
						An toàn
						<div className="text-2xl sm:text-xl md:text-3xl lg:text-4xl font-bold mt-4 text-black">
							{benefit[3].name}
						</div>
						<div className="mt-4 ml-8 sm:ml-4 md:ml-16 text-base font-normal w-full text-gray text-justify">
							{benefit[3].text}
						</div>
					</div>
					<div className="mt-6 md:mt-0">
						<img
							src={benefit[3].image}
							alt="Safety Icon"
							className="w-24 sm:w-20 md:w-32 lg:w-40 h-auto animate-pulse"
						/>
					</div>
				</div>
			</div>



			<div className="container mx-auto mt-20 px-4">
				<div
					className="my-16 font-bold text-center"
					data-aos="fade-down"
					data-aos-offset="200"
				>
					<span className="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-primary">100,000+</span>
					<span className="text-2xl sm:text-3xl lg:text-4xl"> khách hàng sử dụng ứng dụng Antidee</span>
				</div>

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

							<h4 className="mt-2 text-primary text-xl sm:text-2xl font-bold">
								{item.name}
							</h4>
							<p className="font-bold text-md sm:text-lg text-center">{item.text}</p>
						</div>
					))}
				</div>
			</div>




			<div className="mt-16">
				<div className="relative px-4 sm:px-12 lg:px-60 flex flex-col lg:flex-row">
					<div
						className="w-full lg:w-1/2 mb-6 lg:mb-0"
						data-aos="fade-right"
						data-aos-delay="100"
						data-aos-offset="400"
					>
						<img className="w-full h-auto" src={features2} alt="" />
					</div>

					<div className="flex flex-col gap-y-4 lg:w-1/2 lg:mx-12">
						<h1
							className="text-3xl sm:text-4xl lg:text-[62px] text-primary leading-[38px] sm:leading-[52px] lg:leading-[62px] font-extrabold lg:absolute lg:top-0 lg:left-[600px] lg:w-[600px]"
							data-aos="fade-up"
							data-aos-delay="700"
							data-aos-offset="400"
						>
							Xin chào chúng tôi là Antidee
						</h1>
						<div className="flex flex-col gap-y-4 pt-8 sm:pt-16 lg:pt-32">
							<h2 className="text-lg sm:text-xl text-start font-secondary font-medium text-four">
								Luôn sẵn sàng hỗ trợ khách hàng
							</h2>
							<span className="text-sm sm:text-lg">
								Tại Antidee, chúng tôi hiểu rằng cuộc sống bận rộn và công việc hàng ngày có thể khiến bạn không có đủ thời gian và năng lượng để chăm sóc ngôi nhà của mình. Chính vì vậy, chúng tôi tự hào mang đến dịch vụ dọn dẹp nhà chuyên nghiệp và tận tâm nhất...
							</span>
						</div>
					</div>
				</div>

				<div className="relative px-4 sm:px-12 lg:px-60 mt-16 flex flex-col lg:flex-row">
					<div className="flex flex-col justify-center w-full lg:w-1/2 mb-6 lg:mb-0">
						<div className="flex flex-col gap-y-4 justify-center">
							<h2 className="text-lg sm:text-xl font-secondary font-medium">
								Sự hài lòng của khách hàng là niềm vinh hạnh của chúng tôi
							</h2>
							<span className="text-sm sm:text-lg">
								Tại đây, chúng tôi không chỉ đơn thuần là mang lại sự sạch sẽ cho ngôi nhà của bạn, mà còn tạo ra một trải nghiệm dịch vụ hoàn hảo từ đầu đến cuối...
							</span>

							<div className="text-xl font-bold hover:text-primary cursor-pointer">
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
			</div>

		</div>
	);
};
