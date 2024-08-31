import { AiOutlineEllipsis } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import {
	FaHeart,
	FaRegBookmark,
	FaRegComment,
	FaRegHeart,
} from 'react-icons/fa6';
import { MdDeleteForever, MdEdit, MdOutlineReport } from 'react-icons/md';
import { PiShareFat } from 'react-icons/pi';
import { TbMessageReport } from 'react-icons/tb';
import { formatDateForumPost } from '../../../utils/format';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import {
	deleteForumPost,
	getAllForumPosts,
	getForumPost,
	hideForumPost,
	unhideForumPost
} from '../../../features/forumPost/forumPostSlice';
import { IoMdSend } from 'react-icons/io';
import { getAccountInformation } from '../../../features/auth/authSlice';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SavePostForm } from './SavePostForm';

export const DetailedForumPost = ({ postContent }) => {
	const [showPostOptions, setShowPostOptions] = useState(); 
	const [hiddenPostIds, setHiddenPostIds] = useState([]);
	const [openSavePostForm, setOpenSavePostForm] = useState(false);
	const [chosenForumPostId, setChosenForumPostId] = useState(undefined);
	const [undoPostId, setUndoPostId] = useState(null);
	const dispatch = useDispatch();
	const { postId } = useParams();
	const [accountId, setAccountId] = useState();
	const [post, setPost] = useState();
	const [forumPost, setForumPost] = useState([]);
	const postOptionsRef = useRef(null);

	const handleShowPostOptions = (postId) => {
		setShowPostOptions((prevState) => (prevState === postId ? null : postId));
	};

	useEffect(() => {
		if (postContent) {
			setPost(postContent);
		} else if (!postContent && postId) {
			initialForumPost();
		}
	}, [postContent, postId]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				postOptionsRef.current &&
				!postOptionsRef.current.contains(event.target)
			) {
				setShowPostOptions(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		initialAccountInfomation();
	}, []);

	async function initialAccountInfomation() {
		let output = await dispatch(getAccountInformation());
		setAccountId(output.payload._id);
	}

	const handleDeleteForumPost = async (forumPostId) => {
		const result = await dispatch(deleteForumPost(forumPostId));
		if (result.type.endsWith("fulfilled")) {
		  toast.success("Bài viết đã được xóa", successStyle);
	  
		  // Cập nhật lại danh sách bài viết sau khi xóa
		  setForumPost((prevPosts) =>
			prevPosts.filter((post) => post._id !== forumPostId)
		  );
		} else if (result?.error?.message === "Rejected") {
		  toast.error(result?.payload, errorStyle);
		}
	  };  

	const handleHidePost = async (postId) => {
		try {
			const result = await dispatch(hideForumPost(postId)).unwrap();
			setHiddenPostIds((prevHiddenIds) => [...prevHiddenIds, postId]);
			// Hiển thị nút hoàn tác
			setUndoPostId(postId);
			setTimeout(() => {
				setUndoPostId(null);  // Ẩn nút hoàn tác sau một khoảng thời gian
			}, 5000);  // Ví dụ: 5 giây
		} catch (error) {
			console.error("Đã xảy ra lỗi khi ẩn bài viết:", error);
		}
	};

	const handleUndoHidePost = async (postId) => {
		try {
			const result = await dispatch(unhideForumPost(postId)).unwrap();
			console.log(`Bài viết với ID ${postId} đã được khôi phục.`);
			setHiddenPostIds((prevHiddenIds) =>
				prevHiddenIds.filter(id => id !== postId)
			);
			setForumPost((prevPosts) =>
				prevPosts.map((post) =>
					post._id === postId ? { ...post, isHidden: false } : post
				)
			);
		} catch (error) {
			console.error("Lỗi khi khôi phục bài viết:", error);
		}
	};

	return (
		<div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
			{undoPostId && undoPostId === post?._id ? (
					 <div className="flex justify-center mt-4">
					 <button
					   className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
					   onClick={() => handleUndoHidePost(post._id)}
					 >
					   Hoàn tác Ẩn
					 </button>
				   </div>
				) : (
			<div>
				<div className="flex justify-between">
					<div className="flex items-center px-4 py-3">
						{post?.author?.avatar ? (
							<img
								className="h-10 w-10 rounded-full object-cover"
								src={post?.author?.avatar}
								alt="User avatar"
							/>
						) : (
							<FaUserAlt color="gray" size={20} />
						)}

						<div className="ml-3">
							<div className="text-sm font-semibold text-gray-900">
								<div>
									{post?.author?.name} ({post?.author?.role})
								</div>
							</div>
							<div className="text-xs text-gray-600">
								{formatDateForumPost(post?.createdAt)}
							</div>
						</div>
					</div>
					<div className="mx-4 my-3 flex items-center justify-center cursor-pointer w-10 h-10 rounded-full hover:bg-light_gray text-center">
						<AiOutlineEllipsis
							size={30}
							onClick={() => handleShowPostOptions(post?._id)}
						/>
						{showPostOptions === post?._id && (
							<div
								ref={postOptionsRef}
								className="absolute bg-white shadow-lg rounded-lg p-2 max-w-48"
							>
								<ul>
									<li className="cursor-pointer hover:bg-light_gray rounded-lg p-2">
										<div className="flex items-center">
											<MdEdit className="mr-2" />
											<span>Chỉnh sửa</span>
										</div>
										<p className="text-xs text-gray text-left">
											Chỉnh sửa nội dung bài đăng của bạn
										</p>
									</li>
									{post?.author?._id === accountId ? (
										<li
											className="cursor-pointer hover:bg-light_gray rounded-lg p-2"
											onClick={() => handleDeleteForumPost(post?._id)}
										>
											<div className="flex items-center">
												<MdDeleteForever className="mr-2" />
												<span>Xóa</span>
											</div>
											<p className="text-xs text-gray text-left">
												Bài đăng này của bạn sẽ bị xóa vĩnh viễn
											</p>
										</li>
									) : (
										<li
											className="cursor-pointer hover:bg-light_gray rounded-lg p-2"
											onClick={() => handleHidePost(post?._id)}
										>
											<div className="flex items-center">
												<MdDeleteForever className="mr-2" />
												<span>Ẩn</span>
											</div>
											<p className="text-xs text-gray text-left">
												Bài viết sẽ bị ẩn khỏi bạn
											</p>
										</li>
									)}

									<li className="cursor-pointer hover:bg-light_gray rounded-lg p-2">
										<div className="flex items-center">
											<TbMessageReport className="mr-2" />
											<span>Báo cáo bài viết</span>
										</div>
										<p className="text-xs text-gray text-left">
											Hãy cho chúng tôi biết bài viết này có vấn đề gì
										</p>
									</li>
								</ul>
							</div>
						)}
					</div>
				</div>

				
					<div>
						<div className="my-2 px-4 py-2">
							<p className="text-black text-base">{post?.content}</p>
						</div>

						{post?.images?.map((image, index) => (
							<img
								className="w-full object-cover"
								src={image}
								alt={`Post image ${index}`}
								key={index}
							/>
						))}
					</div>
				

				<div className="px-4 py-4 flex items-center justify-between border-t">
					<div className="flex">
						<div className="flex items-center cursor-pointer">
							{post?.likes?.includes(accountId) ? (
								<FaHeart color="red" />
							) : (
								<FaRegHeart />
							)}
							<span className="ml-2">{post?.likes?.length}</span>
						</div>
						<div className="flex items-center cursor-pointer ml-4">
							<FaRegComment />
							<span className="ml-2">{post?.comments?.length}</span>
						</div>
						<div
							className="flex items-center cursor-pointer ml-4"
							onClick={() => setOpenSavePostForm(true)}
						>
							<FaRegBookmark />
							<span className="ml-2">Lưu</span>
						</div>
					</div>
					<div className="cursor-pointer">
						<PiShareFat />
					</div>
				</div>
				<div className="flex items-center mt-5 h-10">
						<FaUserAlt color="gray" size={20} />
						<div className="flex items-center ml-3 w-full rounded-full border-[1px] px-3 py-2 group focus-within:border-[1px]">
							<input
								className="w-full text-sm focus:outline-none"
								type="text"
								placeholder="Viết bình luận của bạn"
							/>
							<div className="ml-2 text-blue">
								<IoMdSend className="hover:text-primary cursor-pointer" />
							</div>
						</div>
					</div>
				{openSavePostForm && (
					<SavePostForm
						postId={post?._id}
						closeForm={() => setOpenSavePostForm(false)}
					/>
				)}
			</div>
			)}
		</div>
	);
};
