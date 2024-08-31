import React from 'react';
import { FaRegHeart, FaRegUser } from 'react-icons/fa6';
import { HiOutlineHome } from 'react-icons/hi';
import { IoIosAdd } from 'react-icons/io';

export const TopDiscussions = () => {
	return (
		<>
			<div className="p-4">
				<div className={`bg-white p-4 mt-4 rounded-lg shadow-md`}>
					<strong className="text-base font-bold block mb-4">
						Thảo luận hàng đầu
					</strong>
					<div className="flex items-center p-2 gap-x-2 rounded-xl cursor-pointer hover:bg-primary hvr-shutter-in-horizontal mb-4">
						<HiOutlineHome className="mx-2" />
						Trang chủ
					</div>
					<div className="flex items-center p-2 gap-x-2 rounded-xl cursor-pointer hover:bg-primary hvr-shutter-in-horizontal mb-4">
						<FaRegUser className="mx-2" />
						Trang cá nhân
					</div>
				</div>
				<div className={`bg-white p-4 mt-4 rounded-lg shadow-md`}>
					<strong className="text-base font-bold block mb-4">
						Thảo luận hàng đầu
					</strong>
					<div className="p-2 rounded-lg mb-3 border border-light_gray hover:bg-light_gray cursor-pointer">
						<p className="text-base font-semibold mb-3">
							Lộ clip dọn nhà
						</p>
						<div>
							<span className="bg-primary mr-3 px-4 py-1 rounded-md text-white">
								giúp việc
							</span>
							<p className=" mt-3 text-sm flex items-center gap-1">
								1<FaRegHeart size={10} />
							</p>
						</div>
					</div>
				</div>
				<div className={`bg-white p-4 mt-4 rounded-lg shadow-md`}>
					<div className="flex justify-between gap-10">
						<strong className="text-base font-bold block mb-4">
							Lượt truy cập người dùng
						</strong>
						<p className="text-blue font-semibold hover:text-blue-900 cursor-pointer">
							Tất cả
						</p>
					</div>
					<div className="mb-4">
						<div className="flex items-center mb-4">
							<img
								alt="avatar"
								src="https://m.media-amazon.com/images/I/51WHgHxF5YL._AC_UF1000,1000_QL80_.jpg"
								className="rounded-full border w-8 h-8"
							/>
							<div className="ml-4">
								<p className="block font-semibold">Hung Dinh</p>
								<p className="text-gray">#hungdinh@</p>
							</div>
							<div className="ml-auto flex items-center rounded-full border border-blue text-blue hover:bg-blue hover:text-white">
								<IoIosAdd className=" text-2xl ml-1" />
								<button className=" text-sm font-semibold py-1 px-2">
									Theo dõi
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
