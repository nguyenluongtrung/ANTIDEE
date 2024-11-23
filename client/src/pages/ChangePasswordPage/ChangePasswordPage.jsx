import React from 'react'
import { CgSpinner } from "react-icons/cg";
import { useEffect, useState } from "react";
import { firebase } from "../../firebase";
import { toast, Toaster } from "react-hot-toast";
import {
  changePassword,
  getAccountInformation,
} from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { errorStyle, successStyle } from "../../utils/toast-customize";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";


const ChangePasswordPage = () => {

  const [account, setAccount] = useState({})

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGetAccount = async () => {
      const response = await dispatch(getAccountInformation())
      setAccount(response.payload)
    };

    handleGetAccount()
  }, [])

  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({})

  const validateForm = (formData, validations) => {
    const newErrors = {}
    for (const validation of validations) {
      const error = validateField(validation.field, formData[validation.field]?.toString() || '')
      if (error) newErrors[validation.field] = error
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmitCreateAccount = async (e) => {
    e.preventDefault();

    if (!validateForm(formData, validations)) return;

    console.log("Account", account)
    

    const formSubmit = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      phoneNumber: account.phoneNumber,
    }


    const result = await dispatch(
      changePassword({ accountData: formSubmit })
    );
    if (result.type.endsWith("fulfilled")) {
      toast.success("Thay đổi mật khẩu thành công", successStyle);
      navigate("/my-account");
    } else if (result?.error?.message === "Rejected") {
      // toast.error("Mật khẩu cũ không chính xác !!!", errorStyle);
      toast.error(result?.payload, errorStyle);
    }
  };

  const validations = [
    { field: 'oldPassword', label: 'Mật khẩu cũ', required: true, maxLength: 255, noConsecutiveSpaces: true },
    { field: 'newPassword', label: 'Mật khẩu mới', required: true, maxLength: 255, noConsecutiveSpaces: true },
    { field: 'confirmPassword', label: 'Nhập lại mật khẩu', required: true, maxLength: 255, noConsecutiveSpaces: true },
  ]

  const validateField = (field, value) => {
    const validation = validations.find(v => v.field === field)

    if (!validation) return ''

    const { label, required, maxLength, noConsecutiveSpaces } = validation

    const valueToCheck = value ?? ''

    if (required && !valueToCheck.trim()) {
      return `Vui lòng nhập "${label}"`
    }

    if (noConsecutiveSpaces && /\b {2,}\b/.test(valueToCheck)) {
      return `"${label}" không được chứa khoảng trắng liên tiếp`
    }

    if (maxLength && valueToCheck.length > maxLength) {
      return `"${label}" không được vượt quá ${maxLength} ký tự`
    }

    if (field === 'newPassword' || field === 'oldPassword') {
      if (/\s/.test(valueToCheck)) {
        return "Mật khẩu không được chứa khoảng trắng !!!";
      }

      if (!/(?=.*[A-Z])(?=.*\d)/.test(valueToCheck)) {
        return "Mật khẩu phải chứa ít nhất một ký tự in hoa và một số !!!";
      }

      if (valueToCheck.length < 8) {
        return "Mật khẩu phải dài ít nhất 8 ký tự !!!";
      }
    }

    if (field === 'confirmPassword') {
      const password = formData.newPassword;

      if (password && password.trim() !== valueToCheck.trim()) {
        return "Mật khẩu không khớp!";
      }
    }

    return ''
  }

  const handleFormChange = (field, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: value
    }))
    const error = validateField(field, value)
    setErrors({ ...errors, [field]: error })
  }

  useEffect(() => {
    console.log("Form Data UseEffect", formData)
  }, [formData])

  return (
    <div className='flex items-center justify-center mt-16 p-20'>
      <div className="select-none">
        <form onSubmit={onSubmitCreateAccount}>
          <h2 className="text-[25px] font-bold text-center mb-12 ">
            Quý khách vui lòng nhập mật khẩu !!!
          </h2>

          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="text-gray mb-2">Nhập mật khẩu cũ</div>
              <div
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="flex items-center mb-2 gap-x-2 text-gray cursor-pointer"
              >
                {showOldPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
                {showOldPassword ? "Ẩn" : "Hiện"}
              </div>
            </div>
            <input
              type={`${showOldPassword ? "text" : "password"}`}
              className="shadow appearance-none border py-3 px-3 rounded"
              value={formData.oldPassword}
              onChange={e => handleFormChange('oldPassword', e.target.value)}
            />
            <div className='h-4 mb-6'>
              {errors.oldPassword && <div className="text-red mt-2 text-sm px-2">{errors.oldPassword}</div>}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="text-gray mb-2">Nhập mật khẩu mới</div>
              <div
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="flex items-center mb-2 gap-x-2 text-gray cursor-pointer"
              >
                {showNewPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
                {showNewPassword ? "Ẩn" : "Hiện"}
              </div>
            </div>
            <input
              type={`${showNewPassword ? "text" : "password"}`}
              className="shadow appearance-none border py-3 px-3 rounded"
              value={formData.newPassword}
              onChange={e => handleFormChange('newPassword', e.target.value)}
            />
            <div className='h-4 mb-6'>
              {errors.newPassword && <div className="text-red mt-2 text-sm px-2">{errors.newPassword}</div>}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="text-gray mb-2">Nhập lại mật khẩu mới</div>
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="flex items-center mb-2 gap-x-2 text-gray cursor-pointer"
              >
                {showConfirmPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
                {showConfirmPassword ? "Ẩn" : "Hiện"}
              </div>
            </div>
            <input
              type={`${showConfirmPassword ? "text" : "password"}`}
              className="shadow appearance-none border py-3 px-3 rounded"
              value={formData.confirmPassword}
              onChange={e => handleFormChange('confirmPassword', e.target.value)}
            />
            <div className='h-4 mb-6'>
              {errors.confirmPassword && <div className="text-red mt-2 text-sm px-2">{errors.confirmPassword}</div>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-bold flex justify-center items-center"
          >
            <span>Xác nhận</span>
            {/* {loading && <CgSpinner size={20} className="animate-spin" />} */}
          </button>
        </form>
      </div>

    </div>
  )
}

export default ChangePasswordPage