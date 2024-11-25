import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import './PostForumInfo.css';

export const PostForumInfo = ({ selectedForumPost, onClose }) => {
	return (
		<div className="popup active">
			<div className="overlay"></div>
			<div className="content rounded-md p-5 w-[40vw] max-h-[80%] overflow-y-auto">
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={onClose}
				/>
				<div className="mt-3">
					<p className='font-semibold text-center text-[16px] text-primary uppercase'>{selectedForumPost?.title}</p>
				</div>
				<div className="mt-3 flex justify-center gap-2 text-gray">
					<p>Chủ đề:</p>
					<div className="flex">
						{selectedForumPost.topic.map((topic, index) => (
							<p className='italic'>{topic.topicName}{index !== selectedForumPost.topic.length - 1 && ','} </p>
						))}
					</div>
				</div>
				<div className="mt-3">
					<p className='text-justify'>{selectedForumPost?.content}</p>
				</div>
				<div className="mt-3 flex items-center gap-2">
					<img className='!w-full' src={selectedForumPost.images[0]} />
				</div>
			</div>
		</div>
	);
};
