import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

export const RepeatitiveForm = ({
	setFinalTimes,
	times,
	setIsOpenRepeatitiveForm,
	setIsRepeatitive,
	setTimes,
}) => {
	const [every, setEvery] = useState(0);
	const [option, setOption] = useState('day');
	const [endDate, setEndDate] = useState('');
	const [chosenDays, setChosenDays] = useState([]);

	useEffect(() => {
		if (every && option && endDate) {
			let end = new Date(endDate);
			let start = new Date();

			let difference_In_Time = end.getTime() - start.getTime();

			let difference_In_Days = Math.round(
				difference_In_Time / (1000 * 3600 * 24)
			);

			if (option === 'day') {
				setTimes(Math.floor(difference_In_Days / every));
			} else if (option === 'week') {
				setTimes(Math.floor(difference_In_Days / (every * chosenDays.length)));
			} else if (option === 'month') {
				setTimes(Math.floor(difference_In_Days / (every * 30)));
			}
		}
	}, [every, option, endDate]);

	const handleSubmit = () => {
		setFinalTimes(times)
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
					{option === 'week' && (
						<div className="mb-3 text-gray flex">
							<p className="mr-3">Lặp lại vào:</p>{' '}
							<div>
								<span
									className={`mr-1 rounded-full text-xs p-1.5 opacity-70 hover:cursor-pointer ${
										chosenDays.find((day) => day === 'Thứ 2')
											? 'bg-yellow text-brown'
											: 'bg-light_gray '
									}`}
									onClick={() => {
										const newChosenDays = chosenDays.filter(
											(day) => day !== 'Thứ 2'
										);
										if (newChosenDays.length !== chosenDays.length) {
											setChosenDays(newChosenDays);
										} else {
											setChosenDays([...chosenDays, 'Thứ 2']);
										}
									}}
								>
									T2
								</span>
								<span
									className={`mr-1 rounded-full text-xs p-1.5 opacity-70 hover:cursor-pointer ${
										chosenDays.find((day) => day === 'Thứ 3')
											? 'bg-yellow text-brown'
											: 'bg-light_gray '
									}`}
									onClick={() => {
										const newChosenDays = chosenDays.filter(
											(day) => day !== 'Thứ 3'
										);
										if (newChosenDays.length !== chosenDays.length) {
											setChosenDays(newChosenDays);
										} else {
											setChosenDays([...chosenDays, 'Thứ 3']);
										}
									}}
								>
									T3
								</span>
								<span
									className={`mr-1 rounded-full text-xs p-1.5 opacity-70 hover:cursor-pointer ${
										chosenDays.find((day) => day === 'Thứ 4')
											? 'bg-yellow text-brown'
											: 'bg-light_gray '
									}`}
									onClick={() => {
										const newChosenDays = chosenDays.filter(
											(day) => day !== 'Thứ 4'
										);
										if (newChosenDays.length !== chosenDays.length) {
											setChosenDays(newChosenDays);
										} else {
											setChosenDays([...chosenDays, 'Thứ 4']);
										}
									}}
								>
									T4
								</span>
								<span
									className={`mr-1 rounded-full text-xs p-1.5 opacity-70 hover:cursor-pointer ${
										chosenDays.find((day) => day === 'Thứ 5')
											? 'bg-yellow text-brown'
											: 'bg-light_gray '
									}`}
									onClick={() => {
										const newChosenDays = chosenDays.filter(
											(day) => day !== 'Thứ 5'
										);
										if (newChosenDays.length !== chosenDays.length) {
											setChosenDays(newChosenDays);
										} else {
											setChosenDays([...chosenDays, 'Thứ 5']);
										}
									}}
								>
									T5
								</span>
								<span
									className={`mr-1 rounded-full text-xs p-1.5 opacity-70 hover:cursor-pointer ${
										chosenDays.find((day) => day === 'Thứ 6')
											? 'bg-yellow text-brown'
											: 'bg-light_gray '
									}`}
									onClick={() => {
										const newChosenDays = chosenDays.filter(
											(day) => day !== 'Thứ 6'
										);
										if (newChosenDays.length !== chosenDays.length) {
											setChosenDays(newChosenDays);
										} else {
											setChosenDays([...chosenDays, 'Thứ 6']);
										}
									}}
								>
									T6
								</span>
								<span
									className={`mr-1 rounded-full text-xs p-1.5 opacity-70 hover:cursor-pointer ${
										chosenDays.find((day) => day === 'Thứ 7')
											? 'bg-yellow text-brown'
											: 'bg-light_gray '
									}`}
									onClick={() => {
										const newChosenDays = chosenDays.filter(
											(day) => day !== 'Thứ 7'
										);
										if (newChosenDays.length !== chosenDays.length) {
											setChosenDays(newChosenDays);
										} else {
											setChosenDays([...chosenDays, 'Thứ 7']);
										}
									}}
								>
									T7
								</span>
								<span
									className={`mr-1 rounded-full text-xs p-1.5 opacity-70 hover:cursor-pointer ${
										chosenDays.find((day) => day === 'Chủ nhật')
											? 'bg-yellow text-brown'
											: 'bg-light_gray '
									}`}
									onClick={() => {
										const newChosenDays = chosenDays.filter(
											(day) => day !== 'Chủ nhật'
										);
										if (newChosenDays.length !== chosenDays.length) {
											setChosenDays(newChosenDays);
										} else {
											setChosenDays([...chosenDays, 'Chủ nhật']);
										}
									}}
								>
									CN
								</span>
							</div>
						</div>
					)}
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
					<p className="italic">(Gói dịch vụ bao gồm {times} lần thực hiện)</p>
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
