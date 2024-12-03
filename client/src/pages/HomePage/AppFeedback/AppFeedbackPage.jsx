import React, { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Spinner } from "../../../components";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import { AiOutlineClose } from "react-icons/ai";
import { createAppFeedback } from "../../../features/appFeedbacks/appFeedbackSlice";

export const CreateAppFeedback = ({ setIsOpenCreateAppFeedback }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await dispatch(createAppFeedback(data));
    setLoading(false);

    if (result.type.endsWith("fulfilled")) {
      toast.success("Gửi ý kiến phản hồi thành công", successStyle);
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
    setIsOpenCreateAppFeedback(false);
  };

  return (
    <div className="popup active flex items-center justify-center fixed inset-0 z-50">
      <div className="overlay absolute inset-0 bg-black opacity-50"></div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="content relative bg-white rounded-md p-5 w-full sm:w-11/12 md:w-2/3 lg:w-1/2"
      >
        <AiOutlineClose
          className="absolute top-3 right-3 text-gray-500 hover:cursor-pointer"
          onClick={() => setIsOpenCreateAppFeedback(false)}
          aria-label="Close"
        />
        <p className="text-center text-green font-bold text-lg md:text-xl mb-4">
          Ý kiến của bạn về website
        </p>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm md:text-base">Tên của bạn</label>
            <input
              type="text"
              {...register("name", {
                required: "Vui lòng nhập tên",
                validate: (value) =>
                  !/( {2,})/.test(value) || "Tên không được chứa hai khoảng trắng liên tiếp",
              })}
              className={`w-full bg-light_gray h-10 rounded-md text-center focus:outline-none ${
                errors.name ? "border-red" : ""
              }`}
            />
            {errors.name && (
              <span className="text-red text-sm">{errors.name.message}</span>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm md:text-base">Số điện thoại</label>
              <input
                type="text"
                {...register("phoneNumber", {
                  required: "Vui lòng nhập số điện thoại",
                  pattern: {
                    value: /^0\d{9,10}$/,
                    message: "Số điện thoại phải bắt đầu bằng số 0 và gồm 10 hoặc 11 chữ số",
                  },
                })}
                className={`w-full bg-light_gray h-10 rounded-md text-center focus:outline-none ${
                  errors.phoneNumber ? "border-red" : ""
                }`}
              />
              {errors.phoneNumber && (
                <span className="text-red text-sm">{errors.phoneNumber.message}</span>
              )}
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-sm md:text-base">Email</label>
              <input
                type="text"
                {...register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không đúng định dạng",
                  },
                })}
                className={`w-full bg-light_gray h-10 rounded-md text-center focus:outline-none ${
                  errors.email ? "border-red" : ""
                }`}
              />
              {errors.email && (
                <span className="text-red text-sm">{errors.email.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm md:text-base">Ý kiến</label>
            <textarea
              {...register("description", {
                required: "Vui lòng nhập ý kiến của bạn",
                maxLength: {
                  value: 255,
                  message: "Ý kiến không được vượt quá 255 ký tự",
                },
              })}
              className={`w-full bg-light_gray rounded-md p-2 focus:outline-none ${
                errors.description ? "border-red" : ""
              }`}
              rows="4"
            />
            {errors.description && (
              <span className="text-red text-sm">{errors.description.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white text-center rounded-md p-2 font-medium ${
              loading ? "bg-gray" : "hover:bg-primary_dark"
            }`}
          >
            {loading ? <Spinner /> : "Gửi ý kiến"}
          </button>
        </div>
      </form>
    </div>
  );
};

