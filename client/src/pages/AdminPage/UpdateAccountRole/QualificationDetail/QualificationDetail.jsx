import { AiOutlineClose } from 'react-icons/ai';

export const QualificationDetail = ({
	setIsOpenDetailAccount,
    accountQualifications
}) => {
	const qualificationImg =
		'https://cdn-icons-png.freepik.com/512/7238/7238706.png';

	return (
		<div className="popup active">
			<div className="overlay"></div>

			<form className="content !w-[600px] max-h-[600px] rounded-md p-5" style={{ width: '35vw' }}>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => {
						setIsOpenDetailAccount(false);
					}}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					XEM CHI TIẾT CÁC CHỨNG CHỈ
				</p>
				<div className="flex justify-center mt-3">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:h-80 p-5 overflow-y-auto justify-items-center">
						{accountQualifications?.map(
							(qualification, index) => (
								<div key={index} className="flex flex-col items-center">
									<img
										src={qualificationImg}
										alt={qualification.qualificationId.name}
										className="mx-auto"
										style={{ width: '250px', height: '200px' }}
									/>
									<span className=" text-center mb-2">
										{qualification.qualificationId.name}
									</span>
								</div>
							)
						)}
					</div>
				</div>
			</form>
		</div>
	);
};
