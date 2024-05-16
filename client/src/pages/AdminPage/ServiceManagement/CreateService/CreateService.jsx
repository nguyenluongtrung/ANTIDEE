import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createService } from '../../../../features/services/serviceSlice';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../../firebase';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './CreateService.css';
import { useEffect, useRef, useState } from 'react';
import { rules } from '../../../../utils/rules';
import { IoAddCircleOutline } from 'react-icons/io5';
import { getAllQualifications } from '../../../../features/qualifications/qualificationSlice';
export const CreateService = ({
	setIsOpenCreateService,
	handleGetAllServices,
}) => {
	const { qualifications, isLoading: qualificationLoading } = useSelector(
		(state) => state.qualifications
	);
	const fileRef = useRef(null);
	const [priceOptions, setPriceOptions] = useState([
		{
			optionList: [
				{
					optionName: '',
					optionValue: '',
				},
			],
			price: '',
		},
	]);
	const [file, setFile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [serviceUrl, setServiceUrl] = useState('');
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllQualifications());
	}, []);

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
	}, [file]);

	const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, `services/${fileName}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePerc(Math.round(progress));
			},
			(error) => {
				setFileUploadError(true);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
					setServiceUrl(downloadURL)
				);
			}
		);
	};

	const handleAddMoreRow = () => {
		if (priceOptions.some((option) => option.price !== '')) {
			const newPriceOption = {
				optionList: priceOptions.flatMap((option) => option.optionList),
				price: priceOptions.find((option) => option.price !== '')?.price || '',
			};
			setPriceOptions((prevOptions) => [...prevOptions, newPriceOption]);
			setPriceOptions((prevOptions) =>
				prevOptions.map((option) => ({
					optionList: option.optionList.map((item) => ({
						optionName: item.optionName,
						optionValue: item.optionValue,
					})),
					price: '',
				}))
			);
		}
	};

	const onSubmit = async (data) => {
		if (priceOptions.some((option) => option.price !== '')) {
			const newPriceOption = {
				optionList: priceOptions.flatMap((option) => option.optionList),
				price: priceOptions.find((option) => option.price !== '')?.price || '',
			};
			setPriceOptions((prevOptions) => [...prevOptions, newPriceOption]);
			setPriceOptions((prevOptions) =>
				prevOptions.map((option) => ({
					optionList: option.optionList.map((item) => ({
						optionName: item.optionName,
						optionValue: item.optionValue,
					})),
					price: '',
				}))
			);
		}

		const serviceData =
			serviceUrl !== ''
				? { ...data, image: serviceUrl, priceOptions }
				: {
						...data,
						image:
							'https://static8.depositphotos.com/1010338/959/i/450/depositphotos_9597931-stock-photo-team-gear-3d-isolated-characters.jpg',
						priceOptions,
				  };

		const result = await dispatch(createService(serviceData));
		if (result.type.endsWith('fulfilled')) {
			toast.success('Thêm dịch vụ thành công', successStyle);
		} else if (result?.error?.message === 'Rejected') {
			toast.error('Tên dịch vụ đã bị trùng', errorStyle);
		}
		setIsOpenCreateService(false);
		handleGetAllServices();
	};

	if (!Array.isArray(qualifications)) {
		return <Spinner />;
	}

	return (
		<div className="popup active ">
			<div className="overlay"></div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="content rounded-md p-5"
				style={{ width: '40vw' }}
			>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => setIsOpenCreateService(false)}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					TẠO DỊCH VỤ
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td className="py-1 ">
								<span className="font-bold">Tên dịch vụ</span>
							</td>
							<td className="ml-[30px] py-2">
								<input
									type="text"
									{...register('name', rules.name)}
									className={` ${
										errors.name && 'border-red'
									} create-question-input text-center ml-[60px] text-sm w-[380px]`}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Ảnh dịch vụ</span>
							</td>
							<td className="ml-[30px] py-2 grid justify-center">
								<img
									src={
										`${serviceUrl}` ||
										'https://static8.depositphotos.com/1010338/959/i/450/depositphotos_9597931-stock-photo-team-gear-3d-isolated-characters.jpg'
									}
									className="block w-16 mx-auto mb-1"
								/>
								<span
									className="rounded-md rounded-customized-gray p-1 mx-auto w-[130px] text-center hover:cursor-pointer"
									onClick={(e) => {
										e.preventDefault();
										fileRef.current.click();
									}}
								>
									<span>Chọn ảnh dịch vụ</span>
								</span>

								<input
									type="file"
									ref={fileRef}
									hidden
									onChange={(e) => setFile(e.target.files[0])}
								/>
								<p className="text-sm self-center pl-2">
									{fileUploadError ? (
										<span className="text-red">
											Tải ảnh lên thất bại (dung lượng ảnh phải nhỏ hơn 2MB)
										</span>
									) : filePerc > 0 && filePerc < 100 ? (
										<span className="text-gray">{`Đang tải lên ${filePerc}%`}</span>
									) : filePerc === 100 ? (
										<span className="text-green">Tải ảnh lên thành công!</span>
									) : (
										''
									)}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Chứng chỉ</span>
							</td>
							<td className="ml-[30px] py-2">
								<select
									{...register('requiredQualification')}
									className="create-exam-select hover:cursor-pointer text-center ml-[60px] text-sm w-[380px]"
								>
									{qualifications?.map((qualification) => (
										<option key={qualification._id} value={qualification._id}>
											{qualification.name}
										</option>
									))}
								</select>
							</td>
						</tr>
						{priceOptions.map((priceOption, index) => {
							return (
								<tr>
									<td>
										<span className="font-bold">Lựa chọn {index + 1}</span>
									</td>
									<td className="ml-[30px] py-2">
										<table>
											<tbody>
												{priceOption.optionList.map((option, optionIndex) => (
													<tr className="flex mb-2.5" key={optionIndex}>
														<td className="pl-[60px] mr-5">
															<input
																type="text"
																className="create-question-input text-center text-sm w-44 mr-2"
																value={option.optionName}
																onChange={(e) => {
																	setPriceOptions((prevOptions) => {
																		const updatedOptions = [...prevOptions];
																		updatedOptions[index].optionList[
																			optionIndex
																		].optionName = e.target.value;
																		return updatedOptions;
																	});
																}}
															/>
														</td>
														<td className="flex">
															<input
																type="text"
																className="create-question-input text-center text-sm w-44 mr-2"
																value={option.optionValue}
																onChange={(e) => {
																	setPriceOptions((prevOptions) => {
																		const updatedOptions = [...prevOptions];
																		updatedOptions[index].optionList[
																			optionIndex
																		].optionValue = e.target.value;
																		return updatedOptions;
																	});
																}}
															/>
															{optionIndex === priceOption.optionList?.length - 1 && (
																<IoAddCircleOutline
																	className="hover:cursor-pointer"
																	onClick={() => {
																		setPriceOptions((prevOptions) => {
																			const updatedOptions = [...prevOptions];
																			updatedOptions[index].optionList[
																				optionIndex + 1
																			] = {};
																			return updatedOptions;
																		});
																	}}
																/>
															)}
														</td>
													</tr>
												))}
												<tr className="flex mb-2.5">
													<td className="pl-[60px] mr-5">
														<input
															type="text"
															className="create-question-input text-center text-sm w-44 mr-2 font-bold text-brown"
															value={'Giá'}
														/>
													</td>
													<td>
														<input
															type="text"
															className="create-question-input text-center text-sm w-44 mr-2"
															value={priceOption.price}
															onChange={(e) => {
																setPriceOptions((prevOptions) => {
																	const updatedOptions = [...prevOptions];
																	updatedOptions[index].price = e.target.value;
																	return updatedOptions;
																});
															}}
														/>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							);
						})}
						<tr>
							<td></td>
							<td className="ml-[60px] py-2">
								<div
									className="hover:cursor-pointer flex justify-center pl-10 hover:text-primary"
									onClick={handleAddMoreRow}
								>
									<span className="text-gray italic ">Thêm lựa chọn</span>
									<IoAddCircleOutline className="ml-3 text-gray" />
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Mô tả</span>
							</td>
							<td className="ml-[30px] py-2">
								<input
									type="text"
									{...register('description')}
									className="create-exam-select text-center ml-[60px] text-sm w-[380px]"
								/>
							</td>
						</tr>
					</tbody>
				</table>
				<button
					type="submit"
					className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
				>
					Tạo dịch vụ
				</button>
			</form>
		</div>
	);
};
