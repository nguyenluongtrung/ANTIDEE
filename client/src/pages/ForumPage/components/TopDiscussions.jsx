import React from 'react';

import { FaRegHeart, FaRegUser } from 'react-icons/fa6';
import { HiOutlineHome } from 'react-icons/hi';

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
			</div>
		</>
	);
};
