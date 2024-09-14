import { AiOutlineEllipsis } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import {
	FaHeart,
	FaRegBookmark,
	FaRegComment,
	FaRegHeart,
} from "react-icons/fa6";
import { MdDeleteForever, MdEdit, MdOutlineReport } from "react-icons/md";
import { PiShareFat } from "react-icons/pi";
import { TbMessageReport } from "react-icons/tb";
import { formatDateForumPost } from "../../../utils/format";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import {
	commentForumPost,
	deleteForumPost,
	getAllForumPosts,
	getForumPost,
	hideForumPost,
	unhideForumPost,
	reactLikesPost,
	reactDislikesPost,
} from "../../../features/forumPost/forumPostSlice";
import { IoMdSend } from "react-icons/io";
import { getAccountInformation } from "../../../features/auth/authSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SavePostForm } from "./SavePostForm";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";

export const DetailedForumPost = ({ postContent, handleDeleteForumPost, handleUpdateCommentLocal, setForumPost, setChosenForumPost }) => {
	const [showPostOptions, setShowPostOptions] = useState();
	const [hiddenPostIds, setHiddenPostIds] = useState([]);
	const [openSavePostForm, setOpenSavePostForm] = useState(false);
	const [chosenForumPostId, setChosenForumPostId] = useState(undefined);
	const [undoPostId, setUndoPostId] = useState(null);
	const dispatch = useDispatch();
	const { postId } = useParams();
	const [accountId, setAccountId] = useState();
	const [account, setAccount] = useState('');
	const [post, setPost] = useState();
	const postOptionsRef = useRef(null);
	const postRef = useRef(null);

	const [showAllComments, setShowAllComments] = useState(false);

	const [comment, setComment] = useState("");

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

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		initialAccountInfomation();
	}, []);

	async function initialAccountInfomation() {
		let output = await dispatch(getAccountInformation());
		setAccountId(output.payload._id);
	}

	const handleHidePost = async (postId) => {
		try {
			const result = await dispatch(hideForumPost(postId)).unwrap();
			setHiddenPostIds((prevHiddenIds) => [...prevHiddenIds, postId]);
			// Hiển thị nút hoàn tác
			setUndoPostId(postId);
			setTimeout(() => {
				setUndoPostId(null); // Ẩn nút hoàn tác sau một khoảng thời gian
			}, 5000); // Ví dụ: 5 giây
		} catch (error) {
			console.error("Đã xảy ra lỗi khi ẩn bài viết:", error);
		}
	};

	const handleUndoHidePost = async (postId) => {
		try {
			const result = await dispatch(unhideForumPost(postId)).unwrap();
			console.log(`Bài viết với ID ${postId} đã được khôi phục.`);
			setHiddenPostIds((prevHiddenIds) =>
				prevHiddenIds.filter((id) => id !== postId)
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

	const handleCommentSubmit = async (forumPostId) => {
		if (!comment.trim()) {
			toast.error("Bình luận không được để trống", errorStyle);
			return;
		}

		if (!accountId || !forumPostId) {
			toast.error("Thông tin tài khoản hoặc bài viết không hợp lệ", errorStyle);
			return;
		}

		const result = await dispatch(
			commentForumPost({
				commentData: { content: comment, author: accountId },
				forumPostId: forumPostId,
			})
		);

		if (result.type.endsWith("fulfilled")) {
			toast.success("Bình luận thành công", successStyle);
			console.log(result.payload)
			setForumPost((prevPosts) => {
				const updatedPost = [...prevPosts];
				const foundPostIndex = updatedPost.findIndex(
					(post) => post._id == forumPostId
				);
				updatedPost[foundPostIndex] = { ...updatedPost[foundPostIndex], comments: result.payload };
				return updatedPost;
			});
		} else if (result?.error?.message === "Rejected") {
			toast.error("Có lỗi xảy ra. Vui lòng thử lại!", errorStyle);
		}
		await dispatch(getAllForumPosts());
		setComment('');
	};

	const handleToggleShowAllComments = () => {
		setShowAllComments((prevShowAll) => !prevShowAll);
	};

	const handleHideComments = () => {
		setShowAllComments(false);
		postRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleReactLikesPost = async (postId) => {
		const response = await dispatch(
			reactLikesPost({ postId, accountId: account._id })
		);
		setChosenForumPost(response.payload);
	};

	const handleReactDislikesPost = async (postId) => {
		const response = await dispatch(
			reactDislikesPost({ postId, accountId: account._id })
		);
		setChosenForumPost(response.payload);
	};


	return (
		<div ref={postRef} className="bg-white shadow-md rounded-lg overflow-hidden mt-4">



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
												onClick={handleDeleteForumPost}
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
									<BiLike
									className="absolute right-8 hover:cursor-pointer" 
									size={20} color="blue" 
									onClick={() => handleReactLikesPost(post?._id)}
									/>
								) : (
									<BiLike
									className="absolute right-8 hover:cursor-pointer" 
									size={20} 
									onClick={() => handleReactLikesPost(post?._id)}
									/>
								)}
								<span className="ml-2">{post?.likes?.length}</span>
							</div>
							<div className="flex items-center cursor-pointer ml-4">
								{post?.dislikes?.includes(accountId) ? (
									<BiDislike
									className="absolute right-8 hover:cursor-pointer" 
									size={20} color="blue" 
									onClick={() => handleReactDislikesPost(post?._id)}
									/>
								) : (
									<BiDislike
									className="absolute right-8 hover:cursor-pointer" 
									size={20} 
									onClick={() => handleReactDislikesPost(post?._id)}
									/>
								)}
								<span className="ml-2">{post?.dislikes?.length}</span>
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
					{post?.comments && (
						<div className="px-4 py-4">
							{post.comments.slice(0, showAllComments ? post.comments.length : 3).map((comment, index) => (
								<div key={index} className="flex mb-4">
									<img className="h-8 w-8 rounded-full object-cover mt-3" src={comment?.author?.avatar} alt="Commenter avatar" />
									<div className="ml-2 bg-gray-100 rounded-lg px-3 py-2">
										<div className="bg-[#f0efef] p-2 w-full rounded-xl">
											<div className="text-sm font-semibold text-gray-900 flex justify-between">
												{comment?.author?.name}
												<MdOutlineReport size={20} className="hover:text-primary cursor-pointer" />
											</div>
											<p className="text-sm text-gray-700">{comment?.content}</p>
										</div>
										<div className="flex justify-between mt-2 ml-2 pr-2 w-full">
											<div className="flex">
												<button className="flex items-center hover:text-anotherRed">
													<FaRegHeart className="mr-1" />
													<span className="text-sm">Thích</span>
												</button>
												<button className="flex items-center ml-6 hover:text-primary">
													<FaRegComment className="mr-1" />
													<span className="text-sm w-[60px]">Phản hồi</span>
												</button>
											</div>
											<div className="flex">
												<div className="flex items-center ">
													<span className="text-sm mr-1">100</span>
													<FaHeart className="text-anotherRed" />
												</div>
											</div>
										</div>
									</div>
								</div>
							))}

							{showAllComments ? (
								<>
									{post?.comments?.map((comment, index) => (
										<p key={index} comment={comment} />
									))}
									<button onClick={handleHideComments}>Ẩn bớt bình luận</button>
								</>
							) : (
								<>
									{post?.comments?.slice(0, 3).map((comment, index) => (
										<p key={index} comment={comment} />
									))}
									{post?.comments?.length > 3 && (
										<button onClick={() => setShowAllComments(true)}>Hiển thị tất cả bình luận</button>
									)}
								</>
							)}
						</div>
					)}

					{/* Comment Input Section */}
					<div className="flex items-center mt-5 h-10">
						<FaUserAlt color="gray" size={20} />
						<div className="flex items-center ml-3 w-full rounded-full border-[1px] px-3 py-2 group focus-within:border-[1px]">
							<input
								className="w-full text-sm focus:outline-none"
								type="text"
								placeholder="Viết bình luận của bạn"
								value={comment}
								onChange={(e) => setComment(e.target.value)}
							/>
							<div className="ml-2 text-blue">
								<IoMdSend
									className="hover:text-primary cursor-pointer"
									onClick={() => handleCommentSubmit(post?._id)}
								/>
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
