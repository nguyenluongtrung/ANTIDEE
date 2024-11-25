import { AiOutlineClose, AiOutlineEllipsis } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import {
	FaHeart,
	FaRegBookmark,
	FaRegComment,
	FaRegHeart,
} from 'react-icons/fa6';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import { TbMessageReport } from 'react-icons/tb';
import { formatDateForumPost } from '../../../utils/format';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import {
	commentForumPost,
	hideForumPost,
	reactToForumPost,
	unhideForumPost,
	unReactToForumPost,
	updateHiddenDetails,
} from '../../../features/forumPost/forumPostSlice';
import { getAccountInformation } from '../../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { SavePostForm } from './SavePostForm';
import reportListItems from './ReportForumPost/ReportListItems';
import { BiSolidCommentError } from 'react-icons/bi';
import { IoTime } from 'react-icons/io5';

export const DetailedForumPost = ({
	postContent,
	onDeleteForumPost,
	setForumPosts,
	onUpdateForumPost,
	refetchData
}) => {
	const [showPostOptions, setShowPostOptions] = useState();
	const [_hiddenPostIds, setHiddenPostIds] = useState([]);
	const [openSavePostForm, setOpenSavePostForm] = useState(false);
	const [undoPostId, setUndoPostId] = useState(null);
	const dispatch = useDispatch();
	const [accountId, setAccountId] = useState();
	const [myAvatar, setMyAvatar] = useState();
	const postOptionsRef = useRef(null);
	const postRef = useRef(null);
	const [showAllComments, setShowAllComments] = useState(false);
	const [comment, setComment] = useState('');
	const [isOpenReport, setIsOpenReport] = useState(false);
	const [reportPostId, setReportPostId] = useState();
	const [_selectedReason, setSelectedReason] = useState(null);

	const handleShowPostOptions = (postId) => {
		setShowPostOptions((prevState) => (prevState === postId ? null : postId));
	};

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
			setForumPosts((prevPosts) =>
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
			refetchData();
		} else if (result?.error?.message === 'Rejected') {
			toast.error('Có lỗi xảy ra. Vui lòng thử lại!', errorStyle);
		}
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
			setForumPosts((prevPostList) => {
				const updatedPostList = [...prevPostList];
				const postIndex = updatedPostList.findIndex((post) => String(post._id) == String(result.payload._id));
				if(postIndex != -1){
					updatedPostList[postIndex] = result.payload;
				}
				return updatedPostList
			})
		}
	};

	const handleUnReactToForumPost = async (postId) => {
		const result = await dispatch(
			unReactToForumPost({ forumPostId: postId, userId: accountId })
		);
		if (result.type.endsWith('fulfilled')) {
			setForumPosts((prevPostList) => {
				const updatedPostList = [...prevPostList];
				const postIndex = updatedPostList.findIndex((post) => String(post._id) == String(result.payload._id));
				if(postIndex != -1){
					updatedPostList[postIndex] = result.payload;
				}
				return updatedPostList
			})
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

	

	return (
		<div>
			

			{!postContent?.hiddenDetails?.status && (
				<div
					ref={postRef}
					className="bg-white shadow-md rounded-lg overflow-hidden mt-4"
				>
					{undoPostId && undoPostId === postContent?._id ? (
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
									onClick={() => handleUndoHidePost(postContent._id)}
								>
									Hoàn tác
								</button>
							</div>

							<div className="border-b-2 m-2"></div>
							<div className="text-white ">
								<strong className="flex">
									<IoTime size={30} className="mr-2" />
									Đã ẩn bài viết của {postContent?.author?.name}
								</strong>
								<p className="ml-10">Tạm thời không nhìn thấy bài viết này</p>
							</div>
						</div>
					) : (
						<div>
							<div className="flex justify-between">
								<div className="flex items-center px-4 py-3">
									{postContent?.author?.avatar ? (
										<img
											className="h-10 w-10 rounded-full object-cover"
											src={postContent?.author?.avatar}
											alt="User avatar"
										/>
									) : (
										<FaUserAlt color="gray" size={20} />
									)}

									<div className="ml-3">
										<div className="text-sm font-semibold text-gray-900">
											<div>
												{postContent?.author?.name} ({postContent?.author?.role})
											</div>
										</div>
										<div className="text-xs text-gray-600">
											{formatDateForumPost(postContent?.createdAt)}
										</div>
									</div>
								</div>
								<div className="relative mx-4 my-3 flex items-center justify-center cursor-pointer w-10 h-10 rounded-full hover:bg-light_gray text-center">
									<AiOutlineEllipsis
										size={30}
										onClick={() => handleShowPostOptions(postContent?._id)}
									/>
									{showPostOptions === postContent?._id && (
										<div
											ref={postOptionsRef}
											className="absolute bg-white shadow-lg rounded-lg p-2 max-w-48"
											style={{
												top: '100%',
												right: '0',
												width: '250px',
												height: 'auto',
											}}
										>
											<ul>
												{postContent?.author?._id === accountId && (
													<li
														className="cursor-pointer hover:bg-light_gray rounded-lg p-2"
														onClick={onUpdateForumPost}
													>
														<div className="flex items-center">
															<MdEdit className="mr-2" />
															<span>Chỉnh sửa</span>
														</div>
														<p className="text-xs text-gray text-left">
															Chỉnh sửa nội dung bài đăng của bạn
														</p>
													</li>
												)}
												{postContent?.author?._id === accountId ? (
													<li
														className="cursor-pointer hover:bg-light_gray rounded-lg p-2"
														onClick={onDeleteForumPost}
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
														onClick={() => handleHidePost(postContent?._id)}
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
														setReportPostId(postContent?._id);
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
										{postContent?.title}
									</p>
									{postContent?.topic && (
										<div className="flex flex-wrap gap-1 my-2">
											{postContent.topic &&
												postContent.topic.length > 0 &&
												postContent.topic.slice(0, 2).map((topic) => (
													<div
														key={topic._id}
														className="bg-yellow text-[12px] px-2 py-1 rounded-md text-white"
													>
														{topic.topicName}
													</div>
												))}
											{postContent.topic && postContent.topic.length > 2 && (
												<div className="bg-gray-200 text-[12px] py-1 rounded-md text-gray">
													+ {postContent.topic.length - 2} chủ đề khác
												</div>
											)}
										</div>
									)}
								</div>
								<div className="mb-2 px-4">
									<p className="text-[14px]">{postContent?.content}</p>
								</div>

								{postContent?.images?.map((image, index) => (
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
										{postContent?.likes?.includes(accountId) ? (
											<FaHeart
												color="red"
												onClick={() =>
													handleUnReactToForumPost(postContent._id, accountId)
												}
											/>
										) : (
											<FaRegHeart
												onClick={() =>
													handleReactToForumPost(postContent._id, accountId)
												}
											/>
										)}
										<span className="ml-2">{postContent?.likes?.length}</span>
									</div>
									<div className="flex items-center cursor-pointer ml-4">
										<FaRegComment />
										<span className="ml-2">{postContent?.comments?.length}</span>
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
							{postContent?.comments && (
								<div className="px-4 py-4">
									{postContent.comments
										.slice(0, showAllComments ? postContent.comments.length : 3)
										.map((comment, index) => (
											<div key={index} className="flex mb-4">
												<img
													className="h-8 w-8 rounded-full object-cover mt-3"
													src={comment?.author?.avatar}
													alt="Commenter avatar"
												/>
												<div className="ml-2 bg-gray-100 rounded-lg px-3 py-2">
													<div className="bg-[#f0efef] p-2 w-full rounded-xl">
														<div className="text-sm font-semibold text-gray-900 flex justify-between">
															{comment?.author?.name}
														</div>
														<p className="text-sm text-gray-700">
															{comment?.content}
														</p>
													</div>
												</div>
											</div>
										))}
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
												handleCommentSubmit(postContent?._id);
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
											{postContent?.comments?.map((comment, index) => (
												<p key={index} comment={comment} />
											))}
											<button onClick={handleHideComments} className="mt-1">
												Ẩn bớt bình luận
											</button>
										</>
									) : (
										<>
											{postContent?.comments?.slice(0, 3).map((comment, index) => (
												<p key={index} comment={comment} />
											))}
											{postContent?.comments?.length > 3 && (
												<button
													onClick={() => setShowAllComments(true)}
													className="mt-1"
												>
													Hiển thị tất cả bình luận
												</button>
											)}
										</>
									)}
								</div>
							)}

							{openSavePostForm && (
								<SavePostForm
									chosenForumPostId={postContent?._id}
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
