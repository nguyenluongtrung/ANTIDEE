import React from 'react';
import img31 from '../../assets/img/image 31.png';
import { useLocation, useNavigate } from 'react-router-dom';

export const CongratsPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const congratsMsg = location?.state?.congratsMsg;
	const buttonContent = location?.state?.buttonContent;
	const navigateTo = location?.state?.navigateTo;

	return (
		<div className='select-none'>
			<img className="m-auto" src={img31} />
			<h1 className=" grid text-green font-bold text-2xl justify-center pb-3">
				CHÚC MỪNG!
			</h1>
			<span className="grid justify-center text-sm font-medium text-gray pb-3">
				{congratsMsg}
			</span>

			<div className="grid justify-center p-3">
				<button className="bg-primary text-white w-max py-2 px-24 rounded-full" onClick={() => navigate(navigateTo)}>
					{buttonContent}
				</button>
			</div>

		</div>

	);
};
