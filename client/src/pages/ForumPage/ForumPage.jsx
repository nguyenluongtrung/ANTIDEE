import { useDispatch } from 'react-redux';
import { PopularTopics } from './components/PopularTopics';
import { TopDiscussions } from './components/TopDiscussions';
import {
	deleteForumPost,
	getAllForumPosts,
	getForumPost,
	getTopDiscussionForumPosts,
} from '../../features/forumPost/forumPostSlice';
import { DetailedForumPost } from './components/DetailedForumPost';
import { useEffect, useState } from 'react';
import { UpdatePostForum } from './components/UpdateForumPost/UpdateForumPost';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllTopics } from '../../features/topics/topicSlice';
import { successStyle } from '../../utils/toast-customize';
import { PostForumInfo } from './components/PostForumInfo/PostForumInfo';

export const ForumPage = () => {
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedForumPost, setSelectedForumPost] = useState();
	const [forumPosts, setForumPosts] = useState([]);
	const [allTopics, setAllTopics] = useState([]);
	const [isOpenUpdatePostForum, setIsOpenUpdatePostForum] = useState(false);
	const [isOpenDetailPostForum, setIsOpenDetailPostForum] = useState(false);
	const [listTopDiscussions, setListTopDiscussions] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const resultFetchTopDiscussionsPosts = await dispatch(
				getTopDiscussionForumPosts()
			);
			setListTopDiscussions(resultFetchTopDiscussionsPosts.payload);
		};

		fetchData();
	}, []);

	const fetchForumPosts = async () => {
		const output = await dispatch(getAllForumPosts());
		if (output.type.includes('fulfilled')) {
			setForumPosts(output.payload);
		} else {
			setForumPosts();
		}
	};

	useEffect(() => {
		fetchForumPosts();
	}, []);

	async function initialAllTopics() {
		let output = await dispatch(getAllTopics());

		if (output.type.includes('fulfilled')) {
			setAllTopics(output.payload);
		} else {
			setAllTopics([]);
		}
	}

	useEffect(() => {
		initialAllTopics();
	}, []);

	const handleOpenUpdatePostForum = async (jobPostId) => {
		const result = await dispatch(getForumPost(jobPostId));
		if (result.type.includes('fulfilled')) {
			setSelectedForumPost(result.payload);
			setIsOpenUpdatePostForum(true);
		} else {
			setIsOpenUpdatePostForum(false);
			toast.error('Có lỗi xảy ra!');
		}
	};

	useEffect(() => {
		const forumPostId = searchParams.get('id');
		if (forumPostId) {
			handleOpenUpdatePostForum(forumPostId);
		}
	}, [searchParams.get('id')]);

	const handleUpdateCommentLocal = (forumPostId) => {
		setForumPosts((prevPosts) => {
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
			fetchForumPosts();
		} else {
			toast.error(result?.payload, errorStyle);
		}
	};

	const handleOpenDiscussionDetail = async (id) => {
		const result = await dispatch(getForumPost(id));
		if (result.type.includes('fulfilled')) {
			setSelectedForumPost(result.payload);
			setIsOpenDetailPostForum(true);
		} else {
			setIsOpenDetailPostForum(false);
			toast.error('Có lỗi xảy ra!');
		}
	}

	return (
		<div>
			{isOpenUpdatePostForum && (
				<UpdatePostForum
					selectedForumPost={selectedForumPost}
					allTopics={allTopics}
					onClose={() => {
						setIsOpenUpdatePostForum(false);
						setSelectedForumPost();
						setSearchParams({});
						fetchForumPosts();
					}}
				/>
			)}
			{isOpenDetailPostForum && (
				<PostForumInfo
					selectedForumPost={selectedForumPost}
					allTopics={allTopics}
					onClose={() => {
						setIsOpenDetailPostForum(false);
						setSelectedForumPost();
						setSearchParams({});
						fetchForumPosts();
					}}
				/>
			)}
			<div className={`discussion mt-14`}>
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-4">
					<PopularTopics setForumPosts={setForumPosts} allTopics={allTopics}/>
					<div className="p-4">
						{forumPosts?.map((post) => {
							return (
								<DetailedForumPost
									postContent={post}
									onDeleteForumPost={() => handleDeleteForumPost(post._id)}
									handleUpdateCommentLocal={() =>
										handleUpdateCommentLocal(post._id)
									}
									onUpdateForumPost={() => {
										setSearchParams({ id: post?._id });
										handleOpenUpdatePostForum(post?._id);
									}}
									setForumPosts={setForumPosts}
									setSearchParams={setSearchParams}
								/>
							);
						})}
					</div>
					<TopDiscussions listTopDiscussions={listTopDiscussions} onOpenTopDiscussionDetail={handleOpenDiscussionDetail}/>
				</div>
			</div>
		</div>
	);
};
