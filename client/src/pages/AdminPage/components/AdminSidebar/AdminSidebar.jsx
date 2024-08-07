import {
  BiHomeAlt,
  BiGridAlt,
  BiCreditCardAlt,
  BiUser,
  BiCalculator,
  BiNotification,
  BiMessage,
  BiVideo
} from "react-icons/bi";
import { BsTicket } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";
import { Link, useLocation } from 'react-router-dom'
import { MdCleaningServices, MdOutlineQuestionMark } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";
import { RiDiscountPercentLine } from "react-icons/ri";

export default function AdminSidebar() {
  const location = useLocation();

  const menu = [
    { name: "Trang Chủ", icon: <BiHomeAlt />, to: '/' },
    { name: "Dashboard", icon: <LuLayoutDashboard />, to: '/admin-dashboard' },
    { name: "Sự kiện khuyến mãi", icon: <RiDiscountPercentLine />, to: '/admin-promotion' },
    { name: "Đề thi", icon: <IoNewspaperOutline />, to: '/admin-exam' },
    { name: "Ngân hàng câu hỏi", icon: <MdOutlineQuestionMark />, to: '/admin-question' },
    { name: "Các chứng chỉ", icon: <BiCreditCardAlt />, to: '/admin-qualification' },
    { name: "Thông Báo", icon: <BiNotification />, to: '' },
    { name: "Dịch vụ", icon: <MdCleaningServices />, to: '/admin-service' },
    { name: "Tin Nhắn", icon: <BiMessage />, to: '/admin-appfeedback' },
    { name: "Vouchers", icon:<BsTicket/>, to: '/admin-voucher'},
    { name: "Video", icon:<BiVideo/>, to: '/admin-video'},
    { name: "Tài Khoản", icon:<BiUser/>, to: '/admin-account'},
    { name: "Xét duyệt", icon:<TbReportSearch/>, to: '/admin-role'},
  ];

  return (
    <div className="border-r border-opacity-50 border-gray w-64 px-9 pt-5">
      <div className="flex flex-row">
        <div className="text-primary font-bold logo-text pt-1">Antidee</div>
      </div>

      <div className="mt-5 pb-5 border-t border-opacity-50 border-gray"></div>

      <div className="space-y-20">
        <div>
          <ul className="space-y-5">
            <div className="mb-4 font-semibold">Menu</div>
            {menu.map((item, index) => {
              return (
                <li key={index}>
                  <Link className={`flex flex-row items-center text-gray hover:text-primary group ${location.pathname === item.to && 'text-primary'}`} to={item.to}>
                    <div className="mr-3">{item.icon}</div>
                    <div><span>{item.name}</span></div>
                    <span className="absolute w-1.5 h-8 bg-primary rounded-r-full left-0 scale-y-0 -translate-x-full group-hover:scale-y-100 group-hover:translate-x-0 ease-in-out" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}