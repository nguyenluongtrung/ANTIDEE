import { CgSpinner } from "react-icons/cg";
import { useEffect, useState } from "react";
import { firebase } from "../../firebase";
import { toast, Toaster } from "react-hot-toast";
import {
  getAccountForgottenPassword,
  updateAccountForgottenPassword,
} from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { errorStyle, successStyle } from "../../utils/toast-customize";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";

export const ForgotPasswordPage = () => {
  const [accountId, setAccountId] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(false);
  const [inputOtp, setInputOtp] = useState(Array(6).fill(""));

  const [password, setPassword] = useState("");
  const [confirmPassword, setcomfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [
    displayTextViewInInputPhoneNumber,
    setDisplayTextViewInInputPhoneNumber,
  ] = useState("");

  const [hidePhoneNumber, setHidePhoneNumber] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitCreateAccount = async () => {

    const result = await dispatch(
      updateAccountForgottenPassword({
        password,
        accountId
      })
    );
    if (result.type.endsWith("fulfilled")) {
      toast.success("Thay đổi mật khẩu thành công", successStyle);
      navigate("/home");
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
  };

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        defaultCountry: "VN",
      }
    );
  };

  const handleSendOTP = async () => {
    if (phoneNumber.length < 9) {
      toast.error("Vui lòng nhập số điện thoại có 10 chữ số !!!");
      return;
    }

    const formattedPhoneNumber = `+84${phoneNumber}`;

    const accountData = {
      phoneNumber: 0 + phoneNumber,
    };
    const phoneNumber2 = accountData.phoneNumber;
    let output = await dispatch(getAccountForgottenPassword(phoneNumber2));
    if (!output.payload) {
      toast.error(
        "Số điện thoại này chưa đăng kí tài khoản!!! Hãy thử số điện thoại khác",
        errorStyle
      );
      return;
    }
    setAccountId(output.payload._id);
    const appVerify = window.recaptchaVerifier;
    setLoading(true);

    await firebase
      .auth()
      .signInWithPhoneNumber(formattedPhoneNumber, appVerify)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setHidePhoneNumber(
          `${phoneNumber.slice(0, 2)}*****${phoneNumber.slice(-2)}`
        );
        toast.success("Gửi OTP Thành công!");
        setShowOTP(true);
      })
      .catch((error) => {
        console.log("ERROR SIGN UP", error);
        toast.error("Gửi OTP Thất bại!");
        setLoading(false);
      });
  };

  const handleVerifyOTP = () => {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(() => {
        setUser(true);
        setLoading(false);
        toast.success("Xác thực thành công!!");
      })
      .catch((error) => {
        console.log("ERROR SIGN UP", error);
        toast.error("Xác thực Thất bại!! Kiêm tra lại mã OTP");
        setLoading(false);
      });
  };

  useEffect(() => {
    setupRecaptcha();
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = inputOtp.map((d, idx) =>
      idx === index ? element.value : d
    );
    setInputOtp(newOtp);
    setOtp(newOtp.join(""));

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && inputOtp[index] === "" && index > 0) {
      const newOtp = inputOtp.map((d, idx) => (idx === index - 1 ? "" : d));
      setInputOtp(newOtp);
      e.target.previousSibling.focus();
      setOtp(inputOtp.join(""));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOtp(inputOtp.join(""));
    handleVerifyOTP();
  };

  // const handlePhoneNumberChange = (e) => {
  //   if (isNaN(e.target.value)) return false;
  //   let input = e.target.value;

  //   if (!input.startsWith("0") && input.length == 10) {
  //     toast.error(
  //       "Vui lòng nhập đúng số điện thoại gồm 9 chữ số không bao gồm số 0"
  //     );
  //     return;
  //   }

  //   if (input.startsWith("0") && input.length == 10) {
  //     input = input.substring(1);
  //   }

  //   setPhoneNumber(input);
  // };

  const handlePhoneNumberChange = (e) => {
    if (isNaN(e.target.value)) return false;
    let input = e.target.value;

    if (!input.startsWith("0") && input.length == 11) {
      toast.error(
        "Vui lòng nhập đúng số điện thoại gồm 9 hoặc 10 chữ số không bao gồm số 0"
      );
      return;
    }

    if (input.startsWith("0") && (input.length == 10 || input.length == 11)) {
      input = input.substring(1);
    }
    setPhoneNumber(input);
  };

  const handleCheckPassword = (e) => {
    e.preventDefault();

    if (/\s/.test(password)) {
      toast.error("Mật khẩu không được chứa khoảng trắng !!!");
      return;
    }

    if (!/(?=.*[A-Z])(?=.*\d)/.test(password)) {
      toast.error("Mật khẩu phải chứa ít nhất một ký tự in hoa và một số !!!");
      return;
    }

    if (password.length < 8) {
      toast.error("Mật khẩu phải dài ít nhất 8 ký tự !!!");
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    toast.success("Mật khẩu hợp lệ");
    onSubmitCreateAccount();
  };

  const nameViewInInputPhoneNumber =
    "Quý khách vui lòng nhập số điện thoại !!!";

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const typingEffect = setInterval(() => {
        if (i < nameViewInInputPhoneNumber.length) {
          i++;
          setDisplayTextViewInInputPhoneNumber(
            (prevText) => prevText + nameViewInInputPhoneNumber.charAt(i - 1)
          );
        } else {
          clearInterval(typingEffect);
        }
      }, 100);
      return () => clearInterval(typingEffect);
    }, 900); // Chờ 3 giây trước khi bắt đầu hiệu ứng ghi ra từng chữ

    return () => clearTimeout(timer); // Xóa timer nếu component unmount
  }, [nameViewInInputPhoneNumber]);

  return (
    <section className="flex items-center justify-center mt-16 p-20">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="sign-in-button"></div>
        {user ? (
          <div className="select-none">
            <form onSubmit={handleCheckPassword}>
              <h2 className="text-[25px] font-bold text-center mb-12 ">
                Quý khách vui lòng nhập mật khẩu !!!
              </h2>

              <div className="flex items-center justify-between">
                <div className="text-gray mb-2">Nhập mật khẩu</div>
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center mb-2 gap-x-2 text-gray cursor-pointer"
                >
                  {showPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
                  {showPassword ? "Ẩn" : "Hiện"}
                </div>
              </div>
              <input
                type={`${showPassword ? "text" : "password"}`}
                className="shadow appearance-none border py-3 px-3 rounded mb-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex items-center justify-between">
                <div className="text-gray mb-2">Nhập lại mật khẩu</div>
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
                className="shadow appearance-none border py-3 px-3 rounded mb-10"
                value={confirmPassword}
                onChange={(e) => setcomfirmPassword(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-bold flex justify-center items-center"
              >
                <span>Xác nhận</span>
                {loading && <CgSpinner size={20} className="animate-spin" />}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col select-none">
            {showOTP ? (
              <>
                <div className="flex items-center justify-center">
                  <div className="bg-white rounded-lg ">
                    <h2 className="text-xl font-bold text-center mb-12">
                      Quý khách vui lòng nhập mã OTP được gửi đến số điện thoại
                      <br />
                      {0 + hidePhoneNumber}
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <div className="flex justify-center mb-6">
                        {inputOtp.map((data, index) => {
                          return (
                            <input
                              className="otp-input w-16 h-24 text-center text-[30px] mx-3 border border-gray rounded focus:outline-none focus:ring-2 focus:ring-primary"
                              type="text"
                              name="otp"
                              maxLength="1"
                              key={index}
                              value={data}
                              onChange={(e) => handleChange(e.target, index)}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-center mt-20">
                        <button
                          type="submit"
                          className="w-[500px] bg-primary text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-bold flex justify-center items-center"
                          // onClick={handleVerifyOTP}
                        >
                          <span>Xác nhận</span>
                          {loading && (
                            <CgSpinner size={20} className="animate-spin" />
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            ) : (
              <div className="select-none">
                <h2 className="text-[25px] font-bold text-center mb-12">
                  {displayTextViewInInputPhoneNumber}
                </h2>
                <div className="flex items-center justify-center gap-x-3">
                  <span className="py-3 text-[18px]">+84</span>
                  <input
                    maxLength={11}
                    placeholder="Số điện thoại"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="w-[60%] p-3 text-[18px]"
                  />
                </div>
                <div className="flex items-center justify-center mt-20">
                  <button
                    type="submit"
                    className="w-[500px] bg-primary text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-bold flex justify-center items-center"
                    onClick={handleSendOTP}
                  >
                    <span>Xác nhận</span>
                    {loading && (
                      <CgSpinner size={20} className="animate-spin" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
