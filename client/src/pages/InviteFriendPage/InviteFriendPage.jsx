import imgInviteFriend from '../../assets/img/image 19.png';
import logoFacebook from '../../assets/img/logo-Facebook.png';
import img20 from '../../assets/img/image 20.png';
import '../../pages/InviteFriendPage/InviteFriendPage.css';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	getAccountInformation,
	inviteFriend,
} from '../../features/auth/authSlice';
import toast from 'react-hot-toast';
import { errorStyle } from '../../utils/toast-customize';
import { LuCopy } from "react-icons/lu";
import { LuCopyCheck } from "react-icons/lu";

export const InviteFriendPage = () => {
	const [account, setAccount] = useState();
	const [email, setEmail] = useState('');
	const [isCopied, setIsCopied] = useState(false);
	const dispatch = useDispatch();

	const initiateAccountInformation = async () => {
		const output = await dispatch(getAccountInformation());
		setAccount(output.payload);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (email.trim() === '') {
			toast.error('Bạn cần nhập email', errorStyle);
		}

		const response = await dispatch(
			inviteFriend({
				invitedEmail: email,
				invitationCode: account?.invitationCode,
				accountName: account?.name,
			})
		);
		if(response.type.includes('fulfilled')){
			setEmail('')
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(account?.invitationCode);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};

	useEffect(() => {
		initiateAccountInformation();
	}, []);

	return (
		<div className="mb-10 p-4 md:p-0">
			<div className="grid mt-10 pt-1">
				<div className="col-start-3 col-end-3">
					<h2 className="mt-12 md:mt-28 md:ml-20 text-5xl font-semibold text-yellow">
						<span class="text-primary text-6xl"> Chia sẻ</span> liền tay <br />
						Rinh ngay <span class="text-primary text-6xl">quà xịn</span>
					</h2>
				</div>
				<div className="mt-20 md:mt-0 col-end-7 col-span-2 md:size-96">
					<img src={imgInviteFriend} alt="" />
				</div>
			</div>
			<div className="mt-10 md:mt-0 md:ml-40">
				<h3 className="font-bold text-2xl md:text-2xl">Gửi mã giới thiệu cho bạn bè</h3>
				<p className="font-medium text-base md:text-base">
					Cùng bạn bè thảnh thơi và nhận nhiều ưu đãi hấp dẫn không giới hạn từ
					Antidee
				</p>
			</div>
			<div className="md:ml-40 md:mr-40 mt-5 max-w-screen-xl inviteCode">
				<div className=" grid place-items-center pt-5">
					<span className="text-brown text-base font-medium">
						Mã giới thiệu của {account?.name}{' '}
					</span>
					<div className="mt-2 flex pb-8">
						<span className="text-primary text-5xl font-medium mr-3">
							{account?.invitationCode}{' '}
						</span>
						{!isCopied ? <LuCopy onClick={copyToClipboard} size={40} className='text-yellow hover:cursor-pointer'/> : <LuCopyCheck size={40} className='text-yellow hover:cursor-pointer'/>}
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-4 md:ml-40 md:mr-40 max-w-screen-xl mt-10">
				<div className="col-span-2 flex items-center flex-row md:justify-center">
					<input
						className="border-2 border-gray rounded-2xl max-w-lg p-3 focus:outline-none"
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Nhập email bạn muốn giới thiệu"
						value={email}
					></input>
					<button
						className="bg-green text-white rounded-2xl max-w-24 ml-5 py-3"
						onClick={handleSubmit}
					>
						Gửi
					</button>
				</div>
				{/* <span className="grid text-lg justify-center m-auto">hoặc</span>
				<div className=" bg-primary rounded-2xl flex p-4">
					<img src={logoFacebook} className="size-6 mr-3 ml-4" />
					<p className="text-base text-white ">Chia sẻ qua Facebook</p>
				</div> */}
			</div>
			<div className="md:ml-40 md:mr-40 mt-10 max-w-screen-xl">
				<h3 className="font-bold text-2xl md:text-2xl">
					Quà tặng dành cho bạn và bạn bè của bạn
				</h3>
				<h3 className="font-medium text-base md:text-base">
					Nhận ngay ưu đãi khi bạn bè mua dịch vụ đầu tiên
				</h3>

				<div className="mt-10 grid grid-cols-5 gap-4">
					<div className="test flex items-center">
						<img src={img20} />
					</div>

					<div className="col-span-4 p-10 giftContent">
						<h3 className="font-bold text-xl md:text-xl">Antidee</h3>
						<p className="font-medium text-base md:text-base">
							Tặng ngay 10.000 đồng vào tài khoản chính của bạn và bạn bè của
							bạn
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
