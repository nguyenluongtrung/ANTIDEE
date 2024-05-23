// import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { useEffect, useState } from "react";
// import { auth } from "../../firebase";
import { firebase } from "../../firebase";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { getAllAccounts, register } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { errorStyle, successStyle } from "../../utils/toast-customize";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";

export const SignUpPage = () => {
  //Logic Tạo Account (xem lại 79,34,16)
  //Phải lấy được danh sách account để check valid
  const { accounts, isLoading } = useSelector((state) => state.auth);
  //Logic OTP + Phone
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(false);
  const [inputOtp, setInputOtp] = useState(Array(6).fill(""));

  //Logic Mật Khẩu
  const [password, setPassword] = useState("");
  const [confirmPassword, setcomfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //Logic UI show password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //Logic UI show phone
  const [
    displayTextViewInInputPhoneNumber,
    setDisplayTextViewInInputPhoneNumber,
  ] = useState("");

  //Logic UI hide phone
  const [hidePhoneNumber, setHidePhoneNumber] = useState("");

  //Logic Tạo Account vào DB ---------------------------------------------------------------------
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkExistAccount = (newPhone) => {
    console.log("Account Data", accounts)
    const listPhones = accounts.map((item) => item.phoneNumber);
    if (listPhones.includes(newPhone)) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    dispatch(getAllAccounts());
  }, [])

  const onSubmitCreateAccount = async () => {
    const accountData = {
      phoneNumber: 0 + phoneNumber,
      password: password,
    };

    const result = await dispatch(register(accountData));
    console.log("ACCount Data", accountData);
    if (result.type.endsWith("fulfilled")) {
      toast.success("Đăng Ký Tài Khoản Thành Công !!!!!", successStyle);
      navigate("/home");
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
  };

  // Logic Làm việc với firebase và OTP ---------------------------------------------------------------------
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

    console.log("Get phone ", accountData.phoneNumber)
    if (checkExistAccount(accountData.phoneNumber)) {
    	toast.error('Số điện thoại này đã đăng kí tài khoản !!! Hãy thử số điện thoại khác', errorStyle);
    	return;
    }

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
        // window.confirmationResult.confirm(testVerificationCode);
      })
      .catch((error) => {
        console.log("ERROR SIGN UP", error);
        toast.error("Gửi OTP Thất bại!");
        setLoading(false);
      });
  };

  //Test ở đây
  const handleVerifyOTP = () => {
    // alert(`OTP in handleVerify: ${otp}`);

    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(() => {
        // console.log(res);
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

  //Logic Input OTP ---------------------------------------------------------------------
  // const handleChange = (element, index) => {
  //   if (isNaN(element.value)) return false;
  //   setInputOtp([
  //     ...inputOtp.map((d, idx) => (idx === index ? element.value : d)),
  //   ]);
  //   setOtp(inputOtp.join(""));
  //   // Focus next input
  //   if (element.nextSibling && element.value) {
  //     element.nextSibling.focus();
  //   }
  // };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = inputOtp.map((d, idx) =>
      idx === index ? element.value : d
    );
    setInputOtp(newOtp);
    setOtp(newOtp.join(""));

    // Focus next input
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
    // alert(`OTP: ${otp}`);
    handleVerifyOTP();
  };

  //Logic kiểm tra nhập số điện thoại
  const handlePhoneNumberChange = (e) => {
    if (isNaN(e.target.value)) return false;
    let input = e.target.value;

    if (!input.startsWith("0") && input.length == 10) {
      toast.error("Vui lòng nhập đúng số điện thoại gồm 9 chữ số không bao gồm số 0")
      return;
    }

    if (input.startsWith("0") && input.length == 10) {
      input = input.substring(1);
    }

    setPhoneNumber(input);
  };

  //Logic kiểm tra mật khẩu ---------------------------------------------------------------------
  const handleCheckPassword = (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu không chứa ký tự trống
    if (/\s/.test(password)) {
      setPasswordError("Mật khẩu không được chứa khoảng trắng !!!");
      toast.error("Mật khẩu không được chứa khoảng trắng !!!");
      return;
    }

    // Kiểm tra mật khẩu phải có ít nhất một ký tự in hoa và một số
    if (!/(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError(
        "Mật khẩu phải chứa ít nhất một ký tự in hoa và một số !!!"
      );
      toast.error("Mật khẩu phải chứa ít nhất một ký tự in hoa và một số !!!");
      return;
    }

    // Kiểm tra mật khẩu phải dài ít nhất 8 ký tự
    if (password.length < 8) {
      setPasswordError("Mật khẩu phải dài ít nhất 8 ký tự !!!");
      toast.error("Mật khẩu phải dài ít nhất 8 ký tự !!!");
      return;
    }

    // Kiểm tra mật khẩu và xác nhận mật khẩu phải khớp
    // Kiểm tra luôn kí tự trống
    if (password.trim() !== confirmPassword.trim()) {
      setPasswordError("Mật khẩu không khớp!");
      toast.error("Mật khẩu không khớp!");
      return;
    }

    // Nếu tất cả các kiểm tra đều hợp lệ
    //THêm vào database
    setPasswordError("");
    toast.success("Mật khẩu hợp lệ");
    onSubmitCreateAccount();
  };

  // Hiệu ứng ở trang đầu
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
    <section className="flex items-center justify-center mt-20">
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
                  {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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
                  {showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                </div>
              </div>
              <input
                type={`${showConfirmPassword ? "text" : "password"}`}
                className="shadow appearance-none border py-3 px-3 rounded mb-10"
                value={confirmPassword}
                onChange={(e) => setcomfirmPassword(e.target.value)}
              />
              {passwordError && (
                <div className="flex items-center justify-center">
                  <div className="mb-4 text-red font-bold">{passwordError}</div>
                </div>
              )}
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
                    maxLength={10}
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

//Làm xong UI See Password
//Hiệu ứng chữ input

//Luồng đi của đổi mật khẩu
//User nhấn vào đổi mật khẩu
//Nhập số điện thoại để xác thực
//Trường hợp 1: Nhớ mật khẩu cũ
//+ Nếu người dùng có tài khoản trên hệ thống thì cho phép đổi
//+ Nếu người dùng không có tài khoản trên hệ thống thì thông báo "Số đt k có trên hệ thống,..."
//+ Nhập mật khẩu cũ, mật khẩu mới

//Trường hợp 2:Không Nhớ mật khẩu cũ
//+ Nếu người dùng có tài khoản trên hệ thống thì cho phép đổi
//+ Nếu người dùng không có tài khoản trên hệ thống thì thông báo "Số đt k có trên hệ thống,..."
//+ Nhập mật khẩu cũ, mật khẩu mới
// const {account, isLoading } = useSelector((state) => state.auth)

// const checkExistAccount = (newPhone) => {
// 	const listPhones = account.map(item => item.name);
// 	if(listPhones.includes(newPhone)){
// 		return true;
// 	} else {
// 		return false;
// 	}
// }

// if (checkExistAccount(phoneNumber)) {
// 	toast.error('Số điện thoại đã tồn tại!!!', errorStyle);
// 	return;
// }

// import firebase from '../../firebase';
// import { useEffect, useState } from "react";
// import firebase from "./../../firebase";

// export const SignUpPage = () => {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");

//   const setupRecaptcha = () => {
//     window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
//       "sign-in-button",
//       {
//         size: "invisible",
//         defaultCountry: "VN",
//       }
//     );
//   };

//   const handleSendOTP = async () => {
//     const appVerify = window.recaptchaVerifier;
//     await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerify).then((confirmationResult) => {
//       window.confirmationResult = confirmationResult;
//       alert("Gửi OTP thành công")
//     }).catch((error) => {
//       console.log("ERROR SIGN UP", error)
//       alert("Gửi OTP Thất bại")
//     })
//     ;
//   };

//   const handleVerifyOTP = () => {
//     window.confirmationResult.confirm(otp).then(() => {
//       alert("Xác thực thành công")
//     }).catch((error) => {
//       console.log("ERROR SIGN UP", error)
//       alert("Xác thực Thất bại")
//     })
//   }

//   useEffect(() => {
//     setupRecaptcha();
//   }, []);

//   return (
//     <div>
//       <div className="flex w-[500px]">
//         <input placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
//         <button onClick={handleSendOTP}>SEND OTP</button>
//       </div>
//       <div className="flex w-[500px] mt-10">
//         <input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)}/>
//         <button className="bg-primary" onClick={handleVerifyOTP}>VERIFI OTP</button>
//       </div>
//       <div id="sign-in-button"></div>
//     </div>
//   );
// };
