import React, { useState, useRef } from "react";
import YouTube from "react-youtube";
import { finishVideoByAccount } from "../../features/videos/videoSlice";
import { useDispatch } from "react-redux";

const VideoPlayer = ({ videoUrl, videoId }) => {
  const [isWatchedEnough, setIsWatchedEnough] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);
  const dispatch = useDispatch()

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    setDuration(playerRef.current.getDuration());
  };

  const onPlayerStateChange = (event) => {
    if (event.data === 1) {
      // When playing
      updateWatchTime();
    } else if (event.data === 2 || event.data === 0) {
      // When paused or ended
      clearInterval(playerRef.current.intervalId);
    }
  };

  const updateWatchTime = () => {
    playerRef.current.intervalId = setInterval(() => {
      const currentTime = playerRef.current.getCurrentTime();
      setCurrentTime(currentTime);

      if (currentTime >= duration * 0.8 && !isWatchedEnough) {
        setIsWatchedEnough(true);
		handleFinishVideoByAccount(videoId);
        clearInterval(playerRef.current.intervalId);
      }
    }, 1000);
  };

  const handleFinishVideoByAccount = async (videoId) => {
	try {
	  await dispatch(finishVideoByAccount(videoId));
	} catch (error) {
	  console.error('Error finishing video:', error);
	}
  };

  const opts = {
    height: "360",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="">
      <YouTube
        videoId={videoUrl}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
      />
      <p className="font-bold my-6 text-lg flex justify-center">
        <div>Thời gian xem hiện tại:</div>
        <div className="font-semibold pl-4 text-gray">
          {formatTime(currentTime)}{" "}
        </div>
      </p>
      {isWatchedEnough ? (
        <p className="text-center">
          Bạn đã xem đủ 80% thời lượng video, bạn có thể xem video tiếp theo.
        </p>
      ) : (
        <p className="text-red font-semibold text-center">
          Phải xem đủ 80% thời lượng video. Mới được xem video tiếp theo!
        </p>
      )}
    </div>
  );
};

export default VideoPlayer;
