import './ForumPage.css';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	deleteForumPost,
	getAllForumPosts,
} from '../../features/forumPost/forumPostSlice';
import { DetailedForumPost } from './components/DetailedForumPost';
import { errorStyle, successStyle } from '../../utils/toast-customize';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { getAllForumPostsByTopic } from '../../features/topics/topicSlice';

export const ForumDiscussions = () => {
	const dispatch = useDispatch();
	const [forumPost, setForumPost] = useState([]);
	const {topicId} = useParams();
	console.log(forumPost);

	async function fetchForumPosts() {
		try {
			let output;
			if (topicId) {
				output = await dispatch(getAllForumPostsByTopic(topicId));
				if (output.payload) {
					let sortedPosts = [...output.payload].sort(
						(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
					);
					setForumPost(sortedPosts);
				} else {
					console.error('No posts found.');
				}
			} else {
				output = await dispatch(getAllForumPosts());
			}
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
		fetchForumPosts();
	}, [topicId]);
	


	const handleUpdateCommentLocal = (forumPostId) => {
		setForumPost((prevPosts) => {
			const updatedPost = [...prevPosts];
			const foundPostIndex = updatedPost.findIndex(
				(post) => post._id == forumPostId
			);
			return prevPosts;
		});
	};

	const handleDeleteForumPost = async (forumPostId) => {
		const result = await dispatch(deleteForumPost(forumPostId));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Bài viết đã được xóa', successStyle);
			setForumPost((prevPosts) => {
				return prevPosts.filter((post) => post._id !== forumPostId);
			});
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
	};

	return (
		<div className="p-4">
			{forumPost?.map((post) => {
				return (
					<DetailedForumPost
						postContent={post}
						handleDeleteForumPost={() => handleDeleteForumPost(post._id)}
						handleUpdateCommentLocal={() =>
							handleUpdateCommentLocal(post._id)
						}
						setForumPost={setForumPost}
					/>
				);
			})}
		</div>
	);
};
