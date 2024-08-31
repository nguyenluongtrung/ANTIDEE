import React from 'react';
import { BsPostcardHeartFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa6';
import { GiVacuumCleaner } from 'react-icons/gi';
import { MdCleaningServices, MdDryCleaning, MdFiberNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export const PopularTopics = () => {
	const navigate = useNavigate();
	return (
		<div className="p-4">
			<div className={`bg-white rounded-lg shadow-md p-4 space-y-2`}>
				<button
					className="bg-primary text-white rounded-xl px-5 py-2 w-full font-semibold	hover:bg-primary_dark fea-item"
					//   onClick={() => setIsCreateDiscussionOpen(true)}
				>
					Tạo thảo luận
				</button>
				<div className="flex items-center p-3 rounded-md gap-2 hover:bg-primary transition duration-300 cursor-pointer hvr-shutter-in-horizontal">
					<MdFiberNew className="text-white bg-red rounded-full w-7 h-7 p-1 " />
					<div className="font-semibold">Các bài mới nhất </div>
				</div>
				<div
					className="flex items-center p-3 rounded-md gap-2 hover:bg-primary  transition duration-300 cursor-pointer hvr-shutter-in-horizontal"
					onClick={() => navigate('/forum/repositories')}
				>
					<BsPostcardHeartFill className="text-white bg-green rounded-full w-7 h-7 p-1" />
					<div className="font-semibold">Bài viết đã lưu</div>
				</div>
				<div className="flex items-center p-3 rounded-md gap-2 hover:bg-primary  transition duration-300 cursor-pointer hvr-shutter-in-horizontal">
					<FaUser className="text-white bg-blue rounded-full w-7 h-7 p-1" />
					<div className="font-semibold">Đang theo dõi</div>
				</div>
			</div>

			<div className={`bg-white mt-4 p-6 rounded-lg shadow-lg`}>
				<h2 className="text-base font-semibold mb-3">Chủ đề phổ biến</h2>
				<div>
					<div className="flex items-center mb-4 hover:bg-primary p-2 rounded-lg cursor-pointer hvr-shutter-in-horizontal group">
						<MdCleaningServices className="mr-2 text-red w-8 h-8 group-hover:text-white" />
						<div className="font-semibold">Giúp việc</div>
					</div>
					<div className="flex items-center mb-4 hover:bg-primary p-2 rounded-lg cursor-pointer hvr-shutter-in-horizontal group">
						<MdDryCleaning className="mr-2 text-blue w-8 h-8 group-hover:text-white" />
						<div className="font-semibold">Chăm sóc người bệnh</div>
					</div>
					<div className="flex items-center mb-4 hover:bg-primary p-2 rounded-lg cursor-pointer hvr-shutter-in-horizontal group">
						<GiVacuumCleaner className="mr-2 text-green w-8 h-8 group-hover:text-white" />
						<div className="font-semibold">Đi chợ</div>
					</div>
				</div>
			</div>
		</div>
	);
};
