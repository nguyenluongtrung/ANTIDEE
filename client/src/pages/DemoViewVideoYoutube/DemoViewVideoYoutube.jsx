import { useEffect, useState } from "react";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import { getAllVideos } from "../../features/videos/videoSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../components";

export const DemoViewVideoYoutube = () => {
  const { videos, isLoading } = useSelector((state) => state.videos);
  const dispatch = useDispatch();

  const [indexOfVideo, setIndexOfVideo] = useState(0);
  const [nowVideo, setNowVideo] = useState(null);

  useEffect(() => {
    dispatch(getAllVideos());
  }, [dispatch]);

  useEffect(() => {
    if (videos && videos.length > 0) {
      setNowVideo(videos[indexOfVideo]);
    }
  }, [videos, indexOfVideo]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!videos || videos.length === 0) {
    return <div>No videos available</div>;
  }

  const nextVideo = () => {
    if (indexOfVideo < videos.length - 1) {
      setIndexOfVideo(indexOfVideo + 1);
    }
  };

  const prevVideo = () => {
    if (indexOfVideo > 0) {
      setIndexOfVideo(indexOfVideo - 1);
    }
  };

  return (
    <div className="pt-20">
      {nowVideo ? (
        <>
          <h1 className="text-center text-xl font-bold pb-6 text-primary">
            {nowVideo.title}
          </h1>
          <div className="flex items-center justify-center">
            <VideoPlayer videoId={nowVideo.url} />
          </div>
          <div className="flex items-center justify-center">
            Mô tả video: {nowVideo.description}
          </div>
          <div className="flex mx-auto justify-around px-56 mt-10">
            <div
              className="p-4 bg-primary rounded-lg text-center cursor-pointer text-white"
              onClick={prevVideo}
            >
              Pre Video
            </div>
            <div
              className="p-4 bg-primary rounded-lg text-center cursor-pointer text-white"
              onClick={nextVideo}
            >
              Next Video
            </div>
          </div>
        </>
      ) : (
        <div>Loading video...</div>
      )}
    </div>
  );
};
