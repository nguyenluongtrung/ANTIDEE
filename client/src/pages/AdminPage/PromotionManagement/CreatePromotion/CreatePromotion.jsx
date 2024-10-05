import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createPromotion } from "../../../../features/promotions/promotionSlice";
import { Spinner } from "../../../../components";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../../../utils/toast-customize";
import { AiOutlineClose } from "react-icons/ai";
import "./CreatePromotion.css";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { getAllServices } from "../../../../features/services/serviceSlice";
import { formatDatePicker, validCurrentDate } from "../../../../utils/format";
import { rules } from "../../../../utils/rules";

export const CreatePromotion = ({
  setIsOpenCreatePromotion,
  handleGetAllPromotions,
}) => {
  const currentDate = validCurrentDate();
  const { isLoading: promotionLoading, promotions } = useSelector(
    (state) => state.promotions
  );
  const [selectedServices, setSelectedServices] = useState([]);
  const { services, isLoading: serviceLoading } = useSelector(
    (state) => state.services
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    setValue,
  } = useForm();

  const dispatch = useDispatch();

  const startDate = watch('startDate');
  const endDate = watch('endDate');

 
  useEffect(() => {
    syncEndDateWithStartDate(startDate, endDate, setValue); 
  }, [startDate, endDate, setValue]);

  useEffect(() => {
    if (!services || services.length === 0) {
      dispatch(getAllServices());
    }
  }, [dispatch, services]);


  const handleServiceDeselect = (serviceId) => {
    const updatedSelectedServices = selectedServices.filter(
      (service) => service !== serviceId
    );
    setSelectedServices(updatedSelectedServices);
  };

  const validatePromotionName = (name) => {
    const trimmedName = name.trim().toLowerCase();
    const existingPromotion = promotions.find(
      (promo) =>
        promo.promotionName.trim().toLowerCase() === trimmedName &&
        new Date(promo.endDate) >= new Date()
    );
    if (existingPromotion) {
      setError("promotionName", {
        type: "manual",
        message: "Tên mã giảm giá đã tồn tại và còn hạn sử dụng",
      });
      return false;
    }
    clearErrors("promotionName");
    return true;
  };

  const handleExitCreatePromotion=()=>{
    setIsOpenCreatePromotion(false);
    handleGetAllPromotions();
  }

  const onSubmit = async (data) => {
    const isNameValid = validatePromotionName(data.promotionName);
    if (!isNameValid) return;

    const promotionData = {
      ...data,
      serviceIds: selectedServices,
    };
    const result = await dispatch(createPromotion(promotionData));
    if (result.type.endsWith("fulfilled")) {
      toast.success("Thêm mã giảm giá thành công", successStyle);
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
    handleExitCreatePromotion();
  };

  if (promotionLoading || serviceLoading) {
    return <Spinner />;
  }

  return (
    <div className="popup active">
      <div className="overlay"></div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="content rounded-md p-5"
        style={{ width: "35vw" }}
      >
        <AiOutlineClose
          className="absolute text-sm hover:cursor-pointer"
          onClick={() => handleExitCreatePromotion()
          }
        />
        <p className="grid text-green font-bold text-xl justify-center">
          TẠO MÃ GIẢM GIÁ
        </p>
        <table className="mt-3">
          <tbody>
            <tr>
              <td>
                <span className="font-bold">Tên ưu đãi</span>
                <span className="text-red"> * </span>
              </td>
              <td>
                <input
                  type="text"
                  {...register("promotionName", {
                    required: "Tên mã giảm giá là bắt buộc",
                  })}
                  className="create-question-input text-center ml-[60px] text-sm w-[300px]"
                  placeholder="Nhập tên của khuyến mãi"
                  required
                />
                {errors.promotionName && (
                  <p className="text-red text-center">
                    {errors.promotionName.message}
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td>
                {" "}
                <span className="font-bold">Ngày bắt đầu</span>
                <span className="text-red"> * </span>
              </td>
              <td>
                <input
                  type="date"
                  {...register("startDate", rules.startDate)}
                  min={currentDate}
                  name="startDate"
                  required
                  className={`create-question-input text-center ml-[60px] text-sm w-[300px] ${
                    errors.startDate ? "error-input" : ""
                  }`}
                />{" "}
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Ngày kết thúc</span>
                <span className="text-red"> * </span>
              </td>
              <td>
                <input
                  type="date"
                  {...register("endDate", rules.endDate)}
                  min={currentDate}
                  name="endDate"
                  required
                  className={`create-question-input text-center ml-[60px] text-sm w-[300px] ${
                    errors.startDate ? "error-input" : ""
                  }`}
                />{" "}
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Mã giảm giá</span>
                <span className="text-red"> * </span>
              </td>
              <td>
                <input
                  type="text"
                  {...register("promotionCode")}
                  placeholder="Nhập mã giảm giá"
                  required
                  className="create-question-input text-center ml-[60px] text-sm w-[300px]"
                />
              </td>
            </tr>

            <tr>
              <td>
                <span className="font-bold">Giá trị của mã</span>
                <span className="text-red"> * </span>
              </td>
              <td>
                <input
                  type="text"
                  {...register("promotionValue", {
                    required: "Giá trị mã là bắt buộc",
                    min: { value: 0, message: "Giá trị mã phải lớn hơn 0" },
                    max: {
                      value: 1,
                      message: "Giá trị mã phải nhỏ hơn hoặc bằng 1",
                    },
                  })}
                  placeholder="Nhập giá trị giảm giá"
                  className={`create-question-input text-center ml-[60px] text-sm w-[300px] ${
                    errors.promotionValue ? "border-red" : ""
                  }`}
                />

                {errors.promotionValue && (
                  <p className="text-red text-center">
                    {errors.promotionValue.message}
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Số lượng mã</span>
                <span className="text-red"> * </span>
              </td>
              <td className="">
                <input
                  type="number"
                  {...register("promotionQuantity", {
                    required: "Số lượng mã là bắt buộc",
                    min: { value: 1, message: "Số lượng mã phải lớn hơn 0" },
                    pattern: {
                      value: /^[1-9]\d*$/,
                      message: "Số lượng mã phải là số nguyên dương",
                    },
                  })}
                  placeholder="Nhập số lượng mã"
                  className={`create-question-input text-center ml-[60px] text-sm w-[300px] ${
                    errors.promotionQuantity ? "border-red" : ""
                  }`}
                />
                {errors.promotionQuantity && (
                  <p className="text-red text-center">
                    {errors.promotionQuantity.message}
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Lựa chọn dịch vụ</span>
              </td>
              <td className="">
                <div className="input-box">
                  <select
                    size={6}
                    {...register("serviceIds")}
                    multiple
                    onChange={(e) => {
                      setSelectedServices([
                        ...selectedServices,
                        e.target.value,
                      ]);
                    }}
                    className="create-question-input text-center ml-[60px] text-sm w-[300px]"
                  >
                    {services?.map((service) => {
                      if (
                        selectedServices?.findIndex(
                          (selectedId) => selectedId === service?._id
                        ) === -1
                      )
                        return (
                          <option key={service?._id} value={service?._id}>
                            {service?.name}
                          </option>
                        );
                    })}
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Đã chọn:</span>
              </td>
              <td className="pl-[130px]   py-1 ">
                {selectedServices.map((selectedId) => {
                  return (
                    <li className="flex" key={selectedId}>
                      {
                        services[
                          services.findIndex(
                            (service) => service._id === selectedId
                          )
                        ].name
                      }
                      <button
                        className="w-1 ml-1"
                        onClick={() => handleServiceDeselect(selectedId)}
                      >
                        <FaTimes className="w-3 text-red ml-1" />
                      </button>
                    </li>
                  );
                })}
              </td>
            </tr>
          </tbody>
        </table>

        <button
          type="submit"
          className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
        >
          Tạo mã giảm giá
        </button>
      </form>
    </div>
  );
};
