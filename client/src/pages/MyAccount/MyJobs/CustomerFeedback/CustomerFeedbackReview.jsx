import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Spinner } from "../../../../components";


export const CustomerFeedBackReview = ({
  serviceName,
  serviceAddress,
  avatar,
  chosenfeedback,
}) => {
  const { isLoading } = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [colorChosen, setColorChosen] = useState(false);

  useEffect(() => {
    setColorChosen(true);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }
  //mở to avatar
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  /////////////////////

  return (
    <div className="popup active">
      <div className="mx-auto bg-white shadow-2xl rounded-lg max-w-2xl p-10 max-h-[90vh] overflow-y-auto">
        <h2 className="text-center p-3 font-bold text-xl">
          REVIEW ĐÁNH GIÁ CHỦ NHÀ
        </h2>
        <div>
          <p className="text-green">
            <span className="font-semibold">Dịch vụ: </span>
            {serviceName}
          </p>
          <p>
            <span className="font-semibold">Hoàn thành lúc: </span>17:24
            25/04/202
          </p>
          <p>
            <span className="font-semibold">Địa chỉ: </span>
            {serviceAddress}
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src={avatar}
            alt="avatar"
            className="ml-3 rounded-full w-14 h-14 bg-green"
            onClick={toggleModal}
          />
        </div>
        <form className="p-5">
          <div className="flex justify-center">
            {[...Array(5)].map((star, i) => {
              const ratingValue = i + 1;
              return (
                <label key={i}>
                  <FaStar
                    className="star "
                    color={
                      ratingValue <= chosenfeedback?.rating
                        ? "#EBEA0B"
                        : "rgba(136, 114, 114, 0.8)"
                    }
                    size={25}
                  />
                </label>
              );
            })}
          </div>
          <div className="flex justify-center font-semibold mt-3 text-light_gray">
            <span>
              {chosenfeedback?.rating == 1
                ? " RẤT TỆ"
                : chosenfeedback?.rating == 2
                  ? "TỆ"
                  : chosenfeedback?.rating == 3
                    ? "ỔN"
                    : chosenfeedback?.rating == 4
                      ? "TỐT"
                      : chosenfeedback?.rating == 5
                        ? "TUYỆT VỜI"
                        : ""}
            </span>
          </div>
          <div>
            <h3>Điều gì bạn mong muốn tốt hơn?</h3>
            <div className="grid grid-cols-2 gap-4">
              <label
                for="select1"
                className={`flex justify-center rounded-md 
                            cursor-pointer items-center h-24 shadow-2xl ${chosenfeedback?.content ===
                    "Cung cấp chỉ dẫn cụ thể hơn"
                    ? "bg-light_yellow"
                    : ""
                  }`}
              >
                Cung cấp chỉ dẫn cụ thể hơn
              </label>
              <label
                for="select2"
                className={`flex justify-center rounded-md 
                  cursor-pointer items-center h-24 shadow-2xl ${chosenfeedback?.content === "Đối xử lịch sự, tôn trọng"
                    ? "bg-light_yellow"
                    : ""
                  }`}
              >
                Đối xử lịch sự, tôn trọng
              </label>
              <label
                htmlFor="select3"
                className={`flex justify-center rounded-md 
                  cursor-pointer items-center h-24 shadow-2xl ${chosenfeedback?.content === "Thanh toán đúng hạn"
                    ? "bg-light_yellow"
                    : ""
                  }`}
              >
                Thanh toán đúng hạn
              </label>
              <label
                htmlFor="select4"
                className={`flex justify-center rounded-md 
                  cursor-pointer items-center h-24 shadow-2xl
                   ${![
                    "Thanh toán đúng hạn",
                    "Đối xử lịch sự, tôn trọng",
                    "Cung cấp chỉ dẫn cụ thể hơn",
                  ].includes(chosenfeedback?.content)
                    ? "bg-light_yellow"
                    : ""
                  }`}
              >
                Khác
              </label>{" "}

            </div>
          </div>
          {colorChosen && ![
            "Thanh toán đúng hạn",
            "Đối xử lịch sự, tôn trọng",
            "Cung cấp chỉ dẫn cụ thể hơn",
          ].includes(chosenfeedback?.content) && (
              <>
                <div className="focus:outline-none flex justify-center mt-10 pb-10">
                  <textarea
                    rows={5}
                    cols={60}
                    defaultValue={chosenfeedback?.content}
                    className=" rounded-md shadow-2xl shadow-gray p-5 focus:outline-none "
                    readOnly
                  />
                </div>
              </>
            )}
        </form>
      </div>
      {/* mở to avatar */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>
              &times;
            </span>
            <img
              src={avatar}
              alt="Enlarged avatar"
              className="enlarged-avatar"
            />
          </div>
        </div>
      )}
    </div>
  );
};
