import React from 'react';

export const ConfirmModal = ({ confirmMsg, setAgree }) => {
	return (
		<div className="popup active">
			<div className="overlay"></div>
			<div className="content login-container m-auto rounded-xl">
				<h2>Bạn có chắn chắn không?</h2>
				<p>{confirmMsg}</p>
				<div className="flex justify-between">
					<button
						className="flex items-center justify-center p-3 bg-primary rounded-lg w-[220px] text-center text-white font-bold cursor-pointer fea-item hover:bg-primary_dark"
						onClick={() => setAgree(false)}
					>
						Hủy
						<FaAngleRight size={30} className="" />
					</button>
					<button
						className="flex items-center justify-center p-3 bg-primary rounded-lg w-[220px] text-center text-white font-bold cursor-pointer fea-item hover:bg-primary_dark"
						onClick={() => setAgree(true)}
					>
						Chắc chắn
						<FaAngleRight size={30} className="" />
					</button>
				</div>
			</div>
		</div>
	);
};
