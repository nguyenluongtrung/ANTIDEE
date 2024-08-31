import { FaImages } from 'react-icons/fa';
import './ForumPage.css';
import { useEffect, useState } from 'react';
import { RiEmotionLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { getAllForumPosts } from '../../features/forumPost/forumPostSlice';
import { DetailedForumPost } from './components/DetailedForumPost';
import { CreatePostForum } from './components/CreateForumPost/CreateForumPost';
export const ForumDiscussions = () => {
	const dispatch = useDispatch();
	const [forumPost, setForumPost] = useState([]);
	const [isOpenCreatePostForum, setIsOpenCreatePostForum] = useState(false);
	const handleOpenCreateForumPost = () => {
		setIsOpenCreatePostForum(true);
	};
	async function initialForumPostList() {
		try {
		  let output = await dispatch(getAllForumPosts());
		  if (output.payload) {
			let sortedPosts = [...output.payload].sort(
			  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
			);
			setForumPost(sortedPosts);
		  } else {
			console.error('No posts found.');
		  }
		} catch (error) {
		  console.error('Error fetching posts:', error);
		}
	  }

	useEffect(() => {
		initialForumPostList();
	}, []);
	const handleGetAllForumPosts = async () => {
		let output = await dispatch(getAllForumPosts());
		let sortedPosts = [...output.payload].sort(
			(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
		);
		setForumPost(sortedPosts);
	};
	return (
		<div>
			<div className="p-4">
				<div className="">
				{isOpenCreatePostForum && (
                    <CreatePostForum
                    setIsOpenCreatePostForum={setIsOpenCreatePostForum}
                        handleGetAllForumPosts={handleGetAllForumPosts}
                    />
                )}
					<div className={`relative flex flex-col rounded-lg shadow-lg p-4`}>
						<div className="flex justify-around">
							<div className="">
								<img
									alt="avatar"
									src="https://m.media-amazon.com/images/I/51WHgHxF5YL._AC_UF1000,1000_QL80_.jpg"
									className="w-14 h-14 rounded-full"
								/>
							</div>
							<div className=" w-[85%] rounded-full border border-gray flex items-center px-4 font-medium text-gray cursor-pointer hover:bg-[#F6F6F6]"onClick={handleOpenCreateForumPost}>
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

				{forumPost?.map((post) => {
					return <DetailedForumPost postContent={post}/>;
				})}
			</div>
		</div>
	);
};
