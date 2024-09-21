import React from 'react';
import diachi from '../../assets/img/diachi.png';
import email from '../../assets/img/email.png';

export const Footer = () => {
	return (
		<div className="bg-primary p-5">
			<div className=" max-w-6xl m-auto grid grid-cols-3 gap-x-4">
				<div className="p-5">
					<h2 className="font-semibold text-white pb-3">Antidee</h2>
					<p className="text-sm text-white pb-2">Về chúng tôi</p>
					<p className="text-sm text-white pb-2">Câu chuyện truyền cảm hứng</p>
					<p className="text-sm text-white pb-2">Chương trình khuyến mãi</p>
					<p className="text-sm text-white">Trở thành người giúp việc?</p>
				</div>
				<div className=" p-5">
					<h2 className="font-semibold text-white pb-3">Dịch vụ</h2>
					<div className="grid grid-cols-2 space-x-4">
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
				<div className="ml-12 p-5">
					<h2 className="font-semibold pb-1 text-white pb-3">Liên hệ</h2>
					<div className="flex space-x-4  ">
						<img className="h-7" src={diachi} />
						<span className="text-sm text-white pb-2">
							Khu đô thị FPT Đà Nẵng, Q. Ngũ Hành Sơn, TP Đà Nẵng
						</span>
					</div>
					<div className="flex space-x-5 ">
						<img className="" src={email} />
						<p className="text-sm text-white pb-2">antidee@gmail.com</p>
					</div>
				</div>
			</div>
		</div>
	);
};
