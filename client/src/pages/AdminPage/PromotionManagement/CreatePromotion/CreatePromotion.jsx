import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createPromotion,
  getAllPromotions,
} from "../../../../features/promotions/promotionSlice";
import { Spinner } from "../../../../components";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../../../utils/toast-customize";
import { AiOutlineClose } from "react-icons/ai";
import "./CreatePromotion.css";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { getAllServices } from "../../../../features/services/serviceSlice";
import {
  syncEndDateWithStartDate,
  validCurrentDate,
} from "../../../../utils/format";
import { rules } from "../../../../utils/rules";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";

export const CreatePromotion = ({ }) => {
  const currentDate = validCurrentDate();
  const { isLoading: promotionLoading } = useSelector(
    (state) => state.promotions
  );
  const [selectedServices, setSelectedServices] = useState([]);
  const { services, isLoading: serviceLoading } = useSelector(
    (state) => state.services
  );
  const [promotions, setPromotions] = useState([]);
  const [isNotified, setIsNotified] = useState(false);
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
  const navigate = useNavigate();

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  async function initialPrommotions() {
    let output = await dispatch(getAllPromotions());

    setPromotions(output.payload);
  }

  useEffect(() => {
    initialPrommotions();
  }, []);

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
      navigate("/admin-promotion");
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
  };

  if (promotionLoading || serviceLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-row">
      <AdminSidebar />
      <div className="w-full p-10">
        <div className="flex mb-10 text-2xl font-bold">
          Đang <p className="text-primary text-2xl px-2">Tạo mới</p> khuyến mãi{" "}
        </div>
        <form className="content" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-2 mb-5">
            <div className="flex flex-col w-full col-span-1 lg:col-span-8">
              <div className="text-gray mb-2">Tên ưu đãi</div>
              <input
                type="text"
                {...register("promotionName", {
                  required: "Tên mã giảm giá là bắt buộc",
                })}
                className="shadow appearance-none border py-3 px-3 rounded"
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
                type="date"
                {...register("startDate", rules.startDate)}
                min={currentDate}
                name="startDate"
                required
                className={`shadow appearance-none border py-3 px-3 rounded ${errors.startDate ? "error-input" : ""}`}
              />
            </div>
            <div className="flex flex-col w-full col-span-1 lg:col-span-8">
              <div className="text-gray mb-2">Ngày kết thúc</div>
              <input
                type="date"
                {...register("endDate", rules.endDate)}
                min={currentDate}
                name="endDate"
                required
                className={`shadow appearance-none border py-3 px-3 rounded ${errors.startDate ? "error-input" : ""
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
                className={`shadow appearance-none border py-3 px-3 rounded  ${errors.promotionQuantity ? "border-red" : ""
                  }`}
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
                size={6}
                {...register("serviceIds")}
                multiple
                onChange={(e) => {
                  setSelectedServices([...selectedServices, e.target.value]);
                }}
                className="shadow  border py-3 px-3 rounded"
								style={{ width: '100%' }}
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
            <div  className="w-full col-span-1 lg:col-span-4">
              <div>
                <span className="font-bold">Đã chọn:</span>
              </div>
              <div>
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
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
          >
            Tạo mã giảm giá
          </button>
        </form>
      </div>
    </div>
  );
};
