import React from 'react';
import img31 from '../../assets/img/image 31.png';
export const CongratsPage = () => {
	return (
		<div>
			<img className="m-auto" src={img31} />
			<h1 className=" grid text-green font-bold text-2xl justify-center pb-3">
				CHÚC MỪNG!
			</h1>
			<span className="grid justify-center text-sm font-medium text-gray pb-3">
				Bạn đã chính thức trờ thành người giúp việc chuyên nghiệp
			</span>

			<div className="grid justify-center p-3">
				<button className="bg-primary text-white w-max py-2 px-24 rounded-full">
					Khám phá những tính năng của người giúp việc
				</button>
			</div>
		</div>
	);
};
