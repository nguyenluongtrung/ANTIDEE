import { FaImages } from 'react-icons/fa';
import './ForumPage.css';
import { useEffect, useState } from 'react';
import { RiEmotionLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { getAllForumPosts } from '../../features/forumPost/forumPostSlice';
import { DetailedForumPost } from './components/DetailedForumPost';

export const ForumDiscussions = () => {
	const dispatch = useDispatch();
	const [forumPosts, setForumPosts] = useState([]);

	async function initialForumPostList() {
		let output = await dispatch(getAllForumPosts());
		setForumPosts(output.payload);
	}

	useEffect(() => {
		initialForumPostList();
	}, []);

	return (
		<div>
			<div className="p-4">
				<div className="">
					<div className={`relative flex flex-col rounded-lg shadow-lg p-4`}>
						<div className="flex justify-around">
							<div className="">
								<img
									alt="avatar"
									src="https://m.media-amazon.com/images/I/51WHgHxF5YL._AC_UF1000,1000_QL80_.jpg"
									className="w-14 h-14 rounded-full"
								/>
							</div>
							<div className=" w-[85%] rounded-full border border-gray flex items-center px-4 font-medium text-gray cursor-pointer hover:bg-[#F6F6F6]">
								Nêu lên suy nghĩ của bạn?
							</div>
						</div>
						<div className="flex justify-around border-0 border-t-2 border-light_gray mt-4 p-4 pb-0">
							<div className="flex justify-center items-center w-[45%] hover:bg-light_gray cursor-pointer rounded-xl">
								<FaImages size={30} className="m-2 ml-0 text-green" /> Thêm ảnh
								và video
							</div>
							<div className="flex justify-center items-center w-[45%] hover:bg-light_gray cursor-pointer rounded-xl">
								<RiEmotionLine size={30} className="m-2 ml-0 text-yellow" />
								Hoạt động
							</div>
						</div>
					</div>
				</div>

				{forumPosts?.map((post) => {
					return <DetailedForumPost postContent={post}/>;
				})}
			</div>
		</div>
	);
};
