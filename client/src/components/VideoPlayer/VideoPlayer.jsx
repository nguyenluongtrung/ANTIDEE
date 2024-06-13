import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import YouTube from "react-youtube";

const VideoPlayer = ({ videoId }) => {
  const [isWatchedEnough, setIsWatchedEnough] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const playerRef = useRef(null);
  const lastTimeRef = useRef(0);

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
    } else if (event.data === 3) {
      // When buffering
      checkForSkip();
    }
  };

  useEffect(() => {
    if (showWarning) {
      toast.error("Bạn không được phép tua video quá 30 giây");
      setShowWarning(false);
    }
  }, [showWarning]);

  const checkForSkip = () => {
    const currentTime = playerRef.current.getCurrentTime();
    if (currentTime - lastTimeRef.current > 30) {
      // If skipped more than 60 seconds
      setShowWarning(true);
      playerRef.current.seekTo(lastTimeRef.current); // Seek back to last time
    } else {
      lastTimeRef.current = currentTime;
      setShowWarning(false);
    }
  };

  const updateWatchTime = () => {
    playerRef.current.intervalId = setInterval(() => {
      const currentTime = playerRef.current.getCurrentTime();
      setCurrentTime(currentTime);
      lastTimeRef.current = currentTime;
      if (currentTime >= duration * 0.8) {
        setIsWatchedEnough(true);
        clearInterval(playerRef.current.intervalId);
      }
    }, 1000);
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
        videoId={videoId}
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
