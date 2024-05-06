import {
  BiHomeAlt,
  BiGridAlt,
  BiCreditCardAlt,
  BiUser,
  BiCalculator,
  BiNotification,
  BiMessage,
  BiSupport,

} from "react-icons/bi";
import { BsTicket } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from 'react-router-dom'

export default function AdminSidebar() {
  const menu = [
    { name: "Trang Chủ", icon: <BiHomeAlt />, to: '/' },
    { name: "Sự kiện khuyến mãi", icon: <BiGridAlt />, to: '' },
    { name: "Đề thi", icon: <BiCreditCardAlt />, to: '/admin-exam' },
    { name: "Ngân hàng câu hỏi", icon: <BiUser />, to: '/admin-question' },
    { name: "Tính Toán Chi Phí", icon: <BiCalculator />, to: '' },
    { name: "Thông Báo", icon: <BiNotification />, to: '' },
    { name: "Tin Nhắn", icon: <BiMessage />, to: '' },
    { name: "Vouchers", icon:<BsTicket/>, to: '/admin-voucher'},
  ];

  const menuBottom = [
    { name: "Hỗ Trợ", icon: <BiSupport /> },
    { name: "Cài Đặt", icon: <IoSettingsOutline /> },
  ];

  return (
    <div className="h-screen border-r border-opacity-50 border-gray w-64 px-9 pt-5">
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
                  <Link className="flex flex-row items-center text-gray hover:text-primary group" to={item.to}>
                    <div className="mr-3">{item.icon}</div>
                    <div><span>{item.name}</span></div>
                    <span className="absolute w-1.5 h-8 bg-primary rounded-r-full left-0 scale-y-0 -translate-x-full group-hover:scale-y-100 group-hover:translate-x-0 ease-in-out" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <ul className="space-y-5">
            <div className="mb-4 font-semibold">Mở Rộng</div>
            {menuBottom.map((item, index) => {
              return (
                <li key={index}>
                  <button className="flex flex-row items-center text-gray hover:text-primary group">
                    <div className="mr-3">{item.icon}</div>
                    <div><span>{item.name}</span></div>
                    <span className="absolute w-1.5 h-8 bg-primary rounded-r-full left-0 scale-y-0 -translate-x-full group-hover:scale-y-100 group-hover:translate-x-0 ease-in-out" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}