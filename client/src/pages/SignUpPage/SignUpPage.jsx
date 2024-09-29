import { CgSpinner } from "react-icons/cg";
import { useEffect, useState } from "react";
import { firebase } from "../../firebase";
import { auth } from "../../firebase";
import { deleteUser, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { getAllAccounts, login, register } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { errorStyle, successStyle } from "../../utils/toast-customize";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { FaCheck, FaRegEyeSlash } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { GiVacuumCleaner } from "react-icons/gi";
import axios from "axios";
import { BsFacebook, BsPhone } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

export const SignUpPage = () => {
  const { accounts, isLoading } = useSelector((state) => state.auth);

  //Phương thức đăng kí bằng OTP 
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hidePhoneNumber, setHidePhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [openPageInputOTP, setOpenPageInputOTP] = useState(false);
  const [openPageInputAccountInformation, setOpenPageInputAccountInformation] = useState(false);
  const [inputOtp, setInputOtp] = useState(Array(6).fill(""));

  //Nhập password của trang login bằng OTP
  const [password, setPassword] = useState("");
  const [confirmPassword, setcomfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //Chọn role đăng kí
  const [openChooseRole, setOpenChooseRole] = useState(true)
  const [roleSignUp, setRoleSignUp] = useState('')

  //Chọn phương thức đăng kí OTP/GMAIL/Facebook và mở trang đăng kí
  const [choosenMethodLogin, setChoosenMethodLogin] = useState("")
  const [pageLoginMethod, setPageLoginMethod] = useState(true)

  //Hỗ trợ cho nhập địa chỉ của người giúp việc
  const cityUrl = 'https://api.mysupership.vn/v1/partner/areas/province';
  const [cities, setCities] = useState([]);
  const [cityCode, setCityCode] = useState("Thành phố Đà Nẵng");

  //Nhập thông tin nói chung của 1 account bất kể phương thức đăng kí nào
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")

  //Hỗ trợ phương thức đăng kí bằng google
  const [googleAccount, setGoogleAccount] = useState("")

  useEffect(() => {
    axios
      .get(cityUrl, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      })
      .then(({ data }) => {
        setCities(data.results);
        setLoading(false);
      })
  }, []);


  const dispatch = useDispatch();
  const navigate = useNavigate();


  //Validation 
  const checkExistPhoneAccount = (newPhone) => {
    console.log("Account Data", accounts);
    const listPhones = accounts.map((item) => item.phoneNumber);
    if (listPhones.includes(newPhone)) {
      return true;
    } else {
      return false;
    }
  };

  const checkExistEmailAccount = (newEmail) => {
    const listEmails = accounts.map((item) => item.email);
    if (listEmails.includes(newEmail)) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    dispatch(getAllAccounts());
  }, []);

  const onSubmitCreateAccount = async () => {
    if (!email) {
      toast.error("Vui lòng điền email !")
      return
    }

    if (checkExistEmailAccount(email)) {
      toast.error("Mail đã tồn tại hãy thử mail khác !")
      return
    }

    if (!lastName.trim()) {
      toast.error("Họ không được để trống !")
      return
    }

    // Kiểm tra nếu firstName rỗng
    if (!firstName.trim()) {
      toast.error("Tên không được để trống !")
      return
    }

    const accountData = {
      phoneNumber: 0 + phoneNumber,
      password: password,
      role: roleSignUp,
      email: email,
      address: cityCode,
      name: lastName.trim() + ' ' + firstName.trim()
    };

    const result = await dispatch(register(accountData));
    if (result.type.endsWith("fulfilled")) {
      toast.success("Đăng Ký Tài Khoản Thành Công !!!!!", successStyle);
      dispatch(login({phoneNumber: accountData.phoneNumber, password: accountData.password}));
      if(accountData.role == 'Người giúp việc'){
        navigate("/become-helper");
      } else{
        navigate("/home");
      }
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
      toast.error("Vui lòng nhập số điện thoại có 10 hoặc 11 chữ số !!!");
      return;
    }

    const formattedPhoneNumber = `+84${phoneNumber}`;

    const accountData = {
      phoneNumber: 0 + phoneNumber,
    };

    console.log("Get phone ", accountData.phoneNumber);
    if (checkExistPhoneAccount(accountData.phoneNumber)) {
      toast.error(
        "Số điện thoại này đã đăng kí tài khoản !!! Hãy thử số điện thoại khác",
        errorStyle
      );
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
        setOpenPageInputOTP(true);
        setChoosenMethodLogin("")
        // window.confirmationResult.confirm(testVerificationCode);
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
        setOpenPageInputOTP(false)
        setOpenPageInputAccountInformation(true);
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

    // toast.success("Mật khẩu hợp lệ");
    onSubmitCreateAccount();
  };


  //Login with Google
  const provider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const emailExists = checkExistEmailAccount(result.user.email);

      if (emailExists) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await deleteUser(currentUser); // Xóa người dùng ngay lập tức khỏi Firebase Authentication
        }

        toast.error(
          "Email này đã đăng kí tài khoản cho hệ thống Antidee, hãy sử dụng mail khác",
          errorStyle
        );
        return;
      }

      const credential = GoogleAuthProvider.credentialFromResult(result);
      setGoogleAccount(result.user);
      setEmail(result.user.email);
      setFullName(result.user.displayName);
      setChoosenMethodLogin("Google");
      setPageLoginMethod(false);

    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    }
  };


  //Submit bằng google
  const onSubmitCreateAccountWithGoogle = async () => {
    if (checkExistPhoneAccount(phoneNumber)) {
      toast.error("Số điện thoại này đã đăng kí tài khoản !!! Hãy thử số điện thoại khác");
      return;
    }

    const accountData = {
      phoneNumber: phoneNumber,
      role: roleSignUp,
      email: email,
      address: cityCode,
      name: fullName,
    };

    const result = await dispatch(register(accountData));
    if (result.type.endsWith("fulfilled")) {
      toast.success("Đăng Ký Tài Khoản Thành Công !!!!!", successStyle);
      navigate("/become-helper");
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
  };

  const handleCheckGoogle = (e) => {
    e.preventDefault();
    onSubmitCreateAccountWithGoogle()
  }

  return (
    <section className="flex items-center justify-center mt-10">
      <div className="py-12">
        {openChooseRole &&
          <div className="popup active">
            <div className="overlay"></div>
            <div className="content register-container m-auto rounded-xl w-[60%]">
              <div>
                <p className="font-bold mt-3 mb-4 text-center text-xl">
                  Đăng kí với vai trò là <span className="text-primary text-2xl">Người dùng </span> hay <span className="text-primary text-2xl">Người giúp việc </span>
                </p>
                <div className="flex justify-between">
                  <button
                    className={`flex border rounded-md py-6 items-center justify-around m-6 cursor-pointer ${roleSignUp === "Khách hàng" && 'text-primary'}`}
                    onClick={() => setRoleSignUp("Khách hàng")}
                  >
                    <FaRegUser size={25} />
                    <p className="font-bold text-base">Đăng ký với vai trò là Khách hàng</p>
                    <div>{roleSignUp === "Khách hàng" && <FaCheck />}</div>
                  </button>
                  <button
                    className={`flex border rounded-md py-6 items-center justify-around m-6 cursor-pointer ${roleSignUp === "Người giúp việc" && 'text-primary'}`}
                    onClick={() => setRoleSignUp("Người giúp việc")}
                  >
                    <GiVacuumCleaner size={30} />
                    <p className="font-bold text-base">Đăng ký với vai trò là Người giúp việc</p>
                    <div>{roleSignUp === "Người giúp việc" && <FaCheck />}</div>
                  </button>
                </div>
                <div className="w-[40%] mx-auto mt-4">
                  {roleSignUp ?
                    <button className="flex items-center justify-center p-4 bg-primary rounded-lg text-center text-white   font-bold cursor-pointer fea-item hover:bg-primary_dark"
                      onClick={() => setOpenChooseRole(false)}
                    >
                      Đăng kí với vai trò "{roleSignUp}"
                    </button> : <button disabled className="p-4 rounded-lg text-center text-white font-bold cursor-not-allowed bg-gray"
                    >Đăng kí</button>
                  }
                </div>
                <div className="flex justify-center items-center text-base mt-4">
                  Đã có tài khoản? <p className="text-primary mx-2 text-base">Đăng nhập</p>
                </div>
              </div>
            </div>
          </div>
        }

        {/* Button liên quan đến authen bằng OTP */}
        <div id="sign-in-button"></div>

        {/* Chọn phương thức đăng kí */}
        {pageLoginMethod &&
          <div className="flex flex-col">
            <h2 className="font-bold text-center text-2xl">
              Vui lòng chọn phương thức đăng kí ở bên dưới !!!!
            </h2>
            <div className="flex justify-center items-end p-2">Bạn đang đăng kí với vai trò là <p className="text-primary font-bold mx-2 text-lg">"{roleSignUp}"</p> <div className="text-gray cursor-pointer hover:text-primary_dark" onClick={() => setOpenChooseRole(true)}>| Thay đổi ngay?</div></div>
            <div className="flex flex-col">
              <button
                className="flex border border-gray rounded-md mt-6 py-6 px-3 items-center justify-between fea-item hover:border-primary hover:text-primary"
                onClick={() => { setChoosenMethodLogin("OTP"), setPageLoginMethod(false) }}
              >
                <BsPhone className="mx-2" />{" "}
                <p className="font-bold text-base ">Đăng ký bằng Số Điện Thoại</p>
                <div></div>
              </button>

              <div className="flex items-center w-full py-6">
                <div className="flex-grow border-t border-gray"></div>
                <span className="mx-4 text-gray">Hoặc</span>
                <div className="flex-grow border-t border-gray"></div>
              </div>

              <button className="flex border border-gray rounded-md mb-6 p-3 items-center justify-between fea-item hover:border-primary hover:text-primary"
                onClick={handleGoogleLogin}
              >
                <FcGoogle className="mx-2" size={20} />{" "}
                <p className="font-bold text-base">Đăng ký bằng Google</p>
                <div></div>
              </button>

              <button className="flex border border-gray rounded-md p-3 items-center justify-between fea-item hover:border-primary hover:text-primary"
                onClick={() => { setChoosenMethodLogin("Facebook"), setPageLoginMethod(false) }}>
                <BsFacebook className="mx-2" size={20} />{" "}
                <p className="font-bold text-base">Đăng ký bằng Facebook</p>
                <div></div>
              </button>
            </div>
          </div>
        }


        {/* OTP Bước 1 nhập số điện thoại */}
        {choosenMethodLogin === "OTP" && <div className="select-none">
          <h2 className="text-[25px] font-bold text-center mb-12">
            Quý khách vui lòng nhập số điện thoại !!!
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
              className="w-[500px] mb-10 bg-primary text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-bold flex justify-center items-center"
              onClick={handleSendOTP}
            >
              <span>Xác nhận</span>
              {loading && (
                <CgSpinner size={20} className="animate-spin" />
              )}
            </button>
          </div>
        </div>}

        {/* OTP Bước 2 nhập mã OTP */}
        {openPageInputOTP &&
          <div className="flex flex-col select-none">
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
                        className="w-[500px] bg-primary mb-10 text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-bold flex justify-center items-center"
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
          </div>
        }

        {/* OTP Bước 3 nhập mật khẩu */}
        {openPageInputAccountInformation &&
          <div className="select-none">
            <form onSubmit={handleCheckPassword}>
              <h2 className="text-[25px] font-bold text-center mb-8">
                Quý khách vui điền thông tin chi tiết !!!
              </h2>
              <div className="flex gap-x-10 mb-8">
                <div className="flex flex-col">
                  <div className="text-gray mb-2">Họ</div>
                  <input
                    className="shadow appearance-none border py-3 px-3 rounded"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-gray mb-2">Tên</div>
                  <input
                    className="shadow appearance-none border py-3 px-3 rounded"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-gray mb-2">Nhập địa chỉ email</div>
              </div>
              <input
                className="shadow appearance-none border py-3 px-3 rounded mb-8"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

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
                className="shadow appearance-none border py-3 px-3 rounded mb-8"
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
                className="shadow appearance-none border py-3 px-3 rounded mb-8"
                value={confirmPassword}
                onChange={(e) => setcomfirmPassword(e.target.value)}
              />

              {roleSignUp === "Người giúp việc" && <div>
                <div className="text-gray mb-2">Tỉnh / Thành phố làm việc</div>
                <select
                  className="shadow  border py-3 px-3 rounded mb-10"
                  style={{ width: '100%' }}
                  onChange={(e) => setCityCode(e.target.value)}
                >
                  {/* Truyển thẳng name luôn khỏi đổi qua code, nhớ check lại */}
                  {cities?.map((city) => <option value={city.name}>{city.name}</option>)}
                </select>
              </div>}

              <button
                type="submit"
                className="w-full bg-primary mb-10 text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-bold flex justify-center items-center"
              >
                <span>Xác nhận</span>
                {loading && <CgSpinner size={20} className="animate-spin" />}
              </button>
            </form>
          </div>
        }

        {/* Đăng kí bằng Google */}
        {
          choosenMethodLogin === "Google" && <div className="select-none">
            <form onSubmit={handleCheckGoogle}>
              <h2 className="text-[25px] font-bold text-center mb-8">
                Quý khách vui điền thông tin chi tiết !!!
              </h2>
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="text-gray mb-2">Ảnh cá nhân</div>
                <img src={googleAccount.photoURL} className="w-28 h-auto object-cover" />
              </div>

              <div className="flex flex-col mb-8">
                <div className="text-gray mb-2">Họ và tên</div>
                <input
                  className="shadow appearance-none border py-3 px-3 rounded"
                  value={googleAccount.displayName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-gray mb-2">Địa chỉ email</div>
              </div>
              <input
                className="shadow appearance-none border py-3 px-3 rounded mb-8 cursor-not-allowed"
                value={googleAccount.email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />

              <div className="flex items-center justify-between">
                <div className="text-gray mb-2">Số điện thoại</div>
              </div>
              <input
                type="number"
                className="shadow appearance-none border py-3 px-3 rounded mb-8"
                value={googleAccount.phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              {roleSignUp === "Người giúp việc" && <div>
                <div className="text-gray mb-2">Tỉnh / Thành phố làm việc</div>
                <select
                  className="shadow  border py-3 px-3 rounded mb-10"
                  style={{ width: '100%' }}
                  onChange={(e) => setCityCode(e.target.value)}
                >
                  {cities?.map((city) => <option value={city.name}>{city.name}</option>)}
                </select>
              </div>}

              <button
                type="submit"
                className="w-full bg-primary mb-10 text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-bold flex justify-center items-center"
              >
                <span>Xác nhận</span>
                {loading && <CgSpinner size={20} className="animate-spin" />}
              </button>
            </form>
          </div>
        }

        {/* Đăng kí bằng Facebook */}
        {
          choosenMethodLogin === "Facebook" && <div>Trang đăng kí bằng Facebook</div>
        }
      </div>
    </section>
  );
};


// Check lại các dòng này: {cities?.map((city) => <option value={city.name}>{city.name}</option>)}
