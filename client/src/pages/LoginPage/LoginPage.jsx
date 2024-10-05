import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { AiOutlineClose } from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";
import { TfiEmail } from "react-icons/tfi";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { rules } from "../../utils/rules";
import { auth } from "../../firebase";
import { deleteUser, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAllAccounts, login, loginWithGoogle, reset } from "../../features/auth/authSlice";
import { Spinner } from "../../components";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { errorStyle } from "../../utils/toast-customize";

export const LoginPage = ({ setIsOpenLoginForm, setCustomerInfo }) => {
  const [accounts, setAccounts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const account = data;

    const accountWithPhone = accounts.find((acc) => String(acc.phoneNumber) === String(data.phoneNumber) && acc.isBlocked)

    if(accountWithPhone) {
      toast.error("Tài khoản này đã bị chặn !!!")
    } else {
      dispatch(login(account));
    }
  };

  const initiateAllAccounts = async () => {
    const response = await dispatch(getAllAccounts());
    setAccounts(response.payload);
  };

  useEffect(() => {
    initiateAllAccounts();
  }, []);

  useEffect(() => {
    if (isError && message == "Số điện thoại hoặc mật khẩu không đúng") {
      toast.error(message, errorStyle);
    }

    if (account) {
      setIsOpenLoginForm(false);
    }

    dispatch(reset());
  }, [account, isError, isSuccess, message, navigate, dispatch]);

  //Login with Google
  const provider = new GoogleAuthProvider();

  const checkExistEmailAccount = (newEmail) => {
    const listEmails = accounts.map((item) => item.email);
    if (listEmails.includes(newEmail)) {
      return true;
    } else {
      return false;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const emailExists = checkExistEmailAccount(result.user.email);

      if (!emailExists) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await deleteUser(currentUser); // Xóa người dùng ngay lập tức khỏi Firebase Authentication
        }

        toast.error(
          "Email này chưa đăng kí tài khoản cho hệ thống Antidee, hãy sử dụng mail khác"
        );
        return;
      }

      const account = { email: result.user.email }

      const credential = GoogleAuthProvider.credentialFromResult(result);

      dispatch(loginWithGoogle(account));

    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    }
  };


  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="popup active">
      <div className="overlay"></div>
      <div className="content login-container m-auto rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AiOutlineClose
            className="absolute text-sm hover:cursor-pointer"
            onClick={() => setIsOpenLoginForm(false)}
          />
          <h5 className="text-center font-bold mb-3">Đăng nhập</h5>
          <hr></hr>
          <p className="font-bold mt-3">
            Chào mừng quay trở lại <span className="text-primary">Antidee</span>
          </p>
          <div className="mb-3 mt-5">
            <p className="small-text">Số điện thoại</p>
            <input
              type="text"
              className="border border-gray-500 rounded-md p-1 text-sm focus:outline-none"
              {...register("phoneNumber", rules.phoneNumber)}
            />
            {errors.phoneNumber && (
              <p className="text-red small-text">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <p className="small-text">Mật khẩu</p>
            <input
              type="password"
              className="border border-gray-500 rounded-md p-1 text-sm focus:outline-none"
              {...register("password", rules.password)}
            />
            {errors.password && (
              <p className="text-red small-text">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1"
          >
            <p>Đăng nhập</p>
          </button>
          <Link to={"/forgot-password"}>
            <button
              className="text-right small-text font-medium mb-2"
              onClick={() => setIsOpenLoginForm(false)}
            >
              Quên mật khẩu
            </button>
          </Link>
        </form>
        <div class="flex items-center w-full max-w-md mb-3">
          <div class="flex-grow border-t border-gray"></div>
          <span class="mx-4 text-gray text-xs">Hoặc</span>
          <div class="flex-grow border-t border-gray"></div>
        </div>
        <div className="social-login">
          <button className="flex border border-gray-500 rounded-md mb-3 p-3 items-center justify-between fea-item"
            onClick={() => handleGoogleLogin()}
          >
            <FcGoogle className="mx-2" />{" "}
            <p className="font-bold text-xs">Đăng nhập bằng Google</p>
            <div></div>
          </button>
          <button className="flex border border-gray-500 rounded-md mb-3 p-3 items-center justify-between fea-item">
            <BsFacebook className="mx-2 text-blue" />{" "}
            <p className="font-bold text-xs">Đăng nhập bằng Facebook</p>
            <div></div>
          </button>
        </div>
      </div>
    </div>
  );
};
