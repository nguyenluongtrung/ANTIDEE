import { useEffect, useState } from 'react';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import { getAllVideos } from '../../features/videos/videoSlice';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../components';

export const VideoDetail = () => {
	const dispatch = useDispatch();
	const { videoId } = useParams();
	const [video, setVideo] = useState();

  console.log(videoId)

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

  if(!video){
    return <Spinner />
  }

	return (
		<div className="pt-20">
			<h1 className="text-center text-xl font-bold pb-6 text-primary">
				{video.title}
			</h1>
			<div className="flex items-center justify-center">
				<VideoPlayer videoId={video.url} />
			</div>
			<div className="flex items-center justify-center">
				Mô tả video: {video.description}
			</div>
		</div>
	);
};
