import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { AiOutlineClose } from 'react-icons/ai';
import { BsFacebook } from 'react-icons/bs';
import { TfiEmail } from 'react-icons/tfi';
import { FcGoogle } from 'react-icons/fc';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { rules } from '../../utils/rules';
import { login, reset } from '../../features/auth/authSlice';
import { Spinner } from '../../components';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { errorStyle } from '../../utils/toast-customize';

export const LoginPage = ({ setIsOpenLoginForm }) => {
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
		dispatch(login(account));
	};

	useEffect(() => {
		if (isError) {
			toast.error(message, errorStyle);
		}

		if (isSuccess || account) {
			setIsOpenLoginForm(false);
			navigate('/home');
		}

		dispatch(reset());
	}, [account, isError, isSuccess, message, navigate, dispatch]);

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
							type="number"
							className="border border-gray-500 rounded-md p-1"
							{...register('phoneNumber', rules.phoneNumber)}
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
							className="border border-gray-500 rounded-md p-1"
							{...register('password', rules.password)}
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
		</div>
	);
};
