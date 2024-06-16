import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import { AiOutlineClose } from "react-icons/ai";
import { BsFacebook, BsPhone } from "react-icons/bs";
import { TfiEmail } from "react-icons/tfi";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { rules } from "../../utils/rules";

export const RegisterPage = ({ setIsOpenRegisterForm }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="popup active">
      <div className="overlay"></div>
      <div className="content register-container m-auto rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AiOutlineClose
            className="absolute text-sm hover:cursor-pointer"
            onClick={() => setIsOpenRegisterForm(false)}
          />
          <h5 className="text-center font-bold mb-3">Đăng ký</h5>
          <hr></hr>
          <p className="font-bold mt-3 mb-4">
            Chào mừng đến với <span className="text-primary">Antidee</span>
          </p>
          <Link>
            <Link to={"/sign-up"}>
              <button
                className="flex border border-primary rounded-md mb-3 py-6 px-3 items-center justify-between"
                onClick={() => setIsOpenRegisterForm(false)}
              >
                <BsPhone className="mx-2" />{" "}
                <p className="font-bold text-xs">Đăng ký bằng Số Điện Thoại</p>
                <div></div>
              </button>
            </Link>{" "}
          </Link>

          <Link>
            <p className="text-right text-xs font-medium m-5">
              Đã có tài khoản?{" "}
              <Link to={"/login"}>
                <span className="text-xs text-primary">Đăng nhập</span>
              </Link>{" "}
              ở đây
            </p>
          </Link>

          <div class="flex items-center w-full max-w-md mb-3">
            <div class="flex-grow border-t border-gray"></div>
            <span class="mx-4 text-gray">Hoặc</span>
            <div class="flex-grow border-t border-gray"></div>
          </div>

          <div className="social-register">
            <button className="flex border border-gray-500 rounded-md mb-3 p-3 items-center justify-between">
              <BsFacebook className="mx-2" />{" "}
              <p className="font-bold text-xs">Đăng ký bằng Facebook</p>
              <div></div>
            </button>
            <button className="flex border border-gray-500 rounded-md mb-3 p-3 items-center justify-between">
              <TfiEmail className="mx-2" />{" "}
              <p className="font-bold text-xs">Đăng ký bằng Email</p>
              <div></div>
            </button>
            <button className="flex border border-gray-500 rounded-md mb-3 p-3 items-center justify-between">
              <FcGoogle className="mx-2" />{" "}
              <p className="font-bold text-xs">Đăng ký bằng Google</p>
              <div></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
