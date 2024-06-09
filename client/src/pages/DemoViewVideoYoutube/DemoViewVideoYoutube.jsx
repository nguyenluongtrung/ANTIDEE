import { useState } from "react";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";

export const DemoViewVideoYoutube = () => {
  const [nowVideo, setNowVideo] = useState("M8r3x4Re8-I");

  return (
    <div className="">
      <h1 className="text-center text-xl font-bold pb-6 text-primary">
        Xem video hướng dẫn dọn nhà
      </h1>
      <div className="flex items-center justify-center">
        <VideoPlayer videoId={nowVideo} />
        {/* <VideoPlayer videoId="KypuJGsZ8pQ?si=YpeOvTmSEN7K0XX4" requiredWatchTime={8 * 60} /> */}
      </div>
      <div className="flex mx-auto justify-around px-56 mt-10">
        <div
          className="p-4 bg-primary rounded-lg text-center cursor-pointer text-white"
          onClick={() => setNowVideo("M8r3x4Re8-I")}
        >
          Pre Video
        </div>
        <div
          className="p-4 bg-primary rounded-lg text-center cursor-pointer text-white"
          onClick={() => setNowVideo("5sT20edl02I")}
        >
          Next Video
        </div>
      </div>
    </div>
  );
};
