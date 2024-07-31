import { FaChevronRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAccountInformation } from "../../features/auth/authSlice";
import "./Sidebar.css";import { FaMoneyBillWave } from "react-icons/fa";
import { BiHomeAlt, BiGridAlt, BiCreditCardAlt, BiUser } from "react-icons/bi";
import { Link } from "react-router-dom";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { GiJourney } from "react-icons/gi";
import { MdPostAdd } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { FaRankingStar } from "react-icons/fa6";

export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true); // State for sidebar visibility
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

  const handleArrowMouseEnter = () => {
    setSidebarVisible(true);
  };

  const handleSidebarMouseLeave = () => {
    setSidebarVisible(false);
  };

  const handleClick = (item, path) => {
    setActiveItem(item);
    navigate(path);
  };

  const menu = [
    { name: "Trang Chủ", icon: <BiHomeAlt />, to: "/" },
    { name: "Tài Khoản", icon: <BiGridAlt />, to: "/my-account" },
    { name: "Mời Bạn Bè", icon: <BiCreditCardAlt />, to: "/invite-friend" },
    { name: "Ưu Đãi", icon: <BiUser />, to: "/vouchers" },
    { name: "Lịch sử giao dịch", icon: <FaMoneyBillWave />  , to: "/transaction-history" },
    {
      name: "Diễn Đàn",
      icon: <BiCreditCardAlt />,
      to: "/forum",
    },
  ];

  const menuDomestic = [
    { name: "Công Việc", icon: <MdPostAdd />, to: "/job-posts" },
    { name: "Hành Trình", icon: <GiJourney />, to: "/journey" },
    { name: "Xếp Hạng", icon: <FaRankingStar />, to: "/ranking" },
    {
      name: "Thời Tiết",
      icon: <TiWeatherPartlySunny />,
      to: "/weather-forecast",
    },
  ];

  return (
    <div className="relative h-full">
      <div
        className={`fixed top-1/2 left-0 transform -translate-y-1/2 cursor-pointer transition-transform ${
          !sidebarVisible ? "translate-x-0" : "-translate-x-32"
        }`}
        onMouseEnter={handleArrowMouseEnter}
      >
        <FaChevronRight size={24} />
      </div>
      <div
        className={`fixed top-0 -left-3 h-full  transition-transform ${
          sidebarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
        onMouseLeave={handleSidebarMouseLeave}
      >
        <div className="flex flex-col items-center justify-center h-full">
          {account &&
            menu.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`p-4 bg-white ${index === 0 && "rounded-tr-lg"}`}
                >
                  <Link
                    className={`flex flex-row items-center text-black hover:text-primary group ${
                      location.pathname === item.to && "text-primary"
                    }`}
                    to={item.to}
                  >
                    <div
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content={item.name}
                      className="mr-3"
                    >
                      {item.icon}
                    </div>
                    <Tooltip id="my-tooltip" className="custom-tooltip" />
                    <span
                      className={`absolute w-1.5 h-8 bg-primary rounded-r-full left-0 scale-y-0 -translate-x-full group-hover:scale-y-100 group-hover:translate-x-0 ease-in-out ${
                        location.pathname === item.to &&
                        "text-primary scale-y-100 translate-x-0"
                      }`}
                    />
                  </Link>
                </div>
              );
            })}

          {account?.role === "Người giúp việc" &&
            menuDomestic.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`p-4 bg-white ${
                    index === menuDomestic.length - 1 && "rounded-br-lg"
                  }`}
                >
                  <Link
                    className={`flex flex-row items-center text-black hover:text-primary group ${
                      location.pathname === item.to && "text-primary"
                    }`}
                    to={item.to}
                  >
                    <div
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content={item.name}
                      className="mr-3"
                    >
                      {item.icon}
                    </div>
                    <Tooltip id="my-tooltip" />
                    <span
                      className={`absolute w-1.5 h-8 bg-primary rounded-r-full -left-3 scale-y-0 -translate-x-full group-hover:scale-y-100 group-hover:translate-x-0 ease-in-out ${
                        location.pathname === item.to &&
                        "text-primary scale-y-100 translate-x-0"
                      }`}
                    />
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
