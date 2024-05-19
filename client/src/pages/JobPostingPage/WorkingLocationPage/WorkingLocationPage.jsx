import { useNavigate, useParams } from 'react-router-dom';
import { StepBar } from '../components/StepBar/StepBar';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Spinner } from '../../../components';
import { errorStyle } from '../../../utils/toast-customize';
import toast from 'react-hot-toast';

export const WorkingLocationPage = () => {
	const { serviceId } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [houseType, setHouseType] = useState('');
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [cities, setCities] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [wards, setWards] = useState([]);
	const [cityCode, setCityCode] = useState(92);
	const [districtCode, setDistrictCode] = useState(916);
	const [wardCode, setWardCode] = useState(31150);

	const cityUrl = 'https://api.mysupership.vn/v1/partner/areas/province';
	const districtUrl =
		`https://api.mysupership.vn/v1/partner/areas/district?province=${cityCode}`;
	const wardUrl =
		`https://api.mysupership.vn/v1/partner/areas/commune?district=${districtCode}`;

	useEffect(() => {
		axios
			.get(cityUrl, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json;charset=UTF-8',
				},
			})
			.then(({ data }) => {
				setCities(data.results);
				setIsLoading(false);
			})
	}, []);

	useEffect(() => {
		axios
			.get(districtUrl, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json;charset=UTF-8',
				},
			})
			.then(({ data }) => {
				setDistricts(data.results);
				setIsLoading(false);
			})
	}, [cityCode]);

	useEffect(() => {
		axios
			.get(wardUrl, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json;charset=UTF-8',
				},
			})
			.then(({ data }) => {
				setWards(data.results);
				setIsLoading(false);
			})
	}, [districtCode]);

	const onSubmit = (data) => {
		if (!houseType.trim()) {
			toast.error('Vui lòng chọn "Loại nhà"', errorStyle);
			return;
		} 
		if (!data.street.trim()) {
			toast.error('Vui lòng điền "Số nhà, đường"', errorStyle);
			return;
		} 
		const detailWard = wards.find((ward) => String(ward.code) === String(wardCode));
		const address = {
			...data,
			houseType,
			province: detailWard.province,
			district: detailWard.district,
			ward: detailWard.name
		};
		navigate(`/job-posting/details/${serviceId}`, { state: { address } });
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<div className="w-full px-20">
			<StepBar serviceId={serviceId}/>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="location-form m-auto" style={{ width: '530px' }}>
					<div>
						<p className="font-bold">Tỉnh / thành phố</p>
						<select
							className="p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none"
							style={{ width: '100%' }}
							onChange={(e) => setCityCode(e.target.value)}
						>
							{cities?.map((city) => <option value={city.code}>{city.name}</option>)}
						</select>
					</div>
					<div>
						<p className="font-bold">Quận / huyện</p>
						<select
							className="p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none"
							style={{ width: '100%' }}
							onChange={(e) => setDistrictCode(e.target.value)}
						>
							{districts?.map((district) => <option value={district.code}>{district.name}</option>)}
						</select>
					</div>
					<div>
						<p className="font-bold">Phường / xã</p>
						<select
							className="p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none"
							style={{ width: '100%' }}
							onChange={(e) => setWardCode(e.target.value)}
						>
							{wards?.map((ward) => <option value={ward.code}>{ward.name}</option>)}
						</select>
					</div>
					<div>
						<p className="font-bold">Số nhà, đường</p>
						<input
							type="text"
							{...register('street')}
							className="p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none"
						/>
					</div>
					<div className="">
						<p className="font-bold">Loại nhà</p>
						<input
							type="text"
							value={'Nhà / nhà phố'}
							onClick={(e) => setHouseType(e.target.value)}
							className={`p-2 my-4 border-2 rounded-md hover:outline-none focus:outline-none hover:cursor-pointer ${
								houseType === 'Nhà / nhà phố'
									? 'text-primary border-primary'
									: 'border-light_gray'
							}`}
						/>
						<input
							type="text"
							value={'Căn hộ'}
							onClick={(e) => setHouseType(e.target.value)}
							className={`p-2 my-4  border-2 rounded-md hover:outline-none focus:outline-none hover:cursor-pointer ${
								houseType === 'Căn hộ'
									? 'text-primary border-primary'
									: 'border-light_gray'
							}`}
						/>
						<input
							type="text"
							value={'Biệt thự'}
							onClick={(e) => setHouseType(e.target.value)}
							className={`p-2 my-4 border-2 rounded-md hover:outline-none focus:outline-none hover:cursor-pointer ${
								houseType === 'Biệt thự'
									? 'text-primary border-primary'
									: 'border-light_gray'
							}`}
						/>
					</div>
					<p className="italic text-gray">
						*Vui lòng chọn loại nhà, số nhà phù hợp để người giúp việc dễ dàng
						tìm kiếm
					</p>
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
