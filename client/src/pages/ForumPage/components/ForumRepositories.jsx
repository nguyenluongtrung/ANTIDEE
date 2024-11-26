import { AiOutlineClose } from 'react-icons/ai';

export const ForumRepositories = ({ repositories, onClose, onOpenRepositoryDetail }) => {
	
	return (
		<div className="popup active">
			<div className="overlay"></div>
			<div className="content rounded-md p-5 w-[40vw] max-h-[80%] overflow-y-auto">
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={onClose}
				/>
				<p className="text-center text-green font-semibold text-[20px] mb-3">
					Bộ sưu tập của tôi
				</p>
				{repositories.map((repo, index) => {
					return (
						<div
							className="flex gap-4 items-center rounded-md p-2 hover:bg-[#ebeced] hover:cursor-pointer"
							onClick={() => onOpenRepositoryDetail(repo._id)}
						>
							<div className="rounded-md w-12 h-12 flex justify-center items-center bg-yellow">
								{index + 1}
							</div>
							<p className="font-semibold text-[16px]">{repo.repositoryName}</p>
							<div className="ml-auto">
								<p className="rounded-lg py-1 px-3 bg-light_pink">
									{repo.postsList.length} bài viết
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
