import React, { useEffect, useRef, useState } from "react";
import "./HomePage.css";
import { FiSearch } from "react-icons/fi";
import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../components";
import { getAllServices } from "../../features/services/serviceSlice";
import { useNavigate } from "react-router-dom";
import { useTypewriter } from "react-simple-typewriter";
import { FaArrowUp } from "react-icons/fa";
import Marquee from "react-fast-marquee";

export const HomePage = () => {
  const [services, setServices] = useState([]);
  const topRef = useRef();
  const { isLoading } = useSelector((state) => state.services);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  async function initiateServices() {
    let output = await dispatch(getAllServices());

    setServices(output.payload);
  }

  useEffect(() => {
    initiateServices();
  }, []);

  const [typeEffect] = useTypewriter({
    words: ["Việc gì khó có Antidee lo"],
    loop: {},
    typeSpeed: 100,
    deleteSpeed: 40,
  });

  const scrolLWithUseRef = () => {
    topRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
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
      <div>
        <div
          className="bg-primary p-8 text-white  mx-auto rounded-[20px] mt-20 relative"
          style={{ maxWidth: "1255px", height: "292px" }}
          ref={topRef}
        >
          <p className="text-center mt-6">
            <span className="text-white opacity-50 text-5xl">{typeEffect}</span>
          </p>

          <div
            className="absolute top-32 left-72 bg-white flex items-center rounded-2xl "
            style={{ height: "70px", width: "700px" }}
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
                      style={{ fontSize: "15px" }}
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
      <div className="mt-20">
        <div className="flex ml-20 mt-4 grid grid-cols-2 gap-10">
          <div>
            <img src="/image/giupdo.png" className="w-[640px] h-[430px] ml-9" />
          </div>
          <div>
            <p className="" style={{ color: "#562A0E", fontSize: "30px" }}>
              Chúng tôi luôn sẵn lòng giúp đỡ bạn
            </p>
            <span className="text-black">
              Nếu có bất kì thắc mắc gì, bạn liên hệ với chúng tôi thông qua -{" "}
            </span>
            <a
              style={{
                color: "#562A0E",
                fontSize: "12px",
                textDecoration: "underline",
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
