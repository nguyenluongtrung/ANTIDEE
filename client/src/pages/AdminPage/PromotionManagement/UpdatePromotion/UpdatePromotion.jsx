import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../../components";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../../../utils/toast-customize";
import { AiOutlineClose } from "react-icons/ai";
import "./UpdatePromotion.css";
import {
  getAllPromotions,
  updatePromotion,
} from "../../../../features/promotions/promotionSlice";
import { useEffect, useState } from "react";
import { getAllServices } from "../../../../features/services/serviceSlice";
import {
  syncEndDateWithStartDate,
  validCurrentDate,
} from "../../../../utils/format";
import { FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { rules } from "../../../../utils/rules";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";

export const UpdatePromotion = ({ setIsOpenUpdatePromotion }) => {
  const navigate = useNavigate();
  const { promotionId } = useParams();
  const { promotions, isLoading: promotionLoading } = useSelector(
    (state) => state.promotions || { promotions: [], isLoading: false }
  );
  const { services, isLoading: serviceLoading } = useSelector(
    (state) => state.services || { services: [], isLoading: false }
  );
  const [selectedServices, setSelectedServices] = useState([]);
  const [chosenPromotion, setChosenPromotion] = useState(null);
  const currentDate = validCurrentDate();

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

  useEffect(() => {
    dispatch(getAllServices());
  }, [dispatch]);

  useEffect(() => {
    const foundPromotion = promotions.find(
      (promotion) => promotion._id === promotionId
    );
    if (foundPromotion) {
      setChosenPromotion(foundPromotion);
      setSelectedServices(foundPromotion.serviceIds || []);
    }
  }, [promotions, promotionId]);

  const handleExitUpdatePromotion = () => {
    setIsOpenUpdatePromotion(false);
    navigate("/admin-promotion");
  };
  const onSubmit = async (data) => {
    if (!validatePromotionName(data.promotionName)) return;
    if (!validateSelectedServices()) return;

    const promotionData = {
      ...data,
      serviceIds: selectedServices.map((service) => service._id),
    };

    const result = await dispatch(
      updatePromotion({ promotionData, id: promotionId })
    );
    if (result.type.endsWith("fulfilled")) {
      toast.success("Cập nhật mã khuyến mãi thành công", successStyle);
      navigate("/admin-promotion");
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
    await dispatch(getAllPromotions());
    handleExitUpdatePromotion();
  };

  const validatePromotionName = (name) => {
    const trimmedName = name.trim().toLowerCase();
    const existingPromotion = promotions.find(
      (promo) =>
        promo.promotionName.trim().toLowerCase() === trimmedName &&
        new Date(promo.endDate) >= new Date() &&
        promo._id !== promotionId
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

  const validateSelectedServices = () => {
    const serviceNames = selectedServices.map((service) => service.name);
    const uniqueServiceNames = new Set(serviceNames);
    if (uniqueServiceNames.size !== selectedServices.length) {
      toast.error(
        "Dịch vụ đã chọn có sự trùng lặp. Vui lòng chọn lại.",
        errorStyle
      );
      return false;
    }
    return true;
  };

  const handleServiceDeselect = (serviceId) => {
    setSelectedServices((prevSelectedServices) =>
      prevSelectedServices.filter((service) => service._id !== serviceId)
    );
  };

  const handleServiceSelect = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => {
        const service = services.find(
          (service) => service._id === option.value
        );
        return { _id: service._id, name: service.name };
      }
    );
    setSelectedServices((prevSelectedServices) => {
      const newServices = selectedOptions.filter(
        (newService) =>
          !prevSelectedServices.some(
            (service) => service._id === newService._id
          )
      );
      return [...prevSelectedServices, ...newServices];
    });
  };

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    syncEndDateWithStartDate(startDate, endDate, setValue);
  }, [startDate, endDate, setValue]);

  function formatInput(date) {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  }

  if (promotionLoading || serviceLoading) {
    return <Spinner />;
  }

  if (!services || !chosenPromotion) {
    return <div>Error loading data. Please try again later.</div>;
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-row">
      <AdminSidebar />
      <div className="w-full p-10">
        <div className="flex mb-10 text-2xl font-bold">
          Đang <p className="text-primary text-2xl px-2">Cập nhật</p> khuyến mãi{" "}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="content">
          <div className="flex gap-2 mb-5">
            <div className="flex flex-col w-full col-span-1 lg:col-span-8">
              <div className="text-gray mb-2">Tên ưu đãi</div>
              <input
                type="text"
                {...register("promotionName")}
                className="shadow appearance-none border py-3 px-3 rounded"
                defaultValue={chosenPromotion?.promotionName}
                placeholder="Nhập tên của khuyến mãi"
                required
              />
              {errors.promotionName && (
                <p className="text-red text-center">
                  {errors.promotionName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col w-full col-span-1 lg:col-span-8">
              <div className="text-gray mb-2">Ngày bắt đầu</div>

              <input
                {...register("startDate", rules.startDate)}
                type="date"
                min={currentDate}
                defaultValue={formatInput(chosenPromotion?.startDate)}
                className={`shadow appearance-none border py-3 px-3 rounded ${errors.startDate ? "error-input" : ""
                  }`}
              />
            </div>

            <div className="flex flex-col w-full col-span-1 lg:col-span-8">
              <div className="text-gray mb-2">Ngày kết thúc</div>
              <input
                type="date"
                name="endDate"
                min={startDate || currentDate}
                {...register("endDate", rules.endDate)}
                defaultValue={formatInput(chosenPromotion?.endDate)}
                required
                className={`shadow appearance-none border py-3 px-3 rounded ${errors.endDate ? "error-input" : ""
                  }`}
              />
            </div>
          </div>
          <div className="flex gap-2 mb-2">
            <div className="flex flex-col w-full col-span-1 lg:col-span-8">
              <div className="text-gray mb-2">Mã giảm giá</div>
              <input
                type="text"
                {...register("promotionCode")}
                placeholder="Nhập mã giảm giá"
                defaultValue={chosenPromotion?.promotionCode}
                required
                className="shadow appearance-none border py-3 px-3 rounded"
              />
            </div>
            <div className="flex flex-col w-full col-span-1 lg:col-span-8">
              <div className="text-gray mb-2">Giá trị của mã</div>
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
                defaultValue={chosenPromotion?.promotionValue}
                className={`shadow appearance-none border py-3 px-3 rounded ${errors.promotionValue ? "border-red" : ""
                  }`}
              />
              {errors.promotionValue && (
                <p className="text-red text-center">
                  {errors.promotionValue.message}
                </p>
              )}
            </div>
            <div className="flex flex-col w-full col-span-1 lg:col-span-8">
              <div className="text-gray mb-2">Số lượng mã</div>
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
                className={`shadow appearance-none border py-3 px-3 rounded ${errors.promotionQuantity ? "border-red" : ""
                  }`}
                defaultValue={chosenPromotion.promotionQuantity}
              />
              {errors.promotionQuantity && (
                <p className="text-red text-center">
                  {errors.promotionQuantity.message}
                </p>
              )}

            </div>
          </div>
          <div className="flex gap-7 mb-2">
            <div className="w-full col-span-1 lg:col-span-4">
              <div className="text-gray mb-2">Lựa chọn dịch vụ</div>
              <select
                className="shadow  border py-3 px-3 rounded"
                style={{ width: '100%' }}
                size={6}
                {...register("serviceIds")}
                multiple
                onChange={handleServiceSelect}
              >
                {services?.map((service) => {
                  if (
                    !selectedServices.some(
                      (selected) => selected._id === service._id
                    )
                  ) {
                    return (
                      <option key={service._id} value={service._id}>
                        {service.name}
                      </option>
                    );
                  }
                  return null;
                })}
              </select>
            </div>
            <div className="w-full col-span-1 lg:col-span-4">
              <div>
                <span className="font-bold">Đã chọn:</span>
              </div>
              <ul className="space-y-2">
                {selectedServices.map((selected) => {
                  return (
                    <li
                      className="flex items-center fled-wrap"
                      key={selected._id}
                    >
                      <span className="w-72">{selected.name}</span>
                      <button
                        type="button"
                        className="ml-2 text-red"
                        onClick={() => handleServiceDeselect(selected._id)}
                      >
                        <FaTimes />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
      
      <button
        type="submit"
        className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
      >
        Cập nhật khuyến mãi
      </button>
    </form>
      </div >
    </div >
  );
};
