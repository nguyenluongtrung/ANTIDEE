import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getForumRepositories } from '../../features/forumPost/forumPostSlice';
import { useNavigate } from 'react-router-dom';

export const ForumRepositories = () => {
	const [repositories, setRepositories] = useState([]);
	const dispatch = useDispatch();
    const navigate = useNavigate()

	useEffect(() => {
		const getAllRepositories = async () => {
			const response = await dispatch(getForumRepositories());
			setRepositories(response.payload);
		};
		getAllRepositories();
	}, []);
	return (
		<div className='rounded-lg shadow-lg py-4 px-6 my-4'>
			<p className='text-center text-green font-semibold text-[20px] mb-3'>Bộ sưu tập của tôi</p>
			{repositories.map((repo, index) => {
				return (
					<div className="flex gap-4 items-center rounded-md p-2 hover:bg-[#ebeced] hover:cursor-pointer" onClick={() => navigate(`/forum/repositories/${repo._id}`, { state: { repository: repo } })}>
						<div className='rounded-md w-12 h-12 flex justify-center items-center bg-yellow'>{index + 1}</div>
						<p className='font-semibold text-[16px]'>{repo.repositoryName}</p>
                        <div className='ml-auto'>
                            <p className='rounded-lg py-1 px-3 bg-light_pink'>{repo.postsList.length} bài viết</p>
                        </div>
					</div>
				);
			})}
		</div>
	);
};
