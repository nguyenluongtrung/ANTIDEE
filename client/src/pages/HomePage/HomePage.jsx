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
		AOS.init({
			//   offset: 400,
			duration: 600,
			easing: 'ease-in-out', // Loại easing cho hiệu ứng
			delay: 50, // Độ trễ trước khi hiệu ứng bắt đầu (ms)
			once: true, // Chỉ chạy hiệu ứng một lần khi cuộn xuống
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
		<div className="">
			<div
				className="fixed mr-3 mb-10 rounded-full p-5 hover:cursor-pointer bottom-0 right-10 bg-light_purple hover:border-0 hover:opacity-80"
				onClick={scrolLWithUseRef}
				style={{zIndex: '10000'}}
			>
				<FaArrowUp className="text-pink" />
			</div>
			<main
				className="w-full h-full relative px-20 py-9 bg-hero text-white"
				ref={topRef}
			>
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
								<div
									className="flex items-center justify-center p-3 bg-primary rounded-lg w-[220px] text-center text-white font-bold cursor-pointer fea-item hover:bg-primary_dark"
									onClick={scrolLWithServiceRef}
								>
									Khám phá ngay
									<FaAngleRight size={30} className="" />
								</div>
							</div>
						</div>
					</section>
					<section className="relative w-full lg:w-[50%] flex  items-center  justify-center p-10 ">
						<div className="container relative left-32">
							<div className="blob">
								<img
									src="image/chi_dep.png"
									alt="Hero Image"
									className="absolute h-[90%] w-full object-cover bottom-0"
								/>
							</div>
						</div>
					</section>
				</div>
				<div className="background absolute"></div>
			</main>

			<div className="mt-20" ref={serviceRef}>
				<div
					className="ml-[120px] mt-7 text-4xl font-bold text-center mb-16"
					data-aos="fade-down"
					data-aos-offset="200"
				>
					Các dịch vụ hàng đầu
				</div>

				<div className="flex justify-center">
					<div className=" w-[80%] " data-aos="slide-up" data-aos-offset="200">
						<Marquee autoFill pauseOnHover className="h-64">
							{services.map((service, index) => (
								<div
									key={index}
									className="mx-4 transition duration-300 ease-in-out transform hover:scale-110 border-gray-300 shadow-2xl rounded-[15px] hover:cursor-pointer"
								>
									<div className="p-4">
										<img
											src={service?.image}
											alt={service?.name}
											className="w-[175px] h-[155px] object-cover rounded-lg "
											onClick={() => navigateToServicePage(service?._id)}
										/>
										<p
											className="mt-3 text-primary font-bold opacity-80 text-center"
											style={{ fontSize: '15px' }}
										>
											{service?.name}
										</p>
									</div>
								</div>
							))}
						</Marquee>
					</div>
				</div>
			</div>

			<div className="mt-20 flex flex-col gap-y-28">
				<div
					className="ml-[120px] mt-7 text-4xl font-bold text-center"
					data-aos="fade-down"
					data-aos-offset="200"
				>
					An tâm với lựa chọn của bạn
				</div>

				<div
					className="relative flex py-8 px-32 items-center justify-between bg-white rounded-lg w-full"
					data-aos="fade-up-right"
					data-aos-offset="400"
				>
					<div className="text-8xl font-semibold relative text-primary w-[800px]">
						Nhanh chóng
						<div className="text-4xl font-bold absolute top-20 left-20 text-black">
							{benefit[0].name}
						</div>
						<div className="mt-12 ml-20 text-base font-normal w-[100%] text-gray">
							{benefit[0].text}
						</div>
					</div>
					<div className="">
						<img
							src={benefit[0].image}
							alt="Time Icon"
							className="w-40 h-auto animate-bounce"
						/>
					</div>
				</div>

				<div
					className="relative flex py-8 px-32 items-center justify-around bg-white rounded-lg w-full"
					data-aos="fade-up-left"
					data-aos-offset="400"
				>
					<div className="">
						<img
							src={benefit[1].image}
							alt="Time Icon"
							className=" ml-10 w-40 h-auto animate-bounce"
						/>
					</div>
					<div className="text-8xl font-semibold relative text-primary w-[800px]">
						Rõ ràng
						<div className="text-4xl font-bold absolute top-20 left-20 text-black">
							{benefit[1].name}
						</div>
						<div className="mt-12 ml-20 text-base font-normal w-[100%] text-gray">
							{benefit[1].text}
						</div>
					</div>
				</div>

				<div
					className="relative flex py-8 px-32 items-center justify-between bg-white rounded-lg w-full"
					data-aos="fade-up-right"
					data-aos-offset="400"
				>
					<div className="text-8xl font-semibold relative text-primary w-[800px]">
						Đa dạng
						<div className="text-4xl font-bold absolute top-20 left-20 text-black">
							{benefit[2].name}
						</div>
						<div className="mt-12 ml-20 text-base font-normal w-[100%] text-gray">
							{benefit[2].text}
						</div>
					</div>
					<div className="">
						<img
							src={benefit[2].image}
							alt="Time Icon"
							className="top-4 right-4 w-40 h-auto animate-bounce"
						/>
					</div>
				</div>

				<div
					className="relative flex py-8 px-32 items-center justify-around bg-white rounded-lg w-full"
					data-aos="fade-up-left"
					data-aos-offset="400"
				>
					<div className="">
						<img
							src={benefit[3].image}
							alt="Time Icon"
							className="ml-10 w-40 h-auto animate-pulse"
						/>
					</div>
					<div className="text-8xl font-semibold relative text-primary w-[800px]">
						An toàn
						<div className="text-4xl font-bold absolute top-20 left-20 text-black">
							{benefit[3].name}
						</div>
						<div className="mt-12 ml-20 text-base font-normal w-[100%] text-gray">
							{benefit[3].text}
						</div>
					</div>
				</div>
			</div>

			<div className="mt-20">
				<div
					className=" my-16 font-bold text-center"
					data-aos="fade-down"
					data-aos-offset="200"
				>
					<span className="font-extrabold text-4xl text-primary">100,000+</span>
					<span className="text-4xl"> khách hàng sử dụng ứng dụng Antidee</span>
				</div>

				<div className="flex justify-center grid-cols-2 lg:grid-cols-4 lg:gap-[30px]">
					{achievement.map((item, index) => {
						return (
							<div
								className="container flex flex-col justify-center items-center gap-y-2 bg-slate-50 max-w-[292px] h-[220px] m-3 rounded-md shadow-md"
								data-aos="fade-left"
								data-aos-offset="400"
								data-aos-delay={300 + index * 200}
								key={index}
							>
								<img src={item.image} alt={item.name} className="size-16" />

								<h4 className="mt-2 text-primary text-2xl font-bold">
									{item.name}
								</h4>
								<p className="font-bold text-lg">{item.text}</p>
							</div>
						);
					})}
				</div>
			</div>

			<div className="mt-16">
				<div className="relative px-60 flex">
					<div
						className="w-1/2"
						data-aos="fade-right"
						data-aos-delay="100"
						data-aos-offset="400"
					>
						<img className="" src={features2} alt="" />
					</div>

					<div className=" flex flex-col gap-y-4 bottom-1 w-1/2 mx-12">
						<h1
							className="absolute text-[62px] text-primary leading-[62px] font-extrabold top-0 left-[600px] w-[600px]"
							data-aos="fade-up"
							data-aos-delay="700"
							data-aos-offset="400"
						>
							Xin chào chúng tôi là Antidee
						</h1>
						<div className="flex flex-col gap-y-4 pt-32">
							<h2 className="text-xl text-start font-secondary font-medium text-four">
								Luôn sẵn sàng hỗ trợ khách hàng
							</h2>
							<span className="text-lg">
								Tại Antidee, chúng tôi hiểu rằng cuộc sống bận rộn và công việc
								hàng ngày có thể khiến bạn không có đủ thời gian và năng lượng
								để chăm sóc ngôi nhà của mình. Chính vì vậy, chúng tôi tự hào
								mang đến dịch vụ dọn dẹp nhà chuyên nghiệp và tận tâm nhất. Đội
								ngũ nhân viên của chúng tôi đều được đào tạo kỹ lưỡng, có lý
								lịch rõ ràng và luôn cam kết mang lại không gian sống sạch sẽ,
								thoáng mát cho bạn và gia đình. Dù bạn cần dọn dẹp nhà cửa hàng
								tuần, vệ sinh tổng thể hay chỉ là một số công việc nhỏ lẻ, chúng
								tôi luôn sẵn sàng hỗ trợ bạn một cách nhanh chóng và hiệu quả
								nhất.
							</span>
						</div>
					</div>
				</div>
				<div className="relative px-60 mt-16 flex">
					<div className=" flex flex-col justify-center w-1/2">
						<div className="flex flex-col gap-y-4 justify-center">
							<h2 className="text-xl font-secondary font-medium">
								Sự hài lòng của khách hàng là niềm vinh hạnh của chúng tôi
							</h2>
							<span className="text-lg ">
								Tại đây, chúng tôi không chỉ đơn thuần là mang lại sự sạch sẽ
								cho ngôi nhà của bạn, mà còn tạo ra một trải nghiệm dịch vụ hoàn
								hảo từ đầu đến cuối. Trang web của chúng tôi được thiết kế thân
								thiện và dễ sử dụng, giúp bạn dễ dàng đặt lịch, quản lý các yêu
								cầu dịch vụ và theo dõi tiến độ công việc chỉ trong vài bước đơn
								giản. Với sự đa dạng trong các gói dịch vụ, từ dọn dẹp thường
								xuyên đến vệ sinh công nghiệp, chúng tôi luôn sẵn sàng đáp ứng
								mọi nhu cầu của bạn. Hãy để chúng tôi trở thành người bạn đồng
								hành tin cậy trong việc chăm sóc tổ ấm của bạn, mang lại cho bạn
								nhiều thời gian hơn để tận hưởng cuộc sống.
							</span>

							<div className="text-xl font-bold hover:text-primary animate-bounce cursor-pointer">
								<PiArrowBendDownRightBold
									size={60}
									className="absolute -bottom-3 -left-20 animate-bounce"
								/>
								Liên Hệ với chúng tôi nếu bạn cần hỗ trợ !!!
							</div>
						</div>
					</div>
					<div
						className="w-1/2 ml-10"
						data-aos="fade-left"
						data-aos-offset="400"
					>
						<img className="" src={features3} alt="" />
					</div>
				</div>
			</div>
		</div>
	);
};
