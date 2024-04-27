import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { AiOutlineClose } from 'react-icons/ai';
import { BsFacebook } from 'react-icons/bs';
import { TfiEmail } from 'react-icons/tfi';
import { FcGoogle } from 'react-icons/fc';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { rules } from '../../utils/rules';

export const LoginPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

    const onSubmit = (data) => {
        console.log(data)
    }

	return (
		<div className="login-container m-auto rounded-xl">
			<form onSubmit={handleSubmit(onSubmit)}>
				<AiOutlineClose className="absolute text-sm" />
				<h5 className="text-center font-bold mb-3">Đăng nhập</h5>
				<hr></hr>
				<p className="font-bold mt-3">
					Chào mừng quay trở lại <span className="primary-color">Antidee</span>
				</p>
				<div className="mb-3 mt-5">
					<p className="small-text">Số điện thoại</p>
					<input
						className="border border-gray-500 rounded-md p-1"
						{...register('phoneNumber', rules.phoneNumber)}
					/>
                    {errors.phoneNumber && <p className="text-red-500 small-text">{errors.phoneNumber.message}</p>}
				</div>
				<div className="mb-4">
					<p className="small-text">Mật khẩu</p>
					<input
						className="border border-gray-500 rounded-md p-1"
						{...register('password', rules.password)}
					/>
                    {errors.password && <p className="text-red-500 small-text">{errors.password.message}</p>}
				</div>
				<button
					type="submit"
					className="block login-btn text-white text-center rounded-md p-1 font-medium mb-1"
				>
					<p>Đăng nhập</p>
				</button>
				<Link>
					<p className="text-right small-text font-medium mb-5">
						Quên mật khẩu
					</p>
				</Link>

				<div className="social-login">
					<button className="block flex border border-gray-500 rounded-md mb-3 p-2 items-center justify-center">
						<BsFacebook className="mr-2" />{' '}
						<p className="font-bold small-text">Đăng nhập bằng Facebook</p>
					</button>
					<button className="block flex border border-gray-500 rounded-md mb-3 p-2 items-center justify-center">
						<TfiEmail className="mr-2" />{' '}
						<p className="font-bold small-text">Đăng nhập bằng Email</p>
					</button>
					<button className="block flex border border-gray-500 rounded-md mb-3 p-2 items-center justify-center">
						<FcGoogle className="mr-2" />{' '}
						<p className="font-bold small-text">Đăng nhập bằng Google</p>
					</button>
				</div>
			</form>
		</div>
	);
};
