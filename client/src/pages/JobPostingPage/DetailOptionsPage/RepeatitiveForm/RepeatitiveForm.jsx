import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

export const RepeatitiveForm = ({
	setIsOpenRepeatitiveForm,
	setIsRepeatitive,
	setTimes,
}) => {
	const [every, setEvery] = useState(0);
	const [option, setOption] = useState('day');
	const [endDate, setEndDate] = useState('');
	const handleSubmit = () => {
		let end = new Date(endDate);
		let start = new Date();

		let difference_In_Time = end.getTime() - start.getTime();

		let difference_In_Days = Math.round(
			difference_In_Time / (1000 * 3600 * 24)
		);
		
		setTimes(5);
		setIsOpenRepeatitiveForm(false);
	};

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<div className="content login-container m-auto rounded-xl">
				<form onSubmit={handleSubmit}>
					<AiOutlineClose
						className="absolute text-sm hover:cursor-pointer"
						onClick={() => {
							setIsOpenRepeatitiveForm(false);
							setIsRepeatitive(false);
						}}
					/>
					<p className="text-center font-bold text-md mb-3">
						Tùy chỉnh lịch lặp lại
					</p>
					<div className="mb-3 text-gray">
						<span>Lặp lại mỗi</span>{' '}
						<input
							type="text"
							className="w-10 py-1 ml-3 mr-2 focus:outline-none"
							name="every"
							onChange={(e) => setEvery(e.target.value)}
							min={1}
							max={30}
							style={{
								borderBottom: '1px solid black',
								marginTop: '-20px',
								textAlign: 'center',
							}}
						/>{' '}
						<select
							className="focus:outline-none"
							name="option"
							onChange={(e) => setOption(e.target.value)}
						>
							<option value={'day'}>
								<span className="text-xs">ngày</span>
							</option>
							<option value={'week'}>
								<span className="text-xs">tuần</span>
							</option>
							<option value={'month'}>
								<span className="text-xs">tháng</span>
							</option>
						</select>
					</div>
					<div className="mb-3 text-gray flex">
						<p className="mr-3">Kết thúc vào:</p>{' '}
						<input
							type="date"
							name="endDate"
							onChange={(e) => setEndDate(e.target.value)}
							className="focus:outline-none text-sm"
							style={{ width: '35%', marginTop: '-2px', marginRight: '5px' }}
						/>
					</div>
					<p className="italic">(Gói dịch vụ bao gồm 0 lần thực hiện)</p>
					<div className="flex w-36 ml-48">
						<button
							className="text-gray py-1 mr-2"
							onClick={() => {
								setIsRepeatitive(false);
								setIsOpenRepeatitiveForm(false);
							}}
						>
							<span>Hủy</span>
						</button>
						<button className="text-primary" type="submit">
							<span>Xác nhận</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
