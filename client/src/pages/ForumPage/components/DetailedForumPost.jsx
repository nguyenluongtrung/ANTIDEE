import { AiOutlineClose, AiOutlineEllipsis } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import {
	FaHeart,
	FaRegBookmark,
	FaRegComment,
	FaRegHeart,
} from 'react-icons/fa6';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import { PiShareFat } from 'react-icons/pi';
import { TbMessageReport } from 'react-icons/tb';
import { formatDateForumPost } from '../../../utils/format';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import {
	commentForumPost,
	getAllForumPosts,
	getForumPost,
	hideForumPost,
	reactToForumPost,
	unhideForumPost,
	unReactToForumPost,
	updateHiddenDetails,
} from '../../../features/forumPost/forumPostSlice';
import { getAccountInformation } from '../../../features/auth/authSlice';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SavePostForm } from './SavePostForm';
import reportListItems from './ReportForumPost/ReportListItems';
import { BiSolidCommentError } from 'react-icons/bi';
import { IoTime } from 'react-icons/io5';

export const DetailedForumPost = ({
	postContent,
	handleDeleteForumPost,
	setForumPost,
}) => {
	const [showPostOptions, setShowPostOptions] = useState();
	const [_hiddenPostIds, setHiddenPostIds] = useState([]);
	const [openSavePostForm, setOpenSavePostForm] = useState(false);
	const [undoPostId, setUndoPostId] = useState(null);
	const dispatch = useDispatch();
	const { postId } = useParams();
	const [accountId, setAccountId] = useState();
	const [myAvatar, setMyAvatar] = useState();
	const [post, setPost] = useState();
	const postOptionsRef = useRef(null);
	const postRef = useRef(null);
	const [showAllComments, setShowAllComments] = useState(false);
	const [comment, setComment] = useState('');
	const [isOpenReport, setIsOpenReport] = useState(false);
	const [reportPostId, setReportPostId] = useState();
	const [_selectedReason, setSelectedReason] = useState(null);
	const [expandedCommentIndex, setExpandedCommentIndex] = useState(null);
	
	const handleShowPostOptions = (postId) => {
		setShowPostOptions((prevState) => (prevState === postId ? null : postId));
	};

	const initialForumPost = async () => {
		const response = await dispatch(getForumPost(postId));
		setPost(response.payload);
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
		setMyAvatar(output.payload.avatar);
		setAccountId(output.payload._id);
	}

	const handleHidePost = async (postId) => {
		try {
			await dispatch(hideForumPost(postId)).unwrap();
			setHiddenPostIds((prevHiddenIds) => [...prevHiddenIds, postId]);
			setUndoPostId(postId);
			setTimeout(() => {
				setUndoPostId(null);
			}, 5000);
		} catch (error) {
			console.error('Đã xảy ra lỗi khi ẩn bài viết:', error);
		}
	};

	const handleUndoHidePost = async (postId) => {
		try {
			const result = await dispatch(unhideForumPost(postId)).unwrap();
			setHiddenPostIds((prevHiddenIds) =>
				prevHiddenIds.filter((id) => id !== postId)
			);
			setForumPost((prevPosts) =>
				prevPosts.map((post) =>
					post._id === postId ? { ...post, isHidden: false } : post
				)
			);
		} catch (error) {
			console.error('Lỗi khi khôi phục bài viết:', error);
		}
	};

	const handleCommentSubmit = async (forumPostId) => {
		if (!comment.trim()) {
			toast.error('Bình luận không được để trống', errorStyle);
			return;
		}

		if (!accountId || !forumPostId) {
			toast.error('Thông tin tài khoản hoặc bài viết không hợp lệ', errorStyle);
			return;
		}

		const result = await dispatch(
			commentForumPost({
				commentData: { content: comment, author: accountId },
				forumPostId: forumPostId,
			})
		);

		if (result.type.endsWith('fulfilled')) {
			toast.success('Bình luận thành công', successStyle);
			setForumPost((prevPosts) => {
				const updatedPost = [...prevPosts];
				const foundPostIndex = updatedPost.findIndex(
					(post) => post._id == forumPostId
				);
				updatedPost[foundPostIndex] = {
					...updatedPost[foundPostIndex],
					comments: result.payload,
				};
				return updatedPost;
			});
		} else if (result?.error?.message === 'Rejected') {
			toast.error('Có lỗi xảy ra. Vui lòng thử lại!', errorStyle);
		}
		await dispatch(getAllForumPosts());
		setComment('');
	};

	const handleHideComments = () => {
		setShowAllComments(false);
		postRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleReactToForumPost = async (postId) => {
		const result = await dispatch(
			reactToForumPost({ forumPostId: postId, userId: accountId })
		);
		if (result.type.endsWith('fulfilled')) {
			setPost(result.payload);
		}
	};

	const handleUnReactToForumPost = async (postId) => {
		const result = await dispatch(
			unReactToForumPost({ forumPostId: postId, userId: accountId })
		);
		if (result.type.endsWith('fulfilled')) {
			setPost(result.payload);
		}
	};

	const handleReportSubmit = async (reasonContent) => {
		const result = await dispatch(
			updateHiddenDetails({
				accountId: accountId,
				reasonContent,
				postId: reportPostId,
			})
		);

		if (result.type.endsWith('fulfilled')) {
			toast.success('Báo cáo bài viết thành công', successStyle);
			setIsOpenReport(false);
			await handleHidePost(reportPostId);
		} else if (result?.error?.message === 'Rejected') {
			toast.error('Có lỗi xảy ra. Vui lòng thử lại!', errorStyle);
		}
	};

	const toggleExpandComment = (index) => {
		setExpandedCommentIndex(expandedCommentIndex === index ? null : index);
	  };



	return (
		<div>
			{!post?.hiddenDetails?.status && (
				<div
					ref={postRef}
					className="bg-white shadow-md rounded-lg overflow-hidden mt-4"
				>
					{undoPostId && undoPostId === post?._id ? (
						<div className="justify-center  bg-primary rounded p-2">
							<div className="grid grid-cols-4 gap-4 items-center ">
								<div className="col-span-3">
									<strong className="flex items-center text-white text-xl">
										<BiSolidCommentError
											size={30}
											className="text-white mr-2"
										/>{' '}
										Bị ẩn
									</strong>
									<p className="text-white">
										Nhờ hoạt động báo cáo, chúng tôi có thể xử lý nội dung không
										mong muốn.
									</p>
								</div>
								<button
									className="h-10 bg-green hover:bg-blue text-xs md:text-lg lg:text-lg text-white rounded-lg  transition-colors"
									onClick={() => handleUndoHidePost(post._id)}
								>
									Hoàn tác
								</button>
							</div>

							<div className="border-b-2 m-2"></div>
							<div className="text-white ">
								<strong className="flex">
									<IoTime size={30} className="mr-2" />
									Đã ẩn bài viết của {post?.author?.name}
								</strong>
								<p className="ml-10">Tạm thời không nhìn thấy bài viết này</p>
							</div>
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

												<li
													className="cursor-pointer hover:bg-light_gray rounded-lg p-2"
													onClick={() => {
														setIsOpenReport(true);
														setReportPostId(post?._id);
													}}
												>
													<div className="flex items-center">
														<TbMessageReport className="mr-2" />
														<span>Báo cáo bài viết</span>
													</div>
													<p className="text-xs text-gray text-left">
														Hãy cho chúng tôi biết bài viết này có vấn đề gì
													</p>
												</li>
												{isOpenReport && (
													<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
														<div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
															<AiOutlineClose
																className="absolute text-sm hover:cursor-pointer"
																onClick={() => {
																	setIsOpenReport(false);
																}}
															/>
															<h1 className="text-2xl font-bold text-center">
																Báo cáo
															</h1>
															<div>
																<strong className="text-xl">
																	Tại sao bạn báo cáo bài viết này?
																</strong>
																<p className="text-justify text-sm">
																	Hãy cho quản trị viên biết bài viết này có vấn
																	đề gì. Chúng tôi sẽ không thông báo cho người
																	đăng rằng bạn đã báo cáo bài viết.
																</p>
															</div>
															<div>
																<ul className="space-y-2 text-left font-semibold">
																	{reportListItems.map((item, index) => (
																		<li
																			key={index}
																			className="cursor-pointer hover:bg-light_gray p-2 rounded"
																			onClick={() => {
																				setSelectedReason(item);
																				handleReportSubmit(item);
																			}}
																		>
																			{item}
																		</li>
																	))}
																</ul>
															</div>
														</div>
													</div>
												)}
											</ul>
										</div>
									)}
								</div>
							</div>

							<div>
								<div className="px-4">
									<p className="font-semibold text-[20px] text-[#2b2b2b]">
										{post?.title}
									</p>
								</div>
								<div className="mb-2 px-4">
									<p className="text-[14px]">{post?.content}</p>
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
											<FaHeart
												color="red"
												onClick={() =>
													handleUnReactToForumPost(post._id, accountId)
												}
											/>
										) : (
											<FaRegHeart
												onClick={() =>
													handleReactToForumPost(post._id, accountId)
												}
											/>
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
							</div>
							{post?.comments && (
								<div className="px-4 py-4">
									{post.comments
										.slice(0, showAllComments ? post.comments.length : 3)
										.map((comment, index) => {
											const isExpanded = expandedCommentIndex === index;
											const commentContent = isExpanded || comment?.content?.length <= 100
												? comment?.content
												: comment?.content?.slice(0, 100) + '...';

											return (
												<div key={index} className="flex mb-4">
													<img
														className="h-8 w-8 rounded-full object-cover mt-3"
														src={comment?.author?.avatar}
														alt="Commenter avatar"
													/>
													<div className="ml-2 rounded-lg px-3 py-2">
														<div className="bg-[#f0efef] p-2 w-full rounded-xl">
															<div className="text-sm font-semibold text-black flex justify-between">
																{comment?.author?.name}
															</div>
															<p className="text-sm text-gray-700">{commentContent}</p>
															{comment?.content?.length > 100 && (
																<button
																	onClick={() => toggleExpandComment(index)}
																	className="text-blue text-xs "
																>
																	{isExpanded ? 'Ẩn bớt' : 'Xem thêm'}
																</button>
															)}
														</div>
														<p>{formatDateForumPost(comment?.createdAt)}</p>
													</div>
												</div>
											);
										})}

									<div className="flex items-center mt-5 h-10">
										{myAvatar ? (
											<img
												className="h-10 w-10 rounded-full object-cover"
												src={myAvatar}
												alt="User avatar"
											/>
										) : (
											<FaUserAlt color="gray" size={20} />
										)}
										<form
											className="flex items-center ml-3 w-full rounded-full border-[1px] px-3 py-2 group focus-within:border-[1px]"
											onSubmit={(e) => {
												e.preventDefault();
												handleCommentSubmit(post?._id);
											}}
										>
											<input
												className="w-full text-sm focus:outline-none"
												type="text"
												placeholder="Viết bình luận của bạn"
												value={comment}
												onChange={(e) => setComment(e.target.value)}
											/>
										</form>
									</div>
									{showAllComments ? (
										<>
											{post?.comments?.map((comment, index) => (
												<p key={index} comment={comment} />
											))}
											<button onClick={handleHideComments} className='mt-1'>
												Ẩn bớt bình luận
											</button>
										</>
									) : (
										<>
											{post?.comments?.slice(0, 3).map((comment, index) => (
												<p key={index} comment={comment} />
											))}
											{post?.comments?.length > 3 && (
												<button onClick={() => setShowAllComments(true)} className='mt-1'>
													Hiển thị tất cả bình luận
												</button>
											)}
										</>
									)}
								</div>
							)}

							{openSavePostForm && (
								<SavePostForm
									chosenForumPostId={post?._id}
									setOpenSavePostForm={setOpenSavePostForm}
								/>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
