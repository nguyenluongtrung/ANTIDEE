import React, { useState } from 'react';
import { BsPostcardHeartFill } from 'react-icons/bs';
import { GiVacuumCleaner } from 'react-icons/gi';
import { MdCleaningServices, MdDryCleaning, MdFiberNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { CreatePostForum } from './CreateForumPost/CreateForumPost';

export const PopularTopics = () => {
	const navigate = useNavigate();
	const [isOpenCreatePostForum, setIsOpenCreatePostForum] = useState(false);
	const handleGetAllForumPosts = async () => {
		let output = await dispatch(getAllForumPosts());
		let sortedPosts = [...output.payload].sort(
			(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
		);
		setForumPost(sortedPosts);
	};

	return (
		<div className="p-4">
			{isOpenCreatePostForum && (
				<CreatePostForum setIsOpenCreatePostForum={setIsOpenCreatePostForum} />
			)}
			<div className={`bg-white rounded-lg shadow-md p-4 space-y-2`}>
				<button
					className="bg-primary text-white rounded-xl px-5 py-2 w-full font-semibold	hover:bg-primary_dark fea-item"
					onClick={() => setIsOpenCreatePostForum(true)}
				>
					Tạo thảo luận
				</button>
				<div
					className="flex items-center p-3 rounded-md gap-2 hover:bg-primary  transition duration-300 cursor-pointer hvr-shutter-in-horizontal"
					onClick={() => navigate('/forum/repositories')}
				>
					<BsPostcardHeartFill className="text-white bg-green rounded-full w-7 h-7 p-1" />
					<div className="font-semibold">Bài viết đã lưu</div>
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
