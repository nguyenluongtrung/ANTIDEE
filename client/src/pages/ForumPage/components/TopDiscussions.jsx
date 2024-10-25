import React, { useEffect, useState } from 'react';
import { FaRegComment, FaRegHeart } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { getTopDiscussionForumPosts } from '../../../features/forumPost/forumPostSlice';
import { Link } from 'react-router-dom'

export const TopDiscussions = () => {

	const dispatch = useDispatch();

	const [listTopDiscussions, setListTopDiscussions] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const resultFetchTopDiscussionsPosts = await dispatch(getTopDiscussionForumPosts())
			console.log("Xem data", resultFetchTopDiscussionsPosts.payload)
			setListTopDiscussions(resultFetchTopDiscussionsPosts.payload)
		}

		fetchData()
	}, [])

	return (
		<>
			<div className="p-4">
				<div className={`bg-white p-4 mt-4 rounded-lg shadow-md`}>
					<strong className="text-base font-bold block mb-4">
						Thảo luận hàng đầu
					</strong>
					{(listTopDiscussions || []).map((post) => {
						return (
							<Link to={`/forum/discussions/${post.forumPostId}`}>
								<div className="p-2 rounded-lg mb-3 border border-light_gray hover:bg-light_gray cursor-pointer">
									<p className="text-base font-semibold mb-3">
										{post.title}
									</p>
									<div>
										<span className="bg-primary mr-3 px-4 py-1 rounded-md text-white">
											giúp việc
										</span>
										<p className=" mt-3 text-sm flex items-center gap-1">
											{post.commentsCount}<FaRegComment size={10} />
										</p>
									</div>
								</div>
							</Link>
						)
					})
					}
				</div>
			</div>
		</>
	);
};
