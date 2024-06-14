import { AiOutlineClose } from 'react-icons/ai';

export const ScoreNotification = ({
	setIsOpenScoreNotification,
	totalScore,
	totalQuestions,
	passGrade,
}) => {
	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form className="content rounded-md p-5 " style={{ width: '35vw' }}>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => {
						setIsOpenScoreNotification(true);
					}}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					KẾT QUẢ THI
				</p>
				{totalScore >= passGrade ? (
					<div>
						<img
							src="image/medal.png"
							className="block w-48 mx-auto my-3"
						/>
						<p className="text-center font-medium">
							Chúc mừng bạn đã vượt qua bài kiểm tra với số điểm {totalScore} /{' '}
							{totalQuestions}
						</p>
					</div>
				) : (
					<div>
						<img src="/image/fail.png" className="block w-48 mx-auto my-3"/>
						<p className="text-center font-medium">
							Đáng tiếc bạn đã không vượt qua bài kiểm tra với số điểm {totalScore} /{' '}
							{totalQuestions}
						</p>
					</div>
				)}
			</form>
		</div>
	);
};
