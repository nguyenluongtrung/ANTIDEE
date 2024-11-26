import { useDispatch } from 'react-redux';
import { PopularTopics } from './components/PopularTopics';
import { TopDiscussions } from './components/TopDiscussions';
import {
	deleteForumPost,
	getAllForumPosts,
	getForumPost,
	getForumRepositories,
	getForumRepository,
	getTopDiscussionForumPosts,
} from '../../features/forumPost/forumPostSlice';
import { DetailedForumPost } from './components/DetailedForumPost';
import { useEffect, useState } from 'react';
import { UpdatePostForum } from './components/UpdateForumPost/UpdateForumPost';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
	getAllTopics,
	getMostPopularTopics,
} from '../../features/topics/topicSlice';
import { successStyle } from '../../utils/toast-customize';
import { PostForumInfo } from './components/PostForumInfo/PostForumInfo';
import { CreatePostForum } from './components/CreateForumPost/CreateForumPost';
import { ForumRepositories } from './components/ForumRepositories';
import { DetailedRepository } from './components/DetailedRepository';

export const ForumPage = () => {
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedForumPost, setSelectedForumPost] = useState();
	const [selectedForumRepository, setSelectedForumRepository] = useState();
	const [forumPosts, setForumPosts] = useState([]);
	const [allTopics, setAllTopics] = useState([]);
	const [isOpenUpdatePostForum, setIsOpenUpdatePostForum] = useState(false);
	const [isOpenDetailPostForum, setIsOpenDetailPostForum] = useState(false);
	const [isOpenCreatePostForum, setIsOpenCreatePostForum] = useState(false);
	const [isOpenMyRepositories, setIsOpenMyRepositories] = useState(false);
	const [isOpenRepositoryDetail, setIsOpenRepositoryDetail] = useState(false);
	const [listTopDiscussions, setListTopDiscussions] = useState([]);
	const [mostPopularTopics, setMostPopularTopics] = useState([]);
	const [repositories, setRepositories] = useState([]);

	const fetchAllRepositories = async () => {
		const result = await dispatch(getForumRepositories());
		if (result.type.includes('fulfilled')) {
			setRepositories(result.payload);
		} else {
			setRepositories();
		}
	};

	async function fetchPopularTopics() {
		let output = await dispatch(getMostPopularTopics());

		setMostPopularTopics(output.payload);
	}

	const fetchForumPosts = async () => {
		const result = await dispatch(getAllForumPosts());
		if (result.type.includes('fulfilled')) {
			setForumPosts(result.payload);
		} else {
			setForumPosts();
		}
	};

	const fetchTopDiscussions = async () => {
		const result = await dispatch(getTopDiscussionForumPosts());
		if (result.type.includes('fulfilled')) {
			setListTopDiscussions(result.payload);
		} else {
			setListTopDiscussions();
		}
	};

	async function fetchAllTopics() {
		let output = await dispatch(getAllTopics());

		if (output.type.includes('fulfilled')) {
			setAllTopics(output.payload);
		} else {
			setAllTopics([]);
		}
	}

	useEffect(() => {
		fetchAllRepositories();
	}, []);

	useEffect(() => {
		fetchPopularTopics();
	}, []);

	useEffect(() => {
		fetchTopDiscussions();
	}, []);

	useEffect(() => {
		fetchForumPosts();
	}, []);

	useEffect(() => {
		fetchAllTopics();
	}, []);

	const handleOpenUpdatePostForum = async (jobPostId) => {
		if (jobPostId) {
			const result = await dispatch(getForumPost(jobPostId));
			if (result.type.includes('fulfilled')) {
				setSelectedForumPost(result.payload);
				setIsOpenUpdatePostForum(true);
			} else {
				setIsOpenUpdatePostForum(false);
				toast.error('Có lỗi xảy ra!');
			}
		}
	};

	const handleDeleteForumPost = async (forumPostId) => {
		const result = await dispatch(deleteForumPost(forumPostId));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Bài viết đã được xóa', successStyle);
			fetchForumPosts();
		} else {
			toast.error(result?.payload, errorStyle);
		}
		fetchTopDiscussions();
		fetchAllTopics();
	};

	const handleOpenDiscussionDetail = async (id) => {
		if (id) {
			const result = await dispatch(getForumPost(id));
			if (result.type.includes('fulfilled')) {
				setSelectedForumPost(result.payload);
				setIsOpenDetailPostForum(true);
			} else {
				setIsOpenDetailPostForum(false);
				toast.error('Có lỗi xảy ra!');
			}
		}
	};

	const handleOpenRepositoryDetail = async (id) => {
		if (id) {
			const result = await dispatch(getForumRepository(id));
			if (result.type.includes('fulfilled')) {
				setSelectedForumRepository(result.payload);
				setIsOpenRepositoryDetail(true);
			} else {
				setIsOpenRepositoryDetail(false);
				toast.error('Có lỗi xảy ra!');
			}
		}
	};

	useEffect(() => {
		const forumPostId = searchParams.get('id');
		const action = searchParams.get('action');
		if (forumPostId && action) {
			if (action == 'update') {
				handleOpenUpdatePostForum(forumPostId);
			} else if (action == 'detail') {
				handleOpenDiscussionDetail(forumPostId);
			}
		}
	}, [searchParams.get('id'), searchParams.get('action')]);

	return (
		<div>
			{isOpenCreatePostForum && (
				<CreatePostForum
					allTopics={allTopics}
					setForumPosts={setForumPosts}
					onClose={() => {
						setIsOpenCreatePostForum(false);
						fetchForumPosts();
						fetchTopDiscussions();
						fetchPopularTopics();
					}}
				/>
			)}
			{isOpenUpdatePostForum && (
				<UpdatePostForum
					selectedForumPost={selectedForumPost}
					allTopics={allTopics}
					onClose={() => {
						setIsOpenUpdatePostForum(false);
						setSelectedForumPost();
						setSearchParams({});
						fetchForumPosts();
						fetchTopDiscussions();
						fetchPopularTopics();
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
						fetchTopDiscussions();
						fetchPopularTopics();
					}}
				/>
			)}
			{isOpenMyRepositories && (
				<ForumRepositories
					selectedForumPost={selectedForumPost}
					repositories={repositories}
					onOpenRepositoryDetail={(repoId) => {
						setIsOpenMyRepositories(false);
						handleOpenRepositoryDetail(repoId);
					}}
					onClose={() => {
						setIsOpenMyRepositories(false);
						fetchForumPosts();
						fetchTopDiscussions();
						fetchPopularTopics();
					}}
				/>
			)}
			{isOpenRepositoryDetail && (
				<DetailedRepository
					selectedForumRepository={selectedForumRepository}
					onClose={() => {
						setIsOpenRepositoryDetail(false);
					}}
					onOpenTopDiscussionDetail={(postId) => {
						setSearchParams({ id: postId, action: 'detail' });
						setIsOpenRepositoryDetail(false);
						handleOpenDiscussionDetail();
					}}
				/>
			)}
			<div className={`discussion mt-14`}>
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-4">
					<PopularTopics
						setForumPosts={setForumPosts}
						mostPopularTopics={mostPopularTopics}
						onCreateForumPost={() => {
							setIsOpenCreatePostForum(true);
						}}
						onOpenMyRepositories={() => {
							setIsOpenMyRepositories(true);
						}}
					/>
					<div className="p-4">
						{forumPosts?.map((post) => {
							return (
								<DetailedForumPost
									postContent={post}
									onDeleteForumPost={() => handleDeleteForumPost(post._id)}
									onUpdateForumPost={() => {
										setSearchParams({ id: post?._id, action: 'update' });
										handleOpenUpdatePostForum(post?._id);
									}}
									refetchData={() => {
										fetchForumPosts();
										fetchTopDiscussions();
										fetchPopularTopics();
										fetchAllRepositories();
									}}
									setForumPosts={setForumPosts}
									repositories={repositories}
								/>
							);
						})}
					</div>
					<TopDiscussions
						listTopDiscussions={listTopDiscussions}
						onOpenTopDiscussionDetail={(postId) => {
							setSearchParams({ id: postId, action: 'detail' });
							handleOpenDiscussionDetail();
						}}
					/>
				</div>
			</div>
		</div>
	);
};
