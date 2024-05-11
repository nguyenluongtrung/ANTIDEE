import axios from 'axios';
import { useEffect, useState } from 'react';
import './WeatherForecastPage.css';
import { useForm } from 'react-hook-form';
import { formatDate, getCurrentTime } from '../../utils/format';
import { Spinner } from '../../components';
import toast from 'react-hot-toast';
import { errorStyle } from '../../utils/toast-customize';
export const WeatherForecastPage = () => {
	const [weatherStatus, setWeatherStatus] = useState();
	const [location, setLocation] = useState('danang');
	const [isToday, setIsToday] = useState(true);
	const [currentWeatherStatus, setCurrentWeatherStatus] = useState();
	const [isLoading, setIsLoading] = useState(true);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`;

	useEffect(() => {
		axios
			.get(url, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json;charset=UTF-8',
				},
			})
			.then(({ data }) => {
				setWeatherStatus(data);
				setIsLoading(false);
			})
			.catch((error) => {
				setIsLoading(false);
				toast.error("Không tìm thấy thành phố bạn cần", errorStyle);
			});
	}, [location]);

	useEffect(() => {
		const getCurrentHour = () => {
			const currentHour = new Date().getHours();
			setCurrentWeatherStatus(
				weatherStatus?.days[0]?.hours.find(
					(current) => parseInt(current.datetime.split(':')[0]) === currentHour
				)
			);
		};

		getCurrentHour();
	}, [weatherStatus]);

	const getIcon = (condition) => {
		if (condition === 'partly-cloudy-day') {
			return 'https://i.ibb.co/PZQXH8V/27.png';
		} else if (condition === 'partly-cloudy-night') {
			return 'https://i.ibb.co/Kzkk59k/15.png';
		} else if (condition === 'rain') {
			return 'https://i.ibb.co/kBd2NTS/39.png';
		} else if (condition === 'clear-day') {
			return 'https://i.ibb.co/rb4rrJL/26.png';
		} else if (condition === 'clear-night') {
			return 'https://i.ibb.co/1nxNGHL/10.png';
		} else {
			return 'https://i.ibb.co/rb4rrJL/26.png';
		}
	};

	const updateHumidityStatus = (humidity) => {
		if (humidity <= 30) {
			return 'Thấp';
		} else if (humidity <= 60) {
			return 'Bình thường';
		} else {
			return 'Cao';
		}
	};

	const updateAirQualityStatus = (airquality) => {
		if (airquality <= 50) {
			return 'Tốt';
		} else if (airquality <= 100) {
			return 'Khá tốt';
		} else if (airquality <= 150) {
			return 'Không lành mạnh';
		} else if (airquality <= 200) {
			return 'Không lành mạnh';
		} else if (airquality <= 250) {
			return 'Rất không lành mạnh';
		} else {
			return 'Độc hại';
		}
	};

	const measureUvIndex = (uvIndex) => {
		if (uvIndex <= 2) {
			return 'Thấp';
		} else if (uvIndex <= 5) {
			return 'Bình thường';
		} else if (uvIndex <= 7) {
			return 'Cao';
		} else {
			return 'Rất cao';
		}
	};

	const onSubmit = (data) => {
		setIsLoading(true);
		const newLocation = data.location;

		const newUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${newLocation}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`;

		setLocation(newLocation);
		axios
			.get(newUrl, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json;charset=UTF-8',
				},
			})
			.then(({ data }) => {
				setWeatherStatus(data);
				setIsLoading(false);
			});
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<div className="flex px-16">
			<div className="weather-sidebar">
				<div>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="search"
						id="search"
					>
						<input
							type="text"
							className="w-64 mr-3 rounded-sm"
							{...register('location')}
						/>
						<button
							type="submit"
							className="bg-primary text-white w-32 p-2 rounded-sm hover:bg-light hover:text-brown"
						>
							<span>Tìm kiếm</span>
						</button>
					</form>
					<div className="weather-icon flex justify-center">
						<img
							id="icon"
							src={getIcon(currentWeatherStatus?.icon)}
							className=""
						/>
					</div>
					<div className="temperature flex justify-center">
						<h1 id="temp" style={{ fontWeight: 'normal' }}>
							{Number(currentWeatherStatus?.temp).toFixed(0)}
						</h1>
						<span className="temp-unit">°C</span>
					</div>
					<div className="date-time flex justify-center">
						<p id="date-time">
							{formatDate(weatherStatus?.days[0]?.datetime)} {getCurrentTime()}
						</p>
					</div>
					<div className="flex justify-center">
						<p className="text-gray">{weatherStatus?.resolvedAddress}</p>
					</div>
				</div>
			</div>
			<div className="main">
				<nav>
					<ul className="options">
						<button className={`hourly`} onClick={() => setIsToday(true)}>
							<span className={`${isToday ? 'text-primary' : 'text-gray'}`}>
								Hôm nay
							</span>
						</button>
						<button className={`week w-56`} onClick={() => setIsToday(false)}>
							<span className={`${!isToday ? 'text-primary' : 'text-gray'}`}>
								Các ngày khác
							</span>
						</button>
					</ul>
				</nav>

				<div className="highlights">
					<h2 className="heading">
						{isToday ? 'Thời tiết hôm nay' : 'Thời tiết các ngày khác'}
					</h2>
					{isToday ? (
						<div className="cards">
							<div className="card2 hover:cursor-pointer hover:bg-light hover:text-brown">
								<h4 className="card-heading">Độ ẩm</h4>
								<div className="content">
									<p className="humidity">{currentWeatherStatus?.humidity} %</p>
									<p className="humidity-status">
										{updateHumidityStatus(currentWeatherStatus?.humidity)}
									</p>
								</div>
							</div>
							<div className="card2 hover:cursor-pointer hover:bg-light hover:text-brown">
								<h4 className="card-heading">Tốc độ gió</h4>
								<div className="content">
									<p className="wind-speed">
										{currentWeatherStatus?.windspeed}
									</p>
									<p>km/h</p>
								</div>
							</div>
							<div className="card2 hover:cursor-pointer hover:bg-light hover:text-brown">
								<h4 className="card-heading">Tầm nhìn</h4>
								<div className="content">
									<p className="sun-rise">{currentWeatherStatus?.visibility}</p>
									<p>km</p>
								</div>
							</div>
							<div className="card2 hover:cursor-pointer hover:bg-light hover:text-brown">
								<h4 className="card-heading">Chỉ số UV</h4>
								<div className="content">
									<p className="humidity">{currentWeatherStatus?.uvindex}</p>
									<p className="humidity-status">
										{measureUvIndex(currentWeatherStatus?.uvindex)}
									</p>
								</div>
							</div>
							<div className="card2 hover:cursor-pointer hover:bg-light hover:text-brown">
								<h4 className="card-heading">Chất lượng không khí</h4>
								<div className="content">
									<p className="visibilty">
										{Number(currentWeatherStatus?.winddir).toFixed(0)}
									</p>
									<p className="visibilty-status">
										{updateAirQualityStatus(currentWeatherStatus?.winddir)}
									</p>
								</div>
							</div>
							<div className="card2 hover:cursor-pointer hover:bg-light hover:text-brown">
								<h4 className="card-heading">Bình minh & Hoàng hôn</h4>
								<div className="content">
									<p className="air-quality">
										{weatherStatus?.days[0]?.sunrise}
									</p>
									<p className="air-quality-status">
										{weatherStatus?.days[0]?.sunset}
									</p>
								</div>
							</div>
						</div>
					) : (
						<div>
							<div className="cards">
								{[1, 2, 3, 4, 5, 6].map((index) => (
									<div
										className="card2 flex flex-col hover:cursor-pointer hover:bg-light hover:text-brown"
										key={index}
									>
										<h4 className="card-heading text-center">
											{formatDate(weatherStatus?.days[index]?.datetime)}
										</h4>
										<div className="content flex justify-center">
											<img
												id="icon"
												src={getIcon(weatherStatus?.days[index]?.icon)}
												className="w-20"
												style={{ marginTop: '-15px' }}
											/>
										</div>
										<div className="flex justify-center mt-auto mb-1.5">
											<p className="font-bold text-center">
												{Number(weatherStatus?.days[index]?.temp).toFixed(0)}
											</p>
											<span className="temp-unit ml-1">°C</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
