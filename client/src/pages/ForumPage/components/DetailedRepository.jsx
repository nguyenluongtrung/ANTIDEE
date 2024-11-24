import { FaRegHeart } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';

export const DetailedRepository = () => {
	const location = useLocation();
    const navigate = useNavigate()
	const { repository } = location.state || {};

	return (
		<div className="rounded-lg shadow-lg py-4 px-6 my-4">
			{repository?.postsList.map((post) => {
				return (
					<div className="">
						<p className="font-semibold text-[16px]"></p>
						<div className="p-2 rounded-lg mb-3 border border-light_gray hover:bg-light_gray cursor-pointer" onClick={() => navigate(`/forum/discussions/${post?.postId?._id}`)}>
							<p className="text-base font-semibold mb-3 truncate max-w-[600px]">{post?.postId?.content}</p>
							<div>
								<span className="bg-primary mr-3 px-4 py-1 rounded-md text-white">
									giúp việc
								</span>
								<p className=" mt-3 text-sm flex items-center gap-1">
									1<FaRegHeart size={10} />
								</p>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
