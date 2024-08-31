import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import {
	getForumRepositories,
	saveForumPost,
} from '../../../features/forumPost/forumPostSlice';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';

export const SavePostForm = ({
	setOpenSavePostForm,
	setChosenForumPostId,
	chosenForumPostId,
}) => {
	const [createNewRepo, setCreateNewRepo] = useState(false);
	const [repositoryName, setRepositoryName] = useState('');
	const [repositories, setRepositories] = useState([]);
	const dispatch = useDispatch();

	const savePost = async (e) => {
		e.preventDefault();
		const response = await dispatch(
			saveForumPost({ chosenForumPostId, repositoryName })
		);
		if (response.type.endsWith('fulfilled')) {
			toast.success(`Đã lưu bài đăng vào '${repositoryName}'`, successStyle);
		} else if (response?.error?.message === 'Rejected') {
			toast.error(response?.payload, errorStyle);
		}
		setChosenForumPostId(undefined);
		setOpenSavePostForm(false);
		return response;
	};

	useEffect(() => {
		const getAllRepositories = async () => {
			const response = await dispatch(getForumRepositories());
			console.log(response.payload);
			setRepositories(response.payload);
		};
		getAllRepositories();
	}, []);

	return (
		<div className="popup active">
			<div className="overlay">
				<form className="content w-[500px] rounded-md p-5" onSubmit={savePost}>
					<AiOutlineClose
						className="absolute text-sm hover:cursor-pointer right-5 top-6"
						onClick={() => setOpenSavePostForm(false)}
						size={20}
					/>
					<p className="text-center text-[16px] mb-5">Lưu vào</p>
					<div className='max-h-[200px] overflow-y-auto'>
					{repositories.map((repo, index) => {
						return (
							<div className="flex items-center hover:bg-[#ebeced] rounded-md p-2 hover:cursor-pointer">
								<div className="bg-yellow w-[50px] h-[50px] rounded-md mr-3 flex justify-center items-center">
									<p className="text-[20px]">{index + 1}</p>
								</div>
								<p>{repo.repositoryName}</p>
								<div className="ml-auto">
									<input type="radio" onClick={() => setRepositoryName(repo.repositoryName)}/>
								</div>
							</div>
						);
					})}
					</div>

					{createNewRepo ? (
						<div className="flex border-y-[1px] border-gray items-center gap-3 my-3 py-2 hover:cursor-pointer">
							<textarea
								rows={1}
								placeholder="Nhập tên bộ sưu tập mới..."
								className="w-[100%] resize-none border-[1px] py-1 px-2 rounded-md border-primary focus:outline-primary"
								onChange={(e) => setRepositoryName(e.target.value)}
							></textarea>
						</div>
					) : (
						<div
							className="flex border-y-[1px] border-gray items-center gap-3 my-3 py-2 hover:cursor-pointer"
							onClick={() => setCreateNewRepo(true)}
						>
							<div className="rounded-full border-[1px] p-2 border-gray hover:bg-[#ebeced]">
								<FaPlus />
							</div>
							<p>Bộ sưu tập mới</p>
						</div>
					)}
					{createNewRepo ? (
						<div className="flex justify-end gap-2">
							<button
								className="rounded-md bg-gray text-white w-[100px] py-1"
								onClick={(e) => {
									e.preventDefault();
									setCreateNewRepo(false);
								}}
							>
								Hủy
							</button>
							<button
								className="rounded-md bg-primary text-white w-[100px] py-1"
								type="submit"
							>
								Xong
							</button>
						</div>
					) : (
						<div className="flex justify-end">
							<button
								className="rounded-md bg-primary text-white w-[100px] py-1"
								type="submit"
							>
								Xong
							</button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};
