import { auth } from "../../firebase";
import { deleteUser, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { errorStyle } from "../../utils/toast-customize";
import { FaCheck } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { GiVacuumCleaner } from "react-icons/gi";
import { BsFacebook, BsPhone } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import SignUpWithOTP from "./SignUpWithOTP/SignUpWithOTP";
import SignUpWithGoogle from "./SignUpWithGoogle/SignUpWithGoogle";
import SignUpWithFacebook from "./SignUpWithFacebook/SignUpWithFacebook";
import { useState } from "react";

export const SignUpPage = () => {
  const { accounts, isLoading } = useSelector((state) => state.auth);

  //Chọn role đăng kí
  const [openChooseRole, setOpenChooseRole] = useState(true)
  const [roleSignUp, setRoleSignUp] = useState('')

  //Chọn phương thức đăng kí OTP/GMAIL/Facebook và mở trang đăng kí
  const [choosenMethodLogin, setChoosenMethodLogin] = useState("")
  const [pageLoginMethod, setPageLoginMethod] = useState(true)

  //Hỗ trợ phương thức đăng kí bằng google
  const [googleAccount, setGoogleAccount] = useState("")

  //Hỗ trợ phương thức đăng kí bằng Facebook
  const [facebookAccount, setFacebookAccount] = useState("")

  const checkExistEmailAccount = (newEmail) => {
    const listEmails = accounts.map((item) => item.email);
    if (listEmails.includes(newEmail)) {
      return true;
    } else {
      return false;
    }
  };


  //SignUp with Google
  const googleAuthProvider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);

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

  //SignUp with Facebook
  const fbAuthProvider = new FacebookAuthProvider();

  const handleFacebookLogin = async () => {
    try {
      const facebookResult = await signInWithPopup(auth, fbAuthProvider);

      const emailExists = checkExistEmailAccount(facebookResult.user.email);

      if (emailExists) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await deleteUser(currentUser);
        }

        toast.error(
          "Email của facebook này đã đăng kí tài khoản cho hệ thống Antidee, hãy sử dụng tài khoản khác",
          errorStyle
        );
        return;
      }

      // const credential = FacebookAuthProvider.credentialFromResult(facebookResult);

      setFacebookAccount(facebookResult.user);
      setChoosenMethodLogin("Facebook");
      setPageLoginMethod(false);

    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      const credential = FacebookAuthProvider.credentialFromError(error);
    }
  };

  return (
    <section className="flex items-center justify-center mt-10">
      <div className="py-12">
        {openChooseRole &&
          <div className="popup active">
            <div className="overlay"></div>
            <div className="content register-container m-auto rounded-xl w-[100%] sm:w-[80%] md:w-[60%]">
              <div>
                <p className="font-bold mt-3 mb-4 text-center text-xl">
                  Đăng kí với vai trò là <span className="text-primary text-2xl">Người dùng </span> hay <span className="text-primary text-2xl">Người giúp việc </span>
                </p>
                <div className="flex flex-col md:flex-row justify-between">
                  <button
                    className={`flex border rounded-md py-6 items-center justify-around my-6 md:m-6 cursor-pointer ${roleSignUp === "Khách hàng" && 'text-primary'}`}
                    onClick={() => setRoleSignUp("Khách hàng")}
                  >
                    <FaRegUser size={25} />
                    <p className="font-bold text-base">Đăng ký với vai trò là Khách hàng</p>
                    <div>{roleSignUp === "Khách hàng" && <FaCheck />}</div>
                  </button>
                  <button
                    className={`flex border rounded-md py-6 items-center justify-around my-6 md:m-6 cursor-pointer ${roleSignUp === "Người giúp việc" && 'text-primary'}`}
                    onClick={() => setRoleSignUp("Người giúp việc")}
                  >
                    <GiVacuumCleaner size={30} />
                    <p className="font-bold text-base">Đăng ký với vai trò là Người giúp việc</p>
                    <div>{roleSignUp === "Người giúp việc" && <FaCheck />}</div>
                  </button>
                </div>
                <div className="w-[100%] sm:w-[80%] md:w-[40%] mx-auto mt-4">
                  {roleSignUp ?
                    <button className="flex items-center justify-center p-4 bg-primary rounded-lg text-center text-white font-bold cursor-pointer fea-item hover:bg-primary_dark"
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


        {/* Chọn phương thức đăng kí */}
        {pageLoginMethod &&
          <div className="flex flex-col p-2 md:p-0">
            <h2 className="font-bold text-center text-2xl">
              Vui lòng chọn phương thức đăng kí ở bên dưới !!!!
            </h2>
            <div className="flex flex-col justify-center items-center gap-y-2 p-2 sm:text-sx md:flex-row md:text-base md:gap-y-0">Bạn đang đăng kí với vai trò là <p className="text-primary font-bold mx-2 text-lg">"{roleSignUp}"</p> <div className="text-gray cursor-pointer hover:text-primary_dark" onClick={() => setOpenChooseRole(true)}>| Thay đổi ngay?</div></div>
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
                onClick={handleFacebookLogin}>
                <BsFacebook className="mx-2" size={20} />{" "}
                <p className="font-bold text-base">Đăng ký bằng Facebook</p>
                <div></div>
              </button>
            </div>
          </div>
        }
        {/* Phương thức đăng kí */}
        {choosenMethodLogin === "OTP" && <SignUpWithOTP roleSignUp={roleSignUp} />}
        {choosenMethodLogin === "Google" && <SignUpWithGoogle roleSignUp={roleSignUp} googleAccount={googleAccount} />}
        {choosenMethodLogin === "Facebook" && <SignUpWithFacebook roleSignUp={roleSignUp} facebookAccount={facebookAccount} />}
      </div>
    </section>
  );
};