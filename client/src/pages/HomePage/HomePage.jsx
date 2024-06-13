import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import { FiSearch } from "react-icons/fi";
import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";
import { CreateAppFeedback } from "./AppFeedback/AppFeedbackPage";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Parallax, Autoplay } from "swiper/modules";
import { useDispatch } from "react-redux";
import { getAllAppFeedbacks } from "../../features/appFeedbacks/appFeedbackSlice";
import quoteleft from "../../assets/img/quote-left.png";
import quoteright from "../../assets/img/quote-right.png";
import choi from "../../assets/img/choi.png";
import arow from "../../assets/img/arow.png";

export const HomePage = () => {
  const [isOpenCreateAppFeedback, setIsOpenCreateAppFeedback] = useState(false);
  const [appFeedbacks, setAppFeedbacks] = useState([]);
  const [services, setServices] = useState([
    { name: "Tổng vệ sinh", image: "image/tongvesinh.png" },
    { name: "Đi chợ", image: "image/dicho.png" },
    { name: "Nấu ăn gia đình", image: "image/nauangiadinh.png" },
    { name: "Giặt ủi", image: "image/giatui.png" },
    { name: "Trông trẻ tại nhà", image: "image/trongtre.png" },
  ]);

  const dispatch = useDispatch();

  const get5AppFeedbacks = async () => {
    const output = await dispatch(getAllAppFeedbacks());
    setAppFeedbacks(output.payload.slice(0, 5));
  };

  useEffect(() => {
    get5AppFeedbacks();
  }, []);
  const benefit = [
    {
      name: "Đặt lịch nhanh chóng",
      image: "image/time.png",
      text: "Thao tác 60 giây trên ứng dụng, có ngay người giúp việc sau 60 phút",
    },
    {
      name: "Giá cả rõ ràng",
      image: "image/money.png",
      text: "Giá cả dịch vụ trên ứng dụng hiển thị rõ ràng, bạn không cần trả thêm bất kì khoản chi phí nào",
    },
    {
      name: "Đa dạng dịch vụ",
      image: "image/dadang.png",
      text: "Antidee sẵn sàng hỗ trợ mọi nhu cầu việc nhà của bạn",
    },
    {
      name: "An toàn tối đa",
      image: "image/baove.png",
      text: "Người làm uy tín, luôn có hồ sơ lý lịch rõ ràng và được công ty giám sát trong suốt quá trình làm việc ",
    },
  ];
  const achievement = [
    { name: "97%", image: "image/nguoi.png", text: "Khách hàng hài lòng" },
    {
      name: "3,600,000",
      image: "image/tich.png",
      text: "Công việc được hoàn thành",
    },
    { name: "11,500,000+", image: "image/dongho.png", text: "Giờ làm việc" },
  ];
  const handleNextService = () => {
    setServices((prevServices) => {
      const lastService = prevServices[prevServices.length - 1];
      const newServices = prevServices.filter(
        (_, index) => index !== prevServices.length - 1
      );
      return [lastService, ...newServices];
    });
  };

  const handlePreviousService = () => {
    setServices((prevServices) => {
      const firstService = prevServices[0];
      const newServices = prevServices.filter((_, index) => index !== 0);
      return [...newServices, firstService];
    });
  };

  return (
    <>
      {isOpenCreateAppFeedback && (
        <CreateAppFeedback
          setIsOpenCreateAppFeedback={setIsOpenCreateAppFeedback}
        />
      )}
      <div>
        <div
          className="bg-primary p-8 text-white  mx-auto rounded-[20px] mt-20"
          style={{ maxWidth: "1255px", height: "292px" }}
        >
          <p className="text-center mt-6">
            <span className="text-white opacity-50 text-5xl">
              Việc gì khó, có{" "}
            </span>
            <span className="text-white text-6xl font-bold">Antidee</span>
            <span className="text-white opacity-50 text-5xl"> lo</span>
          </p>

          <div
            className="mt-4 bg-white flex items-center mx-auto rounded-2xl "
            style={{ maxWidth: "700px", height: "70px" }}
          >
            <input
              type="text"
              placeholder="Dịch vụ bạn cần tìm ..."
              className="py-0.5 pl-5 rounded-l focus:outline-none placeholder-gray "
            />
            <button
              className="bg-primary rounded-[15px] mr-4"
              style={{ maxWidth: "53px", height: "53px" }}
            >
              <FiSearch
                className="mx-auto"
                style={{ width: "33px", height: "33px" }}
              />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <p
          className="ml-[120px] mt-7"
          style={{ color: "#562A0E", fontSize: "30px" }}
        >
          Dịch vụ hàng đầu
        </p>
        <div className="flex justify-center mt-4 ml-[25px]">
          <div className="mt-[110px]">
            <div
              className=" inline-block p-2 rounded-full "
              style={{ backgroundColor: "#F9F6F6" }}
              onClick={handlePreviousService}
            >
              <SlArrowLeft className="hover:cursor-pointer" />
            </div>
          </div>
          {services.map((service, index) => (
            <div
              key={index}
              className="mx-4 transition duration-300 ease-in-out transform hover:scale-110 border-gray-300 shadow-2xl rounded-[15px] hover:cursor-pointer"
            >
              <div className="p-4">
                <p className=" mb-3 text-primary text-lg font-bold opacity-80 mt-1">
                  {service.name}
                </p>
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-[175px] h-[155px] object-cover rounded-lg "
                />
              </div>
            </div>
          ))}
          <div className="mt-[110px]">
            <div
              className=" inline-block p-2 rounded-full"
              style={{ backgroundColor: "#F9F6F6" }}
              onClick={handleNextService}
            >
              <SlArrowRight className="hover:cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <p
          className="ml-[120px] mt-7"
          style={{ color: "#562A0E", fontSize: "30px" }}
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
          style={{ color: "#562A0E", fontSize: "30px" }}
        >
          100,000+
        </span>
        <span className="mt-7" style={{ color: "#562A0E", fontSize: "30px" }}>
          {" "}
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

      <div className="justify-center w-auto ">
	  <p
          className="ml-[120px] mt-7"
          style={{ color: "#562A0E", fontSize: "30px" }}
        >
          Đánh giá từ khách hàng về trang web
        </p>
        <Swiper
		 modules={[EffectCoverflow]}
          effect={"coverflow"}
          centeredSlides={true}
          slidesPerView={"auto"}
		  watchSlidesProgress={true}
          loop={true}
		//   speed={600}
		//   autoplay={{delay: 5000}}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          className="mySwiper p-10 "
        >
          {appFeedbacks?.map((appFeedback) => {
            return (
              <SwiperSlide className="shadow-md w-1/2">
                <div className=" ">
                  <h1 className="font-semibold text-lg">
                    Tên: {appFeedback.name}
                  </h1>
                  <div className="">
                    <h2>Địa chỉ email: {appFeedback.email}</h2>
                    <h2>Số điện thoại: {appFeedback.phoneNumber}</h2>
                  </div>
                  <div className="flex justify-center text-center">
                    <img className="w-5" src={quoteleft} />
                    <span className="px-3">{appFeedback.description}</span>
                    <img className="w-5" src={quoteright} />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <div className="mt-20">
        <div className="flex ml-20 mt-4 grid grid-cols-2 gap-10">
          <div>
            <img src={choi} className="img-action w-[550px] h-[400px] ml-9" />
          </div>
          <div>
            <p className="" style={{ color: "#562A0E", fontSize: "30px" }}>
              Chúng tôi luôn sẵn lòng giúp đỡ bạn
            </p>
            <span className="text-black">
              Nếu có bất kì thắc mắc gì về dịch vụ hoặc bất kì vấn đề liên quan đến trang web, bạn liên hệ với chúng tôi thông qua dưới đây
            </span>
			<div className="flex">
            <Link className="pt-2"
              style={{
				
                color: "#562A0E",
                fontSize: "12px",
                textDecoration: "underline",
              }}
              onClick={() => setIsOpenCreateAppFeedback(true)}
            >
              <span>Nhận hỗ trợ </span> 
            </Link>
			<img src={arow} className="arow w-20"/>
			</div>
          </div>
        </div>
      </div>
    </>
  );
};
