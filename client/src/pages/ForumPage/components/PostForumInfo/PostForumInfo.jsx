import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import './PostForumInfo.css';

export const PostForumInfo = ({ selectedForumPost, onClose }) => {
	const allTopicName =
		selectedForumPost.topic && selectedForumPost.topic.length > 0
			? selectedForumPost.topic.map((topic, index) => {
					return (
						topic.topicName +
						(index !== selectedForumPost.topic.length - 1 ? ', ' : '')
					);
			  })
			: '';
	return (
		<div className="popup active">
			<div className="overlay"></div>
			<div className="content rounded-md p-5 w-[40vw] max-h-[80%] overflow-y-auto">
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={onClose}
				/>
				<div className="mt-3">
					<p className="font-semibold text-center text-[16px] text-primary uppercase">
						{selectedForumPost?.title}
					</p>
				</div>
				{allTopicName && (
					<div className="mt-1 flex justify-center gap-2 text-gray">
						<p className="underline">Chủ đề:</p>
						<p className="truncate max-w-[300px]">{allTopicName}</p>
					</div>
				)}
				<div className="mt-3">
					<p className="text-justify">{selectedForumPost?.content}</p>
				</div>
				<div className="mt-3 flex items-center gap-2">
					<img className="!w-full" src={selectedForumPost.images[0]} />
				</div>
			</div>
		</div>
	);
};
