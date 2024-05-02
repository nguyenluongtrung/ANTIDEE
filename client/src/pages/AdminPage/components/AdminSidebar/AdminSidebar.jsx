import React from "react";
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
import { IoSettingsOutline } from "react-icons/io5";

export default function AdminSidebar() {
  const menu = [
    { name: "Trang Chủ", icon: <BiHomeAlt /> },
    { name: "Sự kiện khuyến mãi", icon: <BiGridAlt /> },
    { name: "Câu hỏi và đề thi", icon: <BiCreditCardAlt /> },
    { name: "Liên hệ", icon: <BiUser /> },
    { name: "Tính Toán Chi Phí", icon: <BiCalculator /> },
    { name: "Thông Báo", icon: <BiNotification /> },
    { name: "Tin Nhắn", icon: <BiMessage /> },
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