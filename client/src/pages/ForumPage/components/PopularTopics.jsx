import React from 'react';
import { BsPostcardHeartFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import {
	getAllForumPostsByTopic,
} from '../../../features/topics/topicSlice';
import { useDispatch } from 'react-redux';
import goldMedal from '../../../../public/image/gold-medal.png';
import silverMedal from '../../../../public/image/silver-medal.png';
import copperMedal from '../../../../public/image/copper-medal.png';

export const PopularTopics = ({setForumPosts, mostPopularTopics, onCreateForumPost}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleTopicClick = async (topicId) => {
		const output = await dispatch(getAllForumPostsByTopic(topicId));
		if(output.type.includes('fulfilled')){
			setForumPosts(output.payload)
		} else{
			setForumPosts([])
		}
	};
	const handleBackToHome = () => {
		navigate('/discussions/');
	};

	return (
		<div className="p-4">
			<div className={`bg-white rounded-lg shadow-md p-4 space-y-2`}>
				<button
					className="bg-primary text-white rounded-xl px-5 py-2 w-full font-semibold	hover:bg-primary_dark"
					onClick={onCreateForumPost}
				>
					Tạo thảo luận
				</button>
				<button
					className="bg-green text-white rounded-xl px-5 py-2 w-full font-semibold hover:bg-primary_dark"
					onClick={() => handleBackToHome()}
				>
					Trang chủ
				</button>
				<div
					className="flex items-center p-3 rounded-md gap-2 hover:bg-primary  transition duration-300 cursor-pointer hvr-shutter-in-horizontal"
					onClick={() => navigate('/forum/repositories')}
				>
					<BsPostcardHeartFill className="text-white bg-green rounded-full w-7 h-7 p-1" />
					<div className="font-semibold">Bài viết đã lưu</div>
				</div>
			</div>

			<div className={`bg-white mt-4 p-6 rounded-lg shadow-lg`}>
				<h2 className="text-base font-semibold mb-3">Chủ đề phổ biến</h2>
				{mostPopularTopics?.map((pTopics, index) => {
					let medal;
					if (index === 0) {
						medal = goldMedal;
					} else if (index === 1) {
						medal = silverMedal;
					} else if (index === 2) {
						medal = copperMedal;
					}

					return (
						<div key={index}>
							<div
								className="flex items-center mb-4 hover:bg-primary hover:text-white p-2 rounded-lg cursor-pointer hvr-shutter-in-horizontal group"
								onClick={() => handleTopicClick(pTopics._id)}
							>
								{index <= 2 && (
									<img className="h-10 w-10 mr-2" src={medal} alt="medal" />
								)}
								<div className="font-semibold text-lg">
									{pTopics?.topicDetails?.topicName}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
