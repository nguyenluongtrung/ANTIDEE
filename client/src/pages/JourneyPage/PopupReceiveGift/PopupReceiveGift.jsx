// src/components/Popup.js
import React, { useState } from "react";
import Confetti from "react-confetti";

const PopupReceiveGift = ({
  isOpen,
  setIsPopupOpen,
  levelName,
  isPopupReceiveAllGift,
  setIsSuccess
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col  items-center justify-center bg-white p-8 rounded shadow-lg text-center relative">
        <div className="text-3xl font-bold mb-4">Xin Chúc Mừng!</div>
        {isPopupReceiveAllGift ? (
          <p className="mb-4 p-4 text-2xl">Bạn đã nhận tất cả các phần quà thành công!</p>
        ) : (
          <div className="mb-4 flex items-center text-2xl">Bạn đã nhận quà <p className="font-bold text-green text-3xl p-2">{levelName}</p> thành công!</div>
        )}
        <div
          className="flex items-center justify-center p-3 bg-primary rounded-lg w-[220px] text-center text-white font-bold cursor-pointer fea-item hover:bg-primary_dark"
          onClick={() => {setIsPopupOpen(false); setIsSuccess(true)}}
        >
          Đóng
        </div>
      </div>
      <Confetti />
    </div>
  );
};

export default PopupReceiveGift;
