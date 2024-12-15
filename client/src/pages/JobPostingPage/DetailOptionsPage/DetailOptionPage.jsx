import { useLocation, useNavigate, useParams } from "react-router-dom";
import { StepBar } from "../components/StepBar/StepBar";
import { useForm } from "react-hook-form";
import {
  formatDateInput,
  getOneHourLaterTimeString,
} from "../../../utils/format";
import { Switch } from "@headlessui/react";
import { Spinner } from "../../../components";
import { getAllServices } from "../../../features/services/serviceSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import {
  checkInvitationCode,
  getAccountInformation,
} from "../../../features/auth/authSlice";
import {
  getAllAccountPromotion,
  getAllPromotions,
} from "../../../features/promotions/promotionSlice";
import { ConfirmModal } from "../../../components/ConfirmModal/ConfirmModal";

export const DetailOptionPage = () => {
  const { serviceId } = useParams();
  const { services, isLoading: serviceLoading } = useSelector(
    (state) => state.services
  );
  const [anotherOptions, setAnotherOptions] = useState([]);
  const [chosenService, setChosenService] = useState(null);
  const [invitationCode, setInvitationCode] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isChosenYourFav, setIsChosenYourFav] = useState(false);
  const [isChosenYourself, setIsChosenYourself] = useState(false);
  const [agree, setAgree] = useState(false);

  const [inputOptions, setInputOptions] = useState([
    {
      optionName: "",
      optionValue: "",
      optionIndex: "",
    },
  ]);
  const [startingHour, setStartingHour] = useState("");
  const [hasChangedPrice, setHasChangedPrice] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [promotionList, setPromotionList] = useState([]);
  const [promoValue, setPromoValue] = useState(null);
  const [accountApoints, setAccountApoints] = useState();
  const [openConfirmWorkingHoursModal, setOpenConfirmWorkingHoursModal] =
    useState(false);
  const [accountId, setAccountId] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [promotionId, setPromotionId] = useState();
  const [promotionQuantity, setPromotionQuantity] = useState();

  const [accountPromotion, setAccountPromotion] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const promoOutput = await dispatch(getAllPromotions());
      if (Array.isArray(promoOutput.payload)) {
        setPromotionList(promoOutput.payload);
      }
    };
    fetchData();
  }, [dispatch]);

  async function initiateAccountInformation() {
    let output = await dispatch(getAccountInformation());
    setAccountId(output.payload._id);
    setAccountApoints(output.payload.aPoints);

  }

  useEffect(() => {
    initiateAccountInformation();
  }, []);

  async function initiateAccountPromotion() {
    if (accountId) {
      let output = await dispatch(getAllAccountPromotion(accountId));
      setAccountPromotion(output.payload);
    }
  }

  useEffect(() => {
    if (accountId) {
      initiateAccountPromotion();
    }
  }, [accountId]);

  const [initialPrice, setInitialPrice] = useState(totalPrice);
  const [initialPoints, setInitialPoints] = useState(accountApoints);
  const [isUsedPoint, setIsUsedPoint] = useState();

  const handleApplyApoints = () => {
    const equivalentVND = accountApoints * 1;

    let usedPoints = 0;

    if (equivalentVND >= totalPrice) {
      usedPoints = totalPrice;
      setTotalPrice(0);
      toast.success(
        `Bạn đã áp dụng thành công ${totalPrice} điểm (tương đương với ${totalPrice}đ).`,
        successStyle
      );
      // setAccountApoints(equivalentVND - totalPrice);
      setAccountApoints(accountApoints - usedPoints);
    } else {
      usedPoints = equivalentVND;
      const updatedPrice = totalPrice - equivalentVND;
      setTotalPrice(updatedPrice);
      toast.success(
        `Bạn đã áp dụng thành công ${usedPoints} điểm (tương đương với ${usedPoints}đ).`,
        successStyle
      );

      setAccountApoints(0);
    }
    setIsUsedPoint(usedPoints);
  };

  const isExpired = (date) => date && new Date(date) < new Date();

  const findPromotion = (code) =>
    promotionList.find((promo) => promo.promotionCode === code);

  const [isUsedPromotion, setIsUsedPromotion] = useState(false);



  const hasUsedPromotionForService = (promotionId, serviceId) => {
    return accountPromotion.some(
      (promo) =>
        promo.promotionId === promotionId && promo.serviceId === serviceId
    );
  };

  const handleCheckPromo = (e) => {
    e.preventDefault();

    if (isUsedPromotion) {
      toast.error("Mỗi lần chỉ sử dụng được một mã ưu đãi!", errorStyle);
      return;
    }
    const promotion = findPromotion(promoCode);


    if (promotion) {

      if (promotion.promotionQuantity === 0) {
        toast.error("Mã ưu đãi này đã hết!", errorStyle);
        return;
      }

      if (isExpired(promotion.endDate)) {
        toast.error("Mã ưu đãi này đã hết hạn!", errorStyle);
        return;
      }

      if (hasUsedPromotionForService(promotion?._id, serviceId)) {
        toast.error(
          "Bạn đã sử dụng mã ưu đãi này cho dịch vụ này rồi!",
          errorStyle
        );
        return;
      }

      const idService = promotion.serviceIds.map((service) => service._id);

      if (idService.includes(serviceId)) {
        setPromoValue(promotion.promotionValue);
        setPromotionId(promotion._id);
        setPromotionQuantity(promotion.promotionQuantity);
        toast.success(
          `Áp dụng khuyến mãi ${promoCode}: Giảm ${promotion.promotionValue * 100
          }%.`,
          successStyle
        );
      } else {
        toast.error(
          "Khuyến mãi này không áp dụng được cho dịch vụ này!",
          errorStyle
        );
      }
    } else {
      toast.error("Mã ưu đãi không hợp lệ!", errorStyle);
    }
    setIsUsedPromotion(true);
  };

  useEffect(() => {
    if (promoValue !== null) {
      const discountFactor = 1 - promoValue;
      setTotalPrice((prevPrice) => Math.round(prevPrice * discountFactor));
    }
  }, [promoValue]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();

  useEffect(() => {
    const asyncFn = async () => {
      const result = await dispatch(getAllServices());
      const chosenService = result.payload.find(
        (service) => String(service._id) === String(serviceId)
      );
      setChosenService(chosenService);
    };
    asyncFn();
  }, [dispatch, serviceId]);

  useEffect(() => {
    const asyncFn = async () => {
      const newInputOptions = chosenService?.priceOptions?.flatMap((option) => {
        if (option?.optionList.some((opt) => opt?.optionValue === "")) {
          return [
            {
              optionName: option.optionName,
              optionValue: "",
              optionIndex: "",
            },
          ];
        }
        if (option?.optionList.some((opt) => /[^0-9]/.test(opt?.optionValue))) {
          return option.optionList.map((opt) => ({
            optionName: opt?.optionValue,
            optionValue: "",
            optionIndex: "",
          }));
        } else {
          return [
            {
              optionName: option.optionName,
              optionValue: "",
              optionIndex: "",
            },
          ];
        }
      }) || [{ optionName: "", optionValue: "", optionIndex: "" }];

      setInputOptions(newInputOptions);
    };
    asyncFn();
  }, [chosenService]);

  useEffect(() => {
    if (inputOptions.some((option) => option.optionValue.trim() === "")) {
      return;
    }

    let formula;
    if (chosenService?.priceFormula?.length === 1) {
      formula = chosenService?.priceFormula[0]?.formula || "";
    } else {
      for (let i = 0; i < chosenService?.priceFormula.length; i++) {
        const singleFormula = chosenService?.priceFormula[i];
        let condition = singleFormula?.condition;
        for (let j = 0; j < inputOptions.length; j++) {
          const option = inputOptions[j];
          if (condition.includes(option.optionName)) {
            condition = condition.replaceAll(
              `[${option.optionName}]`,
              option.optionValue
            );
          }
        }
        if (eval(condition)) {
          formula = singleFormula?.formula;
          break;
        }
      }
    }

    inputOptions.forEach((option) => {
      const regex = new RegExp(
        `\\[${option.optionName}\\](?:\\[(.*?)\\])?`,
        "g"
      );
      formula = formula?.replace(regex, (match, p1) => {
        if (p1 === "hệ số") {
          return option.optionIndex;
        } else {
          return option.optionValue;
        }
      });
    });

    let result;
    try {
      result = eval(formula);
    } catch (error) {
      return;
    }

    if (startingHour) {
      if (
        startingHour < "08:00:00" ||
        (startingHour > "17:00:00" && !hasChangedPrice)
      ) {
        result = Math.round(result * 1.1);
        setHasChangedPrice(true);
      } else if (
        startingHour >= "08:00:00" &&
        startingHour <= "17:00:00" &&
        hasChangedPrice
      ) {
        result = Math.round(result / 1.1);
        setHasChangedPrice(true);
      }
    }
    setTotalPrice(result);
  }, [
    inputOptions,
    chosenService?.priceFormula,
    startingHour,
    hasChangedPrice,
  ]);

  useEffect(() => {
    if (startingHour) {
      if (
        (startingHour < "08:00:00" || startingHour > "17:00:00") &&
        !hasChangedPrice
      ) {
        setTotalPrice(Math.round(totalPrice * 1.1));
        setHasChangedPrice(true);
      } else if (
        startingHour >= "08:00:00" &&
        startingHour <= "17:00:00" &&
        hasChangedPrice
      ) {
        setTotalPrice(Math.round(totalPrice / 1.1));
        setHasChangedPrice(false);
      }
    }
  }, [startingHour, totalPrice, hasChangedPrice]);

  const handleTimeChange = (e) => {
    const { value } = e.target;
    const min = getOneHourLaterTimeString();
    const max = "21:00:00";
    const startingDate = new Date(getValues("startingDate"));
    const currentDate = new Date();

    if (value < "06:00:00") {
      toast.error("Vui lòng chọn giờ làm việc sau 6h", errorStyle);
      setStartingHour("");
    } else if (
      startingDate.toISOString().slice(0, 10) ===
      currentDate.toISOString().slice(0, 10) &&
      value < min
    ) {
      toast.error(
        "Vui lòng chọn giờ làm việc sau giờ hiện tại 1 tiếng",
        errorStyle
      );
      setStartingHour("");
    } else if (value > max) {
      toast.error("Vui lòng chọn giờ làm việc trước 21h", errorStyle);
      setStartingHour("");
    } else {
      setStartingHour(value);
    }
  };

  const handleOpenTimeNote = () => {
    toast.custom((t) => (
      <div
        className={`bg-info text-white px-6 py-4 shadow-md rounded-full ${t.visible ? "animate-enter" : "animate-leave"
          }`}
      >
        Giá dịch vụ tăng 10% vào giờ cao điểm (trước 8h và sau 17h).
      </div>
    ));
  };

  const handleOpenPriceNote = (note) => {
    toast.custom((t) => (
      <div
        className={`bg-info text-white px-6 py-4 shadow-md rounded-full ${t.visible ? "animate-enter" : "animate-leave"
          }`}
      >
        {note}
      </div>
    ));
  };

  const handleToggleUrgentButton = () => {
    if (!anotherOptions.includes("isUrgent")) {
      setAnotherOptions([...anotherOptions, "isUrgent"]);
    } else {
      setAnotherOptions(
        anotherOptions.filter((option) => option !== "isUrgent")
      );
    }
    setIsUrgent(!isUrgent);
  };

  const handleToggleFavButton = () => {
    if (!anotherOptions.includes("isChosenYourFav")) {
      setAnotherOptions([...anotherOptions, "isChosenYourFav"]);
    } else {
      setAnotherOptions(
        anotherOptions.filter((option) => option !== "isChosenYourFav")
      );
    }
    setIsChosenYourFav(!isChosenYourFav);
  };

  const handleToggleChosenYourselfButton = () => {
    if (!anotherOptions.includes("isChosenYourself")) {
      setAnotherOptions([...anotherOptions, "isChosenYourself"]);
    } else {
      setAnotherOptions(
        anotherOptions.filter((option) => option !== "isChosenYourself")
      );
    }
    setIsChosenYourself(!isChosenYourself);
  };

  const handleInvitationCode = (e) => {
    setInvitationCode(e.target.value.toUpperCase());
  };

  const handleValidateWorkingHours = () => {
    setOpenConfirmWorkingHoursModal(true);
  };

  const onSubmit = async (data) => {
    if (!startingHour.trim()) {
      toast.error('Vui lòng chọn "Giờ làm việc"', errorStyle);
      return;
    }

    handleValidateWorkingHours();

    let invitationCodeOwnerId = null;

    if (invitationCode) {
      const result = await dispatch(checkInvitationCode(invitationCode));
      if (result.type.endsWith("fulfilled")) {
        invitationCodeOwnerId = result.payload;
        toast.success(
          "Mã mời hợp lệ, bạn sẽ được cộng 10000 đồng vào tài khoản khi mua dịch vụ thành công",
          successStyle
        );
      } else if (result?.error?.message === "Rejected") {
        toast.error(result?.payload, errorStyle);
      }
    }

    navigate(`/job-posting/time-contact/${serviceId}`, {
      state: {
        address: location.state.address,
        otherInfo: { totalPrice: Math.round(totalPrice) },
        workingTime: {
          startingDate: data.startingDate,
          startingHour: startingHour,
        },
        inputOptions,
        isUrgent,
        isChosenYourself,
        isChosenYourFav,
        invitationCodeOwnerId,
        promoValue,
        accountApoints,
        isUsedPoint,
        promotionId,
        promotionQuantity,
      },
    });
  };

  if (serviceLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full md:px-20">
      <StepBar serviceId={serviceId} />
      {openConfirmWorkingHoursModal && (
        <ConfirmModal
          confirmMsg={
            "Bạn đã có công việc được đăng trùng thời gian. Bạn có muốn tiếp tục đăng công việc này không?"
          }
          setAgree={setAgree}
          setOpenConfirmWorkingHoursModal={setOpenConfirmWorkingHoursModal}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="mx-auto shadow-xl p-2 pb-4 md:w-[700px] md:py-8 md:px-10 hover:shadow-2xl hover:cursor-pointer"

        >
          <div>
            <p className="font-extrabold mb-5">LỰA CHỌN CHI TIẾT</p>
            <table>
              <tbody>
                {chosenService?.priceOptions?.map((option, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <p className="mr-3 mb-8">{option?.optionName}</p>
                      </td>
                      <td className="pl-0 md:pl-32">
                        {option?.optionList?.some(
                          (opt) => opt?.optionValue === ""
                        ) ? (
                          <input
                            type="number"
                            className="border-b-2 border-light_gray w-72 focus:outline-none text-center"
                            onChange={(e) => {
                              setInputOptions((prevInputOptions) => {
                                const updatedInputOptions = [
                                  ...prevInputOptions,
                                ];
                                const chosenIndex =
                                  updatedInputOptions.findIndex(
                                    (opt) =>
                                      String(opt.optionName) ===
                                      String(option?.optionName)
                                  );
                                if (chosenIndex !== -1) {
                                  updatedInputOptions[chosenIndex] = {
                                    ...updatedInputOptions[chosenIndex],
                                    optionValue: e.target.value,
                                  };
                                }
                                return updatedInputOptions;
                              });
                            }}
                          />
                        ) : option?.optionList?.some((op) =>
                          /[^0-9]/.test(op?.optionValue)
                        ) ? (
                          <table>
                            <tbody>
                              {option?.optionList?.map((op1, op1Index) => (
                                <tr className="flex" key={op1Index}>
                                  <td>
                                    <p
                                      className="w-28"
                                      style={{ marginTop: "auto" }}
                                    >
                                      {op1?.optionValue}
                                    </p>
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="ml-3 border-b-2 border-light_gray w-32 focus:outline-none text-center"
                                      onChange={(e) => {
                                        setInputOptions((prevInputOptions) => {
                                          const updatedInputOptions = [
                                            ...prevInputOptions,
                                          ];
                                          const chosenIndex =
                                            updatedInputOptions.findIndex(
                                              (opt) =>
                                                String(opt.optionName) ===
                                                String(op1?.optionValue)
                                            );
                                          if (chosenIndex !== -1) {
                                            updatedInputOptions[chosenIndex] = {
                                              ...updatedInputOptions[
                                              chosenIndex
                                              ],
                                              optionValue: e.target.value,
                                            };
                                          }
                                          return updatedInputOptions;
                                        });
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <select
                            className="border-2 rounded-md w-72 p-2 border-light_gray text-center focus:outline-none"
                            onChange={(e) => {
                              const input = e.target.value;
                              const inputValue = input.split("-")[0];
                              const inputIndex = input.split("-")[1];
                              setInputOptions((prevInputOptions) => {
                                const updatedInputOptions = [
                                  ...prevInputOptions,
                                ];
                                const chosenIndex =
                                  updatedInputOptions.findIndex(
                                    (opt) =>
                                      String(opt.optionName) ===
                                      String(option?.optionName)
                                  );
                                if (chosenIndex !== -1) {
                                  updatedInputOptions[chosenIndex] = {
                                    ...updatedInputOptions[chosenIndex],
                                    optionValue: inputValue,
                                    optionIndex: isNaN(inputIndex)
                                      ? ""
                                      : inputIndex,
                                  };
                                }
                                return updatedInputOptions;
                              });
                            }}
                          >
                            <option value="" disabled selected>
                              Lựa chọn của bạn
                            </option>
                            {option?.optionList?.map((op, opIndex) => (
                              <option
                                key={opIndex}
                                value={`${op?.optionValue}-${op?.optionIndex}`}
                              >
                                {op?.optionValue}{" "}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}

                <tr>
                  <td>
                    <p className="mr-3 mb-8">Chọn ngày làm</p>
                  </td>
                  <td className="pl-0 md:pl-32">
                    <input
                      type="date"
                      {...register("startingDate")}
                      min={new Date().toISOString().split("T")[0]}
                      defaultValue={formatDateInput(new Date())}
                      className="border-2 rounded-md w-72 p-1.5 border-light_gray text-center focus:outline-none hover:cursor-pointer"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="mr-3 mb-6">
                      Chọn giờ làm{" "}
                      <span
                        className="italic text-gray underline hover:text-primary"
                        onClick={handleOpenTimeNote}
                      >
                        (Xem lưu ý)
                      </span>
                    </p>
                  </td>
                  <td className="pl-0 md:pl-32">
                    <input
                      type="time"
                      onChange={handleTimeChange}
                      step="60"
                      className="focus:outline-none hover:cursor-pointer"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="mr-3 mb-6 mt-3">
                      Ưu tiên người làm yêu thích
                    </p>
                  </td>
                  <td className="pl-0 md:pl-32">
                    <Switch
                      className="group inline-flex h-6 w-11 items-center rounded-full bg-primary transition data-[checked]:bg-green data-[disabled]:opacity-50"
                      onChange={handleToggleFavButton}
                      disabled={
                        totalPrice === 0 ||
                        anotherOptions.includes("isUrgent") ||
                        anotherOptions.includes("isChosenYourself")
                      }
                    >
                      <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                    </Switch>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="mr-3 mb-6 mt-3">Bạn tự chọn người làm</p>
                  </td>
                  <td className="pl-0 md:pl-32">
                    <Switch
                      className="group inline-flex h-6 w-11 items-center rounded-full bg-primary transition data-[checked]:bg-green data-[disabled]:opacity-50"
                      onChange={handleToggleChosenYourselfButton}
                      disabled={
                        totalPrice === 0 ||
                        anotherOptions.includes("isUrgent") ||
                        anotherOptions.includes("isChosenYourFav")
                      }
                    >
                      <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                    </Switch>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="mr-3 mb-2 mt-3">Cần gấp</p>
                  </td>
                  <td className="pl-0 md:pl-32">
                    <Switch
                      className="group inline-flex h-6 w-11 items-center rounded-full bg-primary transition data-[checked]:bg-green data-[disabled]:opacity-50"
                      onChange={handleToggleUrgentButton}
                      disabled={
                        anotherOptions.includes("isChosenYourFav") ||
                        anotherOptions.includes("isChosenYourself") ||
                        totalPrice === 0
                      }
                    >
                      <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                    </Switch>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="mr-3">Nhập mã khuyến mãi</p>
                  </td>
                  <td className="pl-0 md:pl-32">
                    <div className="flex">
                      <input
                        type="text"
                        className="border-2 rounded-md w-72 p-1.5 border-light_gray text-center focus:outline-none mb-5"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />

                      {promoCode && (
                        <button
                          onClick={handleCheckPromo}
                          className=" text-green p-2 rounded text-sm font-bold"
                        >
                          OK
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p className="mr-3">Nhập mã mời của bạn bè</p>
                  </td>
                  <td className="pl-0 md:pl-32">
                    <input
                      type="text"
                      className="border-2 rounded-md w-72 p-1.5 border-light_gray text-center focus:outline-none mb-5"
                      onChange={handleInvitationCode}
                      value={invitationCode}
                    />
                  </td>
                </tr>
                {accountApoints !== undefined && (
                  <tr>
                    <td>
                      <p className="mr-3 mb-2 mt-3">
                        Dùng <span className="font-bold">{accountApoints}</span>{" "}
                        aPoints
                      </p>
                    </td>

                    <td className="pl-0 md:pl-32">
                      <Switch
                        className="group inline-flex h-6 w-11 items-center rounded-full bg-primary transition data-[checked]:bg-green data-[disabled]:opacity-50"
                        disabled={!totalPrice}
                        onChange={(checked) => {
                          if (checked) {
                            setInitialPoints(accountApoints);
                            setInitialPrice(totalPrice);
                            handleApplyApoints();
                          } else {
                            setAccountApoints(initialPoints);
                            setTotalPrice(initialPrice);
                            setIsUsedPoint(0);
                          }
                        }}
                      >
                        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                      </Switch>
                    </td>
                  </tr>
                )}

                <tr className="border-light_gray border-t-2">
                  <td>
                    <div className="flex">
                      <p className="font-extrabold text-xs md:text-lg mt-5 md:mt-6">GIÁ TIỀN</p>
                      <span
                        className="italic mt-5 md:mt-7 text-xs md:text-sm md:ml-3 text-gray underline hover:text-primary"
                        onClick={() => handleOpenPriceNote(chosenService?.note)}
                      >
                        (Xem lưu ý)
                      </span>
                    </div>
                  </td>
                  <td className="pl-0 md:pl-32">
                    <p className="font-extrabold text-green text-lg mt-5">
                      {isNaN(totalPrice) ? 0 : Math.round(totalPrice)} VND
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            className="mt-10 mb-10 w-60 md:w-[500px] py-3 bg-primary rounded-full text-white hover:opacity-70"
            type="submit"
          >
            Tiếp theo
          </button>
        </div>
      </form>
    </div>
  );
};
