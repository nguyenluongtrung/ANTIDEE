import { StepBar } from "./StepBar/StepBar";
import "./JourneyPage.css";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaAngleLeft, FaAngleRight, FaLock } from "react-icons/fa";
import { FaBusinessTime } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDomesticHelpersTotalWorkingHours,
  receiveGiftHistory,
  updateDomesticHelperLevel,
} from "../../features/auth/authSlice";
import { GoGift } from "react-icons/go";
import PopupReceiveGift from "./PopupReceiveGift/PopupReceiveGift";

export const JourneyPage = () => {
  const { account, isLoading } = useSelector((state) => state.auth);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupReceiveAllGift, setIsPopupReceiveAllGift] = useState(false)
  const haveAccount = account?.accountLevel?.domesticHelperLevel?.name;
  const [workingTime, setWorkingTime] = useState(0);
  const dispatch = useDispatch();

  const GiftButton = ({ levelName, levelApoint, isReceived }) => {
    const dispatch = useDispatch();
    const { account } = useSelector((state) => state.auth);

    const handleClick = async () => {
      const result = await dispatch(
        receiveGiftHistory({
          domesticHelperId: account._id,
          levelName,
          levelApoint,
        })
      );
      setIsPopupOpen(true);
      // toast.success(`Nhận quà ${levelName} thành công !!!!`)
    };

    return (
      <button
        onClick={handleClick}
        disabled={isReceived}
        className={` ${
          isReceived ? "received" : ""
        } animate-bounce  hover:text-green`}
      >
        {isReceived ? (
          <div className="flex flex-col items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4017/4017791.png"
              className="h-14"
            />
            "Đã nhận quà"
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <GoGift size={40} />
            {`Nhận quà ${levelName}`}
          </div>
        )}
      </button>
    );
  };

  const [nowJourney, setNowJourney] = useState(0);
  const journey = [
    {
      level: "Kiến con",
      leveltitle: "Cấp 1",
      imagelevel: "image/kien_con.jpg",
      reward: "- Nhận thêm 100000 Apoint",
      requiredHours: 1,
      aPoint: 100000,
    },
    {
      level: "Kiến trưởng thành",
      leveltitle: "Cấp 2",
      imagelevel: "image/kien_truong_thanh.jpg",
      reward: "- Nhận thêm 200000 Apoint",
      requiredHours: 2,
      aPoint: 200000,
    },
    {
      level: "Kiến thợ",
      leveltitle: "Cấp 3",
      imagelevel: "image/kien_tho.jpg",
      reward: "- Nhận thêm 300000 Apoint",
      requiredHours: 3,
      aPoint: 300000,
    },
    {
      level: "Kiến chiến binh",
      leveltitle: "Cấp 4",
      imagelevel: "image/kien_chien_binh.jpg",
      reward: "- Nhận thêm 400000 Apoint",
      requiredHours: 4,
      aPoint: 400000,
    },
    {
      level: "Kiến chúa",
      leveltitle: "Cấp 5",
      imagelevel: "image/kien_chua.png",
      reward: "- Nhận thêm 500000 Apoint",
      requiredHours: 5,
      aPoint: 500000,
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

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(getDomesticHelpersTotalWorkingHours());
      //Dùng để cập nhật lại level của Domestic
      await dispatch(updateDomesticHelperLevel());
      console.log("RESULTTTTT", result.payload);
      setWorkingTime(result.payload);
      const newWorkingTime = result.payload.totalHours;
      // Kiểm tra điều kiện nâng cấp độ
      const currentRequiredHours =
        journey[currentLevelIndex]?.requiredHours || 0;
      if (newWorkingTime >= currentRequiredHours) {
        const newLevelIndex = currentLevelIndex + 1;
        if (newLevelIndex < levels.length) {
          // // Tăng cấp và đặt lại thời gian làm việc
          // const newLevel = levels[newLevelIndex];
          setNowJourney(newLevelIndex);
          setWorkingTime(newWorkingTime - currentRequiredHours);
        }
      }
    };
    fetchData();
  }, []);

  const isLocked = (index) => {
    return index > currentLevelIndex;
  };

  const receivedAllGift = async () => {
    for (let i = 0; i <= currentLevelIndex; i++) {
      if (!account.receiveGiftHistory[i].isReceived) {
        await dispatch(
          receiveGiftHistory({
            domesticHelperId: account._id,
            levelName: journey[i].level,
            levelApoint: journey[i].aPoint,
          })
        );
      }
    }
    setIsPopupReceiveAllGift(true)
    setIsPopupOpen(true);
  };

  return (
    <div className="px-32 flex flex-col pt-20 mb-14">
      <PopupReceiveGift
        isOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        levelName={journey[nowJourney].level}
        isPopupReceiveAllGift={isPopupReceiveAllGift}
      />
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

      <div className="pt-6 px-6 flex justify-between">
        <h2 className="font-bold mb-2">Mục tiêu cần hoàn thiện</h2>
        <div
          className="flex items-center justify-center p-3 mb-2 bg-primary rounded-lg w-[220px] text-center text-white font-bold cursor-pointer fea-item hover:bg-primary_dark"
          onClick={() => receivedAllGift()}
        >
          Nhận thưởng nhanh
        </div>
      </div>
      <hr className="text-gray" />

      <div
        className={`flex ${
          isLocked(nowJourney) ? "grayscale pointer-events-none" : ""
        }`}
      >
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
              value={workingTime}
              maxValue={journey[nowJourney].requiredHours}
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
          <div className="font-bold text-xl text-primary">
            {workingTime}/{journey[nowJourney].requiredHours}
          </div>
          <span>Tổng thời gian đã làm</span>
          <span className="font-bold">
            Chất lượng phục vụ phải từ 4 trở lên
          </span>
        </div>

        <div className="w-[50%]">
          <div className="text-center p-10 font-bold text-xl text-green">
            PHẦN THƯỞNG
          </div>
          <div className="p-8 h-[150px] rounded-2xl bg-[#ffd966]">
            {isLocked(nowJourney) && (
              <div className="absolute ml-60 mt-5">
                <FaLock size={40} className="text-gray-500" />
              </div>
            )}
            <div className="flex justify-between">
              <div>
                <h2 className="font-bold text-primary_dark">
                  Chi tiết phần thưởng
                </h2>
                <div>
                  <div className="text-sm mb-2 text-primary_dark">
                    {journey[nowJourney].reward}
                  </div>
                </div>
              </div>
              <div className="w-[30%]">
                <GiftButton
                  levelName={journey[nowJourney].level}
                  levelApoint={journey[nowJourney].aPoint}
                  isReceived={account.receiveGiftHistory[nowJourney].isReceived}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute w-[50%] mt-[680px] ml-[488px]">
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

//Tạo 1 button là hộp quà (có isRecieved = false) cho cả 5 level
//Người dùng onCLick vào hộp quà đó
//Dispatch -> Id người dùng + hộp quà họ nhấn ở level nào
// id: Hưng + current Level 2
// DB sẽ nhận là có thằng này đang đứng level 2 và nhận quà
// set lại isReceived của hộp quà thằng này là true + thêm số lượng aPoint vào cho nó

//Phải có hàm calculated lại level
//Sau kho calculated xong phải set lại level vào trong db
//Người dùng vào trang này -> Hệ thống tự động lấy thời gian họ làm việc ra và tính toán
//-> Nếu thời gian làm là 100 thì hệ thống phải có hàm tính toán -> set lại level mới vào trong db
//-> Mở rộng chức năng là nhận thưởng
