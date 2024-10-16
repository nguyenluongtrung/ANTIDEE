import { StepBar } from "./StepBar/StepBar";
import "./JourneyPage.css";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaAngleLeft, FaAngleRight, FaLock, FaRegStar, FaStar } from "react-icons/fa";
import { FaBusinessTime } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDomesticHelpersTotalWorkingHours,
  receiveGiftHistory,
  updateDomesticHelperLevel,
  getAccountInformation
} from "../../features/auth/authSlice";
import multipleArrow from '../../assets/img/multiplearrow.gif'
import PopupReceiveGift from "./PopupReceiveGift/PopupReceiveGift";
import GiftButton from "./components/GiftButton";

export const JourneyPage = () => {
  const { account, isLoading } = useSelector((state) => state.auth);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupReceiveAllGift, setIsPopupReceiveAllGift] = useState(false)
  const [haveAccountLevel, setHaveAccountLevel] = useState("")

  const [workingTime, setWorkingTime] = useState(0);

  const dispatch = useDispatch();

  const [nowJourney, setNowJourney] = useState(0);
  const journey = [
    {
      level: "Kiến con",
      leveltitle: "Cấp 1",
      imagelevel: "image/kien_con.jpg",
      reward: "- Nhận thêm 100.000 Apoint",
      requiredHours: 1,
      aPoint: 0,
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
      reward: "- Nhận thêm 300.000 Apoint",
      requiredHours: 3,
      aPoint: 300000,
    },
    {
      level: "Kiến chiến binh",
      leveltitle: "Cấp 4",
      imagelevel: "image/kien_chien_binh.jpg",
      reward: "- Nhận thêm 400.000 Apoint",
      requiredHours: 4,
      aPoint: 400000,
    },
    {
      level: "Kiến chúa",
      leveltitle: "Cấp 5",
      imagelevel: "image/kien_chua.png",
      reward: "- Nhận thêm 500.000 Apoint",
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

  const currentLevelIndex = levels.indexOf(haveAccountLevel);

  useEffect(() => {
    const updateAccountFirst = async () => {
      if (account?.rating?.domesticHelperRating >= 4 || account?.data.account.rating.domesticHelperRating >= 4) {
        const result = await dispatch(updateDomesticHelperLevel());
        // console.log("Xem f5 có success k", result)
        if (result.type.endsWith("fulfilled")) {
          setHaveAccountLevel(result.payload?.updateAccountLevel?.accountLevel?.domesticHelperLevel?.name)
          fetchData();
        }
      }
    }

    const fetchData = async () => {
      const result = await dispatch(getDomesticHelpersTotalWorkingHours());
      setWorkingTime(result.payload);
    };


    fetchData();
    updateAccountFirst()
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
    await dispatch(getAccountInformation());
  };

  return (
    <div className="px-4 md:px-16 lg:px-32 flex flex-col pt-20 mb-14">
      <PopupReceiveGift
        isOpen={isPopupOpen}

        setIsPopupOpen={setIsPopupOpen}
        levelName={journey[nowJourney].level}
        isPopupReceiveAllGift={isPopupReceiveAllGift}
      />
      <div className="font-bold text-green text-xl md:text-2xl text-center mb-6">
        HÀNH TRÌNH
      </div>
      <div className="flex flex-col gap-y-2 w-full p-6 custom-background">
        <div className="font-bold text-sm">Hành trình của tôi</div>
        <div>
          <StepBar nowJourney={nowJourney} />
        </div>
        <div>
          <div className="font-bold text-sm mb-2 text-center">
            Cấp bậc hiện tại
          </div>
          <div className={`font-bold text-center uppercase ${isLocked(nowJourney) ? "text-red" : "text-[#29833f]"}`}>
            {/* <div className="font-bold text-[#29833f] text-center uppercase"> */}
            {journey[nowJourney].level}
          </div>
        </div>
      </div>

      <div className="pt-6 px-6 flex justify-between">
        <h2 className="font-bold mb-2">Mục tiêu cần hoàn thiện</h2>
        <div
          className="flex items-center justify-center sm:p-3 mb-2 bg-primary rounded-lg w-[220px] text-center text-white font-bold cursor-pointer fea-item hover:bg-primary_dark text-base sm:text-base"
          onClick={() => receivedAllGift()}
        >
          Nhận thưởng nhanh
        </div>
      </div>
      <hr className="text-gray" />

      {nowJourney !== 0 ?
        <div
          className={`flex flex-col md:flex-row justify-center items-center ${isLocked(nowJourney) ? "grayscale pointer-events-none" : ""
            }`}
        >
          <div className="md:w-[45%] flex flex-col items-center justify-center gap-y-3">
            <div className="flex items-center justify-between w-full mt-4 md:px-20">
              <div>
                <h3 className="font-bold">{journey[nowJourney].leveltitle}</h3>
                <div className={`font-bold text-[#29833f]`}>
                  {journey[nowJourney].level}
                </div>
              </div>
              <img
                src={journey[nowJourney].imagelevel}
                className="h-[80px] w-auto"
              />
            </div>
            <div className="flex flex-col gap-y-2 justify-center items-center">
              <div className="font-bold">Tổng thời gian đã làm việc</div>
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
                {workingTime}/{journey[nowJourney].requiredHours} giờ
              </div>
              <div className="font-normal flex items-center">
                Điểm đánh giá hiện tại: {account?.rating?.domesticHelperRating} / 5 <FaStar className="ml-2 text-yellow" />
              </div>
              <div className="flex items-center">
                Lưu ý: Chất lượng phục vụ phải từ 4 <FaStar className="mx-2 text-yellow" /> trở lên
              </div>
            </div>

          </div>

          <div className="md:w-[50%]">
            <div className="text-center p-10 font-bold text-xl text-green">
              PHẦN THƯỞNG
            </div>
            <div className="p-8 h-[150px] rounded-2xl bg-[#ffd966]">
              {isLocked(nowJourney) && (
                <div className="absolute ml-60 mt-5">
                  <FaLock size={40} className="text-gray" />
                </div>
              )}
              <div className="flex justify-between">
                <div>
                  <h2 className="font-bold text-primary_dark">
                    Chi tiết phần thưởng
                  </h2>
                  <div>
                    <div className="text-sm mb-2 text-primary_dark">
                      {journey[nowJourney]?.reward}
                    </div>
                  </div>
                </div>
                <div className="w-[30%]">
                  {
                    nowJourney > 0 && <GiftButton
                      levelName={journey[nowJourney]?.level}
                      levelApoint={journey[nowJourney]?.aPoint}
                      isReceived={
                        account?.receiveGiftHistory &&
                        account.receiveGiftHistory.length > nowJourney &&
                        account.receiveGiftHistory[nowJourney]?.isReceived
                      }
                      setIsPopupOpen={setIsPopupOpen}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        : <div className="flex justify-center items-center">
          <img className='w-20 sm:w-20 md:w-32 mt-24 md:mx-10' src={multipleArrow} />

          <div className="w-[100%] flex flex-col items-center justify-center gap-y-3 sm:w-full">
            <div className="flex items-center justify-between w-full mt-4 md:px-20">
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

            <div className="w-full p-8 rounded-2xl bg-[#ffd966]">
              <div className="flex-col justify-between">
                <h2 className="font-bold text-primary_dark text-center">
                  Lời giới thiệu
                </h2>
                <div>
                  <div className="text-sm mb-2 text-primary_dark">
                    <br />
                    - Cảm ơn bạn đã gia nhập thành công vào hệ thống của chúng tôi <br /> <br />

                    - Đây là trang hành trình, bạn có thể nhận thưởng từ hệ thống thông qua các công việc bạn đã làm
                  </div>
                </div>
              </div>

            </div>

          </div>
          <img className='w-20 sm:w-20 md:w-32 mt-24 md:mx-10 scale-x-[-1]' src={multipleArrow} />

        </div>
      }

      <div className="w-[50%]mt-[680px]ml-[488px]">
        <div className="flex items-center justify-around mt-10">
          {nowJourney > 0 && (
            <div
              className="flex items-center justify-center p-3 bg-primary rounded-lg w-[220px] text-center text-white font-bold cursor-pointer fea-item hover:bg-primary_dark text-sm sm:text-base md:text-base"
              onClick={() => setNowJourney(nowJourney - 1)}
            >
              <FaAngleLeft size={30} className="mr-2" />
              Hành trình trước
            </div>
          )}
          {nowJourney != 4 && (
            <div
              className="flex items-center justify-center p-3 bg-primary rounded-lg w-[220px] text-center text-white font-bold cursor-pointer fea-item hover:bg-primary_dark text-sm sm:text-base md:text-base"
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