import { useEffect, useState } from 'react';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import { getAllVideos } from '../../features/videos/videoSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '../../components';
import { FaAngleLeft } from 'react-icons/fa6';

export const VideoDetail = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { videoId } = useParams();
	const [video, setVideo] = useState();

	useEffect(() => {
		const fetchVideo = async () => {
			const response = await dispatch(getAllVideos());
			if (response.type.endsWith('fulfilled')) {
				const video = response.payload.find((item) => item._id === videoId);
				setVideo(video);
			}
		};

		fetchVideo();
	}, [dispatch, videoId]);

	if (!video) {
		return <Spinner />;
	}

	return (
		<div className="pt-20">
			<h1 className="text-center text-xl font-bold pb-6 text-primary">
				{video.title}
			</h1>
			<div className="flex items-center justify-center">
				<VideoPlayer videoUrl={video.url} videoId={video._id} />
			</div>
			<div className="flex items-center justify-center">
				Mô tả video: {video.description}
			</div>
			<div
				className="flex items-center justify-center p-3 my-5 mx-auto bg-primary rounded-lg w-[150px] md:w-[150px] text-center text-white font-bold cursor-pointer hover:bg-primary_dark"
				onClick={() => navigate(-1)}
			>
				<FaAngleLeft size={24} className="mr-2" />
				Quay lại
			</div>
		</div>
	);
};
