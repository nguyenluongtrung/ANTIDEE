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
	getForumPost,
} from '../../../features/forumPost/forumPostSlice';
import { IoMdSend } from 'react-icons/io';
import { getAccountInformation } from '../../../features/auth/authSlice';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SavePostForm } from './SavePostForm';

export const DetailedForumPost = ({ postContent }) => {
	const [showPostOptions, setShowPostOptions] = useState();
	const [openSavePostForm, setOpenSavePostForm] = useState(false);
	const [chosenForumPostId, setChosenForumPostId] = useState(undefined);
	const dispatch = useDispatch();
	const { postId } = useParams();
	const [accountId, setAccountId] = useState();
	const [post, setPost] = useState();
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
	}, []);

	async function initialForumPost() {
		let output = await dispatch(getForumPost(postId));
		console.log(output.payload)
		setPost(output.payload);
	}

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
		if (result.type.endsWith('fulfilled')) {
			toast.success('Bài viết đã được xóa', successStyle);
			await dispatch(getAllForumPosts());
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
	};

	return (
		<div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
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
										<li className="cursor-pointer hover:bg-light_gray rounded-lg p-2">
											<div
												className="flex items-center"
												onClick={() => handleDeleteForumPost(post?._id)}
											>
												<MdDeleteForever className="mr-2" />
												<span>Xóa</span>
											</div>
											<p className="text-xs text-gray text-left">
												Bài đăng này của bạn sẽ bị xóa vĩnh viễn
											</p>
										</li>
									) : (
										<li className="cursor-pointer hover:bg-light_gray rounded-lg p-2">
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

				<div className="my-2 px-4 py-2">
					<p className="text-black text-base">{post?.content}</p>
				</div>

				{post?.images?.map((image, index) => (
					<img className="w-full object-cover" src={image} alt="Post image" />
				))}

				<div className="my-3 flex justify-around items-center">
					<div className="flex items-center cursor-pointer rounded-xl hover:bg-primary hover:text-white px-3 py-2 hvr-shutter-in-horizontal">
						<FaRegHeart className="mr-2" />
						Thích
					</div>
					<div className="flex items-center cursor-pointer rounded-xl hover:bg-primary hover:text-white px-3 py-2 hvr-shutter-in-horizontal">
						<FaRegComment className="mr-2" /> Bình Luận
					</div>
					<div className="flex items-center cursor-pointer rounded-xl hover:bg-primary hover:text-white px-3 py-2 hvr-shutter-in-horizontal">
						<PiShareFat className="mr-2" />
						Chia sẻ
					</div>
					<div
						className="flex items-center cursor-pointer rounded-xl hover:bg-primary hover:text-white px-3 py-2 hvr-shutter-in-horizontal"
						onClick={() => {
							setOpenSavePostForm(true);
							setChosenForumPostId(post._id);
						}}
					>
						<FaRegBookmark className="mr-2" />
						Lưu
					</div>
				</div>

				<div className="px-4 py-2 border-t">
					{post?.comments.map((comment, index) => (
						<div className="flex mb-4">
							<div className="ml-2 bg-gray-100 rounded-lg px-3 py-2">
								<div className="bg-[#f0efef] p-2 w-full rounded-xl">
									<div className="text-sm font-semibold text-gray-900 flex justify-between">
										{comment.author?.name}
										<MdOutlineReport
											size={20}
											className="hover:text-primary cursor-pointer"
										/>
									</div>
									<p className="text-sm">{comment?.content}</p>
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
								<div className="flex my-2">
									<img
										className="h-8 w-8 rounded-full object-cover mt-3"
										src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/448995705_2362437390816204_1693027978788705460_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=O191nMwmcOQQ7kNvgG2QagT&_nc_ht=scontent.fsgn2-3.fna&oh=00_AYDDqwFe7A8vIhDg9nNP0Q8fXzo16UPSiM78cxLuDDPN5w&oe=66AFCC60"
										alt="Commenter avatar"
									/>
									<div className="ml-2 bg-gray-100 rounded-lg px-3 py-2">
										<div className="bg-[#f0efef] p-2 w-full rounded-xl">
											<div className="text-sm font-semibold text-gray-900 flex justify-between">
												Lương Trung
												<MdOutlineReport
													size={20}
													className="hover:text-primary cursor-pointer"
												/>
											</div>
											<p className="text-sm text-gray-700">Chắc chưa?</p>
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

										<div className="flex items-center mt-4">
											<img
												className="h-8 w-8 rounded-full object-cover"
												src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/391627726_2229687603896740_6420573741491573149_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=J7mzehA4Z1sQ7kNvgEUTQ9j&_nc_ht=scontent.fsgn2-9.fna&gid=A-3Yb5bx_mg6VqvNRuTaZRR&oh=00_AYCGQQe0yWk87DuEteAu_N0Axe-H83yUqD59ce43gpEmvw&oe=66AFCF1D"
												alt="Your avatar"
											/>
											<input
												className="ml-3 w-full bg-gray-100 rounded-full px-3 py-2 text-sm text-gray-700"
												type="text"
												placeholder="Phản hồi bình luận Trung"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}

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
							setOpenSavePostForm={setOpenSavePostForm}
							setChosenForumPostId={setChosenForumPostId}
							chosenForumPostId={chosenForumPostId}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
