import clear_icon from '../../assets/img/clear.png';
import cloud_icon from '../../assets/img/cloud.png';
import drizzle_icon from '../../assets/img/drizzle.png';
import humidity_icon from '../../assets/img/humidity.png';
import rain_icon from '../../assets/img/rain.png';
import snow_icon from '../../assets/img/snow.png';
import wind_icon from '../../assets/img/wind.png';
import axios from 'axios';
import { WEATHER_API_KEY } from '../../constants/constants';
import { useState } from 'react';
import './WeatherForecastPage.css';

export const WeatherForecastPage = () => {
	const [location, setLocation] = useState('');
	const [currentWeatherStatus, setCurrentWeatherStatus] = useState();

	const url = `https://api.openweathermap.org/data/2.5/weather?q=Danang&appid=${WEATHER_API_KEY}`;
	axios
		.get(url, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
		})
		.then(({ data }) => {
			setCurrentWeatherStatus(data)
		});

	return (
		<div className="weather-component">
			<div>
				<div>
					<div className='mb-5'>
						<span className='mr-3'>Thành phố cần tìm</span>
						<input type="text" className='location-input'/>
					</div>
					<p className="text-gray">5:05 PM, Thứ hai, ngày 23, tháng 11, 2020</p>
					<div className='flex'>
						<img src={cloud_icon} className='w-40'/>
						<p className='text-4xl font-bold'>{Number((currentWeatherStatus?.main?.temp - 32) * 5/9).toFixed(1)} &deg;C</p>
					</div>
					<p className="text-xl text-center">{currentWeatherStatus?.weather[0]?.main}</p>
					<div className="flex flex-col justify-center">
						<div>
							<p className="text-gray">Độ ẩm</p>
							<p>{currentWeatherStatus?.main?.humidity}%</p>
						</div>
						<div>
							<p className="text-gray">Tốc độ gió</p>
							<p>{currentWeatherStatus?.wind?.speed} km/h</p>
						</div>
					</div>
				</div>
			</div>
			<div></div>
		</div>
	);
};
