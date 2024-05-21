import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { StepBar } from '../components/StepBar/StepBar';
import { useForm } from 'react-hook-form';
import { formatDateInput } from '../../../utils/format';
import { Switch } from '@headlessui/react';
import { Spinner } from '../../../components';
import { getAllServices } from '../../../features/services/serviceSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { errorStyle } from '../../../utils/toast-customize';

export const DetailOptionPage = () => {
	const { serviceId } = useParams();
	const { services, isLoading: serviceLoading } = useSelector(
		(state) => state.services
	);
	const [chosenService, setChosenService] = useState(null);
	const [totalPrice, setTotalPrice] = useState(0);
	const [inputOptions, setInputOptions] = useState([
		{
			optionName: '',
			optionValue: '',
			optionIndex: '',
		},
	]);
	const [startingHour, setStartingHour] = useState('');
	const [hasChangedPrice, setHasChangedPrice] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		const asyncFn = async () => {
			const result = await dispatch(getAllServices());
			const chosenService = result.payload.find(
				(service) => String(service._id) === String(serviceId)
			);
			setChosenService(chosenService);
		};
		asyncFn();
	}, []);

	useEffect(() => {
		const asyncFn = async () => {
			const newInputOptions = chosenService?.priceOptions?.flatMap((option) => {
				if (option?.optionList.some((opt) => opt?.optionValue === '')) {
					return [
						{
							optionName: option.optionName,
							optionValue: '',
							optionIndex: '',
						},
					];
				}
				if (option?.optionList.some((opt) => /[^0-9]/.test(opt?.optionValue))) {
					return option.optionList.map((opt) => ({
						optionName: opt?.optionValue,
						optionValue: '',
						optionIndex: '',
					}));
				} else {
					return [
						{
							optionName: option.optionName,
							optionValue: '',
							optionIndex: '',
						},
					];
				}
			}) || [{ optionName: '', optionValue: '', optionIndex: '' }];

			setInputOptions(newInputOptions);
		};
		asyncFn();
	}, [chosenService]);

	useEffect(() => {
		if (inputOptions.some((option) => option.optionValue.trim() === '')) {
			return;
		}

		let formula;
		if (chosenService?.priceFormula?.length == 1) {
			formula = chosenService?.priceFormula[0]?.formula || '';
		} else {
			let condition = '';
			for (let i = 0; i < chosenService?.priceFormula.length; i++) {
				const singleFormula = chosenService?.priceFormula[i];
				condition = singleFormula?.condition?.replaceAll('=', '==');
				for (let j = 0; j < inputOptions.length; j++) {
					const option = inputOptions[j];
					if (condition.includes(option.optionName)) {
						condition = condition.replaceAll(
							`[${option.optionName}]`,
							option.optionValue
						);
					}
				}
				if (eval(condition)) {
					formula = singleFormula?.formula;
					break;
				}
			}
		}

		inputOptions.forEach((option) => {
			const regex = new RegExp(
				`\\[${option.optionName}\\](?:\\[(.*?)\\])?`,
				'g'
			);
			formula = formula?.replace(regex, (match, p1) => {
				if (p1 === 'hệ số') {
					return option.optionIndex;
				} else {
					return option.optionValue;
				}
			});
		});

		let result;
		result = eval(formula);
		try {
			result = eval(formula);
		} catch (error) {
			console.error('Error evaluating formula:', error);
			return;
		}

		if (startingHour) {
			if (
				startingHour < '08:00:00' ||
				(startingHour > '17:00:00' && !hasChangedPrice)
			) {
				result = Math.round(result * 1.1);
				setHasChangedPrice(true);
			} else if (
				startingHour >= '08:00:00' &&
				startingHour <= '17:00:00' &&
				hasChangedPrice
			) {
				result = Math.round(result / 1.1);
				setHasChangedPrice(true);
			}
		}
		setTotalPrice(result);
	}, [inputOptions, chosenService?.priceFormula]);

	useEffect(() => {
		if (startingHour) {
			if (
				(startingHour < '08:00:00' || startingHour > '17:00:00') &&
				!hasChangedPrice
			) {
				setTotalPrice(Math.round(totalPrice * 1.1));
				setHasChangedPrice(true);
			} else if (
				startingHour >= '08:00:00' &&
				startingHour <= '17:00:00' &&
				hasChangedPrice
			) {
				setTotalPrice(Math.round(totalPrice / 1.1));
				setHasChangedPrice(false);
			}
		}
	}, [startingHour]);

	const handleTimeChange = (e) => {
		const { value } = e.target;
		const min = '06:00:00';
		const max = '21:00:00';

		if (value < min || value > max) {
			toast.error('Vui lòng chọn giờ làm việc từ 6h đến 21h', errorStyle);
		} else {
			setStartingHour(value);
		}
	};

	const handleOpenTimeNote = () => {
		toast.custom((t) => (
			<div
				className={`bg-info text-white px-6 py-4 shadow-md rounded-full ${
					t.visible ? 'animate-enter' : 'animate-leave'
				}`}
			>
				Giá dịch vụ tăng 10% vào giờ cao điểm (trước 8h và sau 17h).
			</div>
		));
	};

	const handleOpenPriceNote = (note) => {
		toast.custom((t) => (
			<div
				className={`bg-info text-white px-6 py-4 shadow-md rounded-full ${
					t.visible ? 'animate-enter' : 'animate-leave'
				}`}
			>
				{note}
			</div>
		));
	};

	const onSubmit = (data) => {
		console.log(inputOptions);
		navigate(`/job-posting/time-contact/${serviceId}`, {
			state: {
				address: location.state.address,
				otherInfo: { totalPrice },
				workingTime: {
					startingDate: data.startingDate,
					startingHour: startingHour,
				},
				inputOptions,
			},
		});
	};

	if (serviceLoading) {
		return <Spinner />;
	}

	return (
		<div className="w-full px-20">
			<StepBar serviceId={serviceId} />
			<form onSubmit={handleSubmit(onSubmit)}>
				<div
					className="mx-auto shadow-xl py-10 px-10 hover:shadow-2xl hover:cursor-pointer"
					style={{ width: '700px' }}
				>
					<div>
						<p className="font-extrabold mb-5">LỰA CHỌN CHI TIẾT</p>
						<table>
							<tbody>
								{chosenService?.priceOptions?.map((option, index) => {
									return (
										<tr>
											<td>
												<p className="mr-3 mb-8">{option?.optionName}</p>
											</td>
											<td className="pl-32">
												{option?.optionList?.some(
													(opt) => opt?.optionValue === ''
												) ? (
													<input
														type="text"
														className="border-b-2 border-light_gray w-72 focus:outline-none text-center"
														onChange={(e) => {
															setInputOptions((prevInputOptions) => {
																const updatedInputOptions = [
																	...prevInputOptions,
																];
																const chosenIndex =
																	updatedInputOptions.findIndex(
																		(opt) =>
																			String(opt.optionName) ===
																			String(option?.optionName)
																	);
																updatedInputOptions[chosenIndex] = {
																	...updatedInputOptions[chosenIndex],
																	optionValue: e.target.value,
																};
																return updatedInputOptions;
															});
														}}
													/>
												) : option?.optionList?.find((op) =>
														/[^0-9]/.test(op?.optionValue)
												  ) ? (
													<>
														<table>
															<tbody>
																{option?.optionList?.map((op1, op1Index) => (
																	<tr className="flex">
																		<td>
																			<p
																				className="w-28"
																				style={{ marginTop: 'auto' }}
																			>
																				{op1?.optionValue}
																			</p>
																		</td>
																		<td>
																			<input
																				type="text"
																				className="ml-3 border-b-2 border-light_gray w-32 focus:outline-none text-center"
																				onChange={(e) => {
																					setInputOptions(
																						(prevInputOptions) => {
																							const updatedInputOptions = [
																								...prevInputOptions,
																							];
																							const chosenIndex =
																								updatedInputOptions.findIndex(
																									(opt) =>
																										String(opt.optionName) ===
																										String(op1?.optionValue)
																								);
																							updatedInputOptions[chosenIndex] =
																								{
																									...updatedInputOptions[
																										chosenIndex
																									],
																									optionValue: e.target.value,
																								};
																							return updatedInputOptions;
																						}
																					);
																				}}
																			/>
																		</td>
																	</tr>
																))}
															</tbody>
														</table>
													</>
												) : (
													<select
														className="border-2 rounded-md w-72 p-2 border-light_gray text-center focus:outline-none"
														onChange={(e) => {
															const input = e.target.value;
															const inputValue = input.split('-')[0];
															const inputIndex = input.split('-')[1];
															setInputOptions((prevInputOptions) => {
																const updatedInputOptions = [
																	...prevInputOptions,
																];
																const chosenIndex =
																	updatedInputOptions.findIndex(
																		(opt) =>
																			String(opt.optionName) ===
																			String(option?.optionName)
																	);
																updatedInputOptions[chosenIndex] = {
																	...updatedInputOptions[chosenIndex],
																	optionValue: inputValue,
																	optionIndex: isNaN(inputIndex)
																		? ''
																		: inputIndex,
																};
																return updatedInputOptions;
															});
														}}
													>
														<option value="" disabled selected>
															Lựa chọn của bạn
														</option>
														{option?.optionList?.map((op, opIndex) => (
															<option
																key={opIndex}
																value={`${op?.optionValue}-${op?.optionIndex}`}
															>
																{op?.optionValue}{' '}
																{op?.optionIndex &&
																	String(op?.optionIndex).trim() &&
																	`- ${op?.optionIndex}`}
															</option>
														))}
													</select>
												)}
											</td>
										</tr>
									);
								})}

								<tr>
									<td>
										<p className="mr-3 mb-8">Chọn ngày làm</p>
									</td>
									<td className="pl-32">
										<input
											type="date"
											{...register('startingDate')}
											min={new Date().toISOString().split('T')[0]}
											defaultValue={formatDateInput(new Date())}
											className="border-2 rounded-md w-72 p-1.5 border-light_gray text-center focus:outline-none hover:cursor-pointer"
										/>
									</td>
								</tr>
								<tr>
									<td>
										<p className="mr-3 mb-6">
											Chọn giờ làm{' '}
											<span
												className="italic text-gray underline hover:text-primary"
												onClick={handleOpenTimeNote}
											>
												(Xem lưu ý)
											</span>
										</p>
									</td>
									<td className="pl-32">
										<input
											type="time"
											{...register('startingHour')}
											onChange={handleTimeChange}
											step="60"
											className="focus:outline-none hover:cursor-pointer"
										/>
									</td>
								</tr>
								<tr>
									<td>
										<p className="mr-3 mb-6 mt-3">
											Ưu tiên người làm yêu thích
										</p>
									</td>
									<td className="pl-32">
										{' '}
										<Switch className="group inline-flex h-6 w-11 items-center rounded-full bg-primary transition data-[checked]:bg-green">
											<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
										</Switch>
									</td>
								</tr>
								<tr>
									<td>
										<p className="mr-3 mb-6 mt-3">Bạn tự chọn người làm</p>
									</td>
									<td className="pl-32">
										<Switch className="group inline-flex h-6 w-11 items-center rounded-full bg-primary transition data-[checked]:bg-green">
											<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
										</Switch>
									</td>
								</tr>
								<tr>
									<td>
										{' '}
										<p className="mr-3 mb-6 mt-3">Đăng việc lặp lại</p>
									</td>
									<td className="pl-32">
										{' '}
										<Switch className="group inline-flex h-6 w-11 items-center rounded-full bg-primary transition data-[checked]:bg-green">
											<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
										</Switch>
									</td>
								</tr>
								<tr>
									<td>
										<p className="mr-3 mb-2 mt-3">Cần gấp</p>
									</td>
									<td className="pl-32">
										<Switch className="group inline-flex h-6 w-11 items-center rounded-full bg-primary transition data-[checked]:bg-green">
											<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
										</Switch>
									</td>
								</tr>
								<tr>
									<td>
										<p className="mr-3">Nhập mã khuyến mãi</p>
									</td>
									<td className="pl-32">
										<input
											type="text"
											className="border-2 rounded-md w-72 p-1.5 border-light_gray text-center focus:outline-none mb-5"
										/>
									</td>
								</tr>
								<tr className="border-light_gray border-t-2">
									<td>
										<div className="flex">
											<p className="font-extrabold text-lg mt-5">GIÁ TIỀN</p>
											<span
												className="italic mt-6 ml-3 text-gray underline hover:text-primary"
												onClick={() => handleOpenPriceNote(chosenService?.note)}
											>
												(Xem lưu ý)
											</span>
										</div>
									</td>
									<td className="pl-32">
										<p className="font-extrabold text-green text-lg mt-5">
											{totalPrice} VND
										</p>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div className="flex items-center justify-center">
					<button
						className="mt-10 w-[500px] py-3 bg-primary rounded-full text-white hover:opacity-70"
						type="submit"
					>
						Tiếp theo
					</button>
				</div>
			</form>
		</div>
	);
};
