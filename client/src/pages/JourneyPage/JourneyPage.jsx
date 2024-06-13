import { StepBar } from "./StepBar/StepBar";
import "./JourneyPage.css";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaAngleLeft, FaAngleRight, FaLock } from "react-icons/fa";
import { FaBusinessTime } from "react-icons/fa6";
import { useState } from "react";
import { useSelector } from "react-redux";

export const JourneyPage = () => {
  const { account, isLoading } = useSelector((state) => state.auth);

  const haveAccount = account?.accountLevel?.domesticHelperLevel?.name;

  const progress = 20;
  const [nowJourney, setNowJourney] = useState(0);
  const journey = [
    {
      level: "Kiến con",
      leveltitle: "Cấp 1",
      imagelevel: "./../../../public/image/kien_con.jpg",
      reward: "- Nhận thêm 100 Apoint",
    },
    {
      level: "Kiến trưởng thành",
      leveltitle: "Cấp 2",
      imagelevel: "./../../../public/image/kien_truong_thanh.jpg",
      reward: "- Nhận thêm 100 Apoint và 200 vpoints",
    },
    {
      level: "Kiến thợ",
      leveltitle: "Cấp 3",
      imagelevel: "./../../../public/image/kien_tho.jpg",
      reward: "- Nhận thêm 100 Apoint và 200 vpoints và ...",
    },
    {
      level: "Kiến chiến binh",
      leveltitle: "Cấp 4",
      imagelevel: "./../../../public/image/kien_chien_binh.jpg",
      reward: "- Nhận thêm 1000 Apoint và 200 vpoints và ...",
    },
    {
      level: "Kiến chúa",
      leveltitle: "Cấp 5",
      imagelevel: "./../../../public/image/kien_chua.png",
      reward: "- Nhận thêm 1000 Apoint và 200 vpoints và ...",
    },
  ];

  const levels = [
    "Kiến con",
    "Kiến trưởng thành",
    "Kiến thợ",
    "Kiến chiến binh",
    "Kiến chúa",
  ];

  const currentLevelIndex = levels.indexOf(haveAccount);

  const isLocked = (index) => {
    return index > currentLevelIndex;
  };

  return (
    <div className="px-32 flex flex-col pt-20">
      <div className="font-bold text-green text-2xl text-center mb-6">
        HÀNH TRÌNH
      </div>
      <div className="flex flex-col gap-y-6 w-full p-6 custom-background">
        <div className="font-bold text-sm">Hành trình của tôi</div>
        <div>
          <StepBar nowJourney={nowJourney} />
        </div>
        <div>
          <div className="font-bold text-sm mb-2 text-center">
            Cấp bậc hiện tại
          </div>
          <div className="font-bold text-[#29833f] text-center uppercase">
            {journey[nowJourney].level}
          </div>
        </div>
      </div>

      <div className="pt-6 px-6">
        <h2 className="font-bold mb-2">Mục tiêu cần hoàn thiện</h2>
        <hr className="text-gray" />
      </div>

      <div className={`flex ${isLocked(nowJourney) ? "grayscale" : ""}`}>
        <div className="w-[45%] flex flex-col items-center justify-center gap-y-3">
          <div className="flex items-center justify-between w-full mt-4 px-20">
            <div>
              <h3 className="font-bold">{journey[nowJourney].leveltitle}</h3>
              <div className="font-bold text-[#29833f]">
                {journey[nowJourney].level}
              </div>
            </div>
            <img
              src={journey[nowJourney].imagelevel}
              className="h-[80px] w-auto"
            />
          </div>
          <div className="w-[150px]">
            <CircularProgressbarWithChildren
              value={progress}
              className="progress-bar-custom"
              styles={buildStyles({
                strokeLinecap: "round",
                textSize: "16px",
                pathTransitionDuration: 0.5,
                pathColor: "#ff8015",
                textColor: "#f88",
                trailColor: "#ffd966",
                backgroundColor: "#FFFFFF",
              })}
            >
              <FaBusinessTime size={50} className="text-primary_dark" />
            </CircularProgressbarWithChildren>
          </div>
          <div className="font-bold text-xl text-primary">{progress}/100</div>
          <span>Giờ làm trong tháng</span>
          <span className="font-bold">
            Chất lượng phục vụ phải từ 4 trở lên
          </span>
        </div>

        <div className="w-[50%]">
          <div className="text-center p-10 font-bold text-xl text-green">
            PHẦN THƯỞNG
          </div>
          <div
            className="p-8 h-[150px] rounded-2xl bg-[#ffd966]"
          >
            {isLocked(nowJourney) && (
              <div className="absolute ml-60 mt-5">
                <FaLock size={40} className="text-gray-500" />
              </div>
            )}
            <h2 className="font-bold text-primary_dark">
              Chi tiết phần thưởng
            </h2>
            <div>
              <div className="text-sm mb-2 text-primary_dark">
                {journey[nowJourney].reward}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute w-[50%] mt-[620px] ml-[488px]">
        <div className="flex items-center justify-around mt-10">
          {nowJourney > 0 && (
            <div
              className="flex items-center justify-center p-3 bg-primary rounded-lg w-[220px] text-center text-white font-bold cursor-pointer fea-item hover:bg-primary_dark"
              onClick={() => setNowJourney(nowJourney - 1)}
            >
              <FaAngleLeft size={30} className="mr-2" />
              Hành trình trước
            </div>
          )}
          {nowJourney != 4 && (
            <div
              className="flex items-center justify-center p-3 bg-primary rounded-lg w-[220px] text-center text-white font-bold cursor-pointer fea-item hover:bg-primary_dark"
              onClick={() => setNowJourney(nowJourney + 1)}
            >
              Hành trình tiếp theo
              <FaAngleRight size={30} className="" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
