import React from 'react';
import { FaRegComment } from 'react-icons/fa6';

export const TopDiscussions = ({
	listTopDiscussions,
	onOpenTopDiscussionDetail,
}) => {
	return (
		<>
			<div className="p-4">
				<div className={`bg-white p-4 mt-4 rounded-lg shadow-md`}>
					<strong className="text-base font-bold block mb-4">
						Thảo luận hàng đầu
					</strong>
					{(listTopDiscussions || []).map((post) => {
						return (
							<div
								className="p-2 rounded-lg mb-3 border border-light_gray hover:bg-light_gray cursor-pointer"
								onClick={() => {
									onOpenTopDiscussionDetail(post._id);
								}}
							>
								<p className="text-base font-semibold mb-3">{post.title}</p>
								<div className="flex flex-wrap gap-1">
									{post.topicDetails &&
										post.topicDetails.length > 0 &&
										post.topicDetails.map((topic) => (
											<div className="bg-yellow text-[12px] px-2 py-1 rounded-md text-white">
												{topic.topicName}
											</div>
										))}
								</div>
								<p className=" mt-3 text-sm flex items-center gap-1">
									{post.commentsCount}
									<FaRegComment size={10} />
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};
