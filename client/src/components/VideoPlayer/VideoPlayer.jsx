import React, { useState, useRef, useEffect } from "react";
import { finishVideoByAccount } from "../../features/videos/videoSlice";
import { useDispatch } from "react-redux";

const VideoPlayer = ({ videoUrl, videoId }) => {
  const [isWatchedEnough, setIsWatchedEnough] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const videoRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isWatchedEnough) {
      handleFinishVideoByAccount(videoUrl);
    }
  }, [isWatchedEnough, videoUrl]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    setDuration(video.duration);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const currentTime = video.currentTime;
    setCurrentTime(currentTime);

    if (currentTime >= duration * 0.8 && !isWatchedEnough) {
      setIsWatchedEnough(true);
    }
  };

  const handleFinishVideoByAccount = async () => {
    try {
     await dispatch(finishVideoByAccount(videoId));
    } catch (error) {
      setErrorMessage("An error occurred while updating video progress.");
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div className="video-player-container">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        width="640"
        height="360"
      />
      <div className="progress-container">
        <p className="font-bold my-6 text-lg flex justify-center">
          <div>Thời gian xem hiện tại:</div>
          <div className="font-semibold pl-4 text-gray">
            {formatTime(currentTime)}{" "}
          </div>
        </p>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      {isWatchedEnough ? (
        <p className="text-center text-green font-semibold">
          Bạn đã hoàn thành video!
        </p>
      ) : (
        <p className="text-red-600 font-semibold text-center">
          Bạn cần xem ít nhất 80% thời lượng video
        </p>
      )}
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
    </div>
  );
};

export default VideoPlayer;
