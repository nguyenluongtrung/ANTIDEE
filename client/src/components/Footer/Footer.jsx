import React from 'react';
import diachi from '../../assets/img/diachi.png';
import email from '../../assets/img/email.png';

export const Footer = () => {
    return (
        <div className="bg-primary p-5">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-5 about-us">
                    <p className="font-semibold text-white pb-3">Antidee</p>
                    <p className="text-sm text-white pb-2">Về chúng tôi</p>
                    <p className="text-sm text-white pb-2">Câu chuyện truyền cảm hứng</p>
                    <p className="text-sm text-white pb-2">Chương trình khuyến mãi</p>
                    <p className="text-sm text-white">Trở thành người giúp việc?</p>
                </div>
                <div className="p-5 services hidden md:block"> {/* Ẩn dịch vụ trên màn hình nhỏ hơn md */}
                    <p className="font-semibold text-white pb-3">Dịch vụ</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <div>
                            <p className="text-sm text-white pb-2">Dọn dẹp văn phòng</p>
                            <p className="text-sm text-white pb-2">Vệ sinh máy lạnh</p>
                            <p className="text-sm text-white pb-2">Giúp việc nhà theo giờ</p>
                            <p className="text-sm text-white pb-2">Trông trẻ tại nhà</p>
                            <p className="text-sm text-white pb-2">Chăm sóc người bệnh</p>
                            <p className="text-sm text-white">Chăm sóc người cao tuổi</p>
                        </div>
                        <div>
                            <p className="text-sm text-white pb-2">Tổng vệ sinh</p>
                            <p className="text-sm text-white pb-2">Vệ sinh sofa, rèm, nệm</p>
                            <p className="text-sm text-white pb-2">Đi chợ</p>
                            <p className="text-sm text-white pb-2">Nấu ăn gia đình</p>
                            <p className="text-sm text-white">Giặt ủi</p>
                        </div>
                    </div>
                </div>
                <div className="p-5 contact">
                    <p className="font-semibold text-white pb-3">Liên hệ</p>
                    <div className="flex items-center space-x-2">
                        <img className="h-7" src={diachi} alt="Địa chỉ" />
                        <span className="text-sm text-white">
                            Khu đô thị FPT Đà Nẵng, Q. Ngũ Hành Sơn, TP Đà Nẵng
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <img src={email} alt="Email" />
                        <p className="text-sm text-white">antidee@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
