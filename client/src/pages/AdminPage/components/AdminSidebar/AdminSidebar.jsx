import {
  BiCreditCardAlt,
  BiUser,
  BiMessage,
  BiVideo
} from "react-icons/bi";
import { IoMdLogOut } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MdCleaningServices, MdOutlineQuestionMark } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";
import { RiDiscountPercentLine } from "react-icons/ri";
import { AiOutlineMessage } from "react-icons/ai";
import { logout, reset } from "../../../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { GiBookPile } from "react-icons/gi";
import { MdReport } from "react-icons/md";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menu = [
    { name: "Dashboard", icon: <LuLayoutDashboard />, to: '/admin-dashboard' },
    { name: "Sự kiện khuyến mãi", icon: <RiDiscountPercentLine />, to: '/admin-promotion' },
    { name: "Khoá học", icon: <GiBookPile />, to: '/admin-course' },
    { name: "Đề thi", icon: <IoNewspaperOutline />, to: '/admin-exam' },
    { name: "Ngân hàng câu hỏi", icon: <MdOutlineQuestionMark />, to: '/admin-question' },
    { name: "Các chứng chỉ", icon: <BiCreditCardAlt />, to: '/admin-qualification' },
    { name: "Dịch vụ", icon: <MdCleaningServices />, to: '/admin-service' },
    { name: "Phản hồi", icon: <BiMessage />, to: '/admin-appfeedback' },
    { name: "Tài Khoản", icon:<BiUser/>, to: '/admin-account'},
    { name: "Xét duyệt", icon:<TbReportSearch/>, to: '/admin-censor'},
    { name: "Video", icon:<BiVideo/>, to: '/admin-video'},
    { name: "Bài Viết Bị Báo Cáo", icon:<MdReport />, to: '/admin-report-forum'},
    { name: "Chăm sóc người dùng", icon:<AiOutlineMessage />, to: '/admin-chat'},
  ];

  const onLogout = () => {
		navigate('/home');
		dispatch(logout());
		dispatch(reset());
	};

  return (
    <div className="border-r border-opacity-50 border-gray sm:w-64 w-full px-4 sm:px-9 pt-5">
  <div className="flex flex-row">
    <div className="text-primary font-bold logo-text pt-1">Antidee</div>
  </div>

  <div className="mt-5 pb-5 border-t border-opacity-50 border-gray"></div>

  <div className="space-y-10 sm:space-y-20">
    <div>
      <ul className="space-y-3 sm:space-y-5">
        <div className="mb-2 sm:mb-4 font-semibold">Menu</div>
        {menu.map((item, index) => {
          return (
            <li key={index}>
              <Link className={`flex flex-row items-center text-gray hover:text-primary group ${location.pathname === item.to && 'text-primary'}`} to={item.to}>
                <div className="mr-2 sm:mr-3">{item.icon}</div>
                <div><span>{item.name}</span></div>
                <span className="absolute w-1.5 h-8 bg-primary rounded-r-full left-0 scale-y-0 -translate-x-full group-hover:scale-y-100 group-hover:translate-x-0 ease-in-out" />
              </Link>
            </li>
          );
        })}
        <button
          className="flex items-center justify-center text-primary hover:bg-primary hover:text-white text-center rounded-2xl p-1 sm:p-1.5 font-medium w-20 sm:w-28 border-primary border-2"
          onClick={onLogout}
        >
          <IoMdLogOut size={20} />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </ul>
    </div>
  </div>
</div>

  );
}