import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import { AiOutlineClose } from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";
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
          <p className="font-bold mt-3">
            Chào mừng đến với <span className="text-primary">Antidee</span>
          </p>
          {/* <div className="mb-3 mt-5">
						<p className="small-text">Số điện thoại</p>
						<input
							type='number'
							className="border border-gray-500 rounded-md p-1"
							{...register('phoneNumber', rules.phoneNumber)}
						/>
						{errors.phoneNumber && (
							<p className="text-red-500 small-text">
								{errors.phoneNumber.message}
							</p>
						)}
					</div>
					<div className="mb-4">
						<p className="small-text">Mật khẩu</p>
						<input
							type='password'
							className="border border-gray-500 rounded-md p-1"
							{...register('password', rules.password)}
						/>
						{errors.password && (
							<p className="text-red-500 small-text">
								{errors.password.message}
							</p>
						)}
					</div> */}
          {/* <button
            type="submit"
            className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1"
          >
            <p>Đăng ký</p>
          </button> */}
          <Link>
            <p className="text-right small-text font-medium mb-5">
              Đã có tài khoản?{" "}
              <Link to={"/login"}>
                <span className="small-text text-primary">Đăng nhập</span>
              </Link>{" "}
              ở đây
            </p>
          </Link>

          <div className="social-register">
            <Link>
              <Link to={"/sign_up"}>
                <button className="block flex border border-gray-500 rounded-md mb-3 p-2 items-center justify-center" onClick={() => setIsOpenRegisterForm(false)}>
                  <BsFacebook className="mr-2" />{" "}
                  <p className="font-bold small-text">
                    Đăng ký bằng Số Điện Thoại
                  </p>
                </button>
              </Link>{" "}
            </Link>

            <button className="block flex border border-gray-500 rounded-md mb-3 p-2 items-center justify-center">
              <BsFacebook className="mr-2" />{" "}
              <p className="font-bold small-text">Đăng ký bằng Facebook</p>
            </button>
            <button className="block flex border border-gray-500 rounded-md mb-3 p-2 items-center justify-center">
              <TfiEmail className="mr-2" />{" "}
              <p className="font-bold small-text">Đăng ký bằng Email</p>
            </button>
            <button className="block flex border border-gray-500 rounded-md mb-3 p-2 items-center justify-center">
              <FcGoogle className="mr-2" />{" "}
              <p className="font-bold small-text">Đăng ký bằng Google</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
