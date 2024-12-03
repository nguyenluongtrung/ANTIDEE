import { AiOutlineClose } from 'react-icons/ai';
import { FaRegHeart } from 'react-icons/fa6';

export const DetailedRepository = ({
	selectedForumRepository,
	onClose,
	onOpenTopDiscussionDetail,
}) => {
	return (
		<div className="popup active">
			<div className="overlay"></div>
			<div className="content rounded-md p-5 w-[40vw] max-h-[80%] overflow-y-auto">
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={onClose}
				/>
				<p className="text-center text-green font-semibold text-[20px] mb-3">
					{selectedForumRepository.repositoryName}
				</p>
				{selectedForumRepository?.postsList
					.filter((post) => post.postId != null)
					.map((post) => {
						return (
							<div className="">
								<p className="font-semibold text-[16px]"></p>
								<div
									className="p-2 rounded-lg mb-3 border border-light_gray hover:bg-light_gray cursor-pointer"
									onClick={() => onOpenTopDiscussionDetail(post?.postId._id)}
								>
									<p className="text-base font-semibold mb-3 truncate max-w-[600px]">
										{post?.postId?.title}
									</p>
									{post?.postId?.topic && (
										<div className="flex flex-wrap gap-1 my-2">
											{post?.postId.topic &&
												post?.postId.topic.length > 0 &&
												post?.postId.topic.slice(0, 2).map((topic) => (
													<div
														key={topic._id}
														className="bg-yellow text-[12px] px-2 py-1 rounded-md text-white"
													>
														{topic.topicName}
													</div>
												))}
											{post?.postId.topic && post?.postId.topic.length > 2 && (
												<div className="bg-gray-200 text-[12px] py-1 rounded-md text-gray">
													+ {post?.postId.topic.length - 2} chủ đề khác
												</div>
											)}
										</div>
									)}
									<div>
										<p className=" mt-3 text-sm flex items-center gap-1">
											{post?.postId?.likes.length}
											<FaRegHeart size={10} />
										</p>
									</div>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};
