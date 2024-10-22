import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch } from 'react-redux';
import { rankingServices } from '../../../../../features/services/serviceSlice';

const DonutChart = () => {
	const [chartData, setChartData] = useState([]);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			const response = await dispatch(rankingServices());
            let data = response.payload.categories.concat(response.payload.data)
            let result = []
            for(let i = 0; i< data.length; i++){
                if(i + 5 >= data.length)
                    break;
                result.push({
                    name: data[i],
                    value: data[i+5]
                })
            }
			setChartData(result);
		};

		fetchData();
	}, [dispatch]);

	const options = {
		chart: {
			type: 'donut',
		},
		labels: chartData.map((item) => item.name),
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: {
						width: 200,
					},
					legend: {
						position: 'bottom',
					},
				},
			},
		],
	};

	return (
		<div className="w-[30vw]">
			<p className="font-bold px-6 mb-3">Các dịch vụ hàng đầu</p>
			<ReactApexChart
				options={options}
				series={chartData.map((item) => item.value)}
				type="donut"
				height={300}
			/>
		</div>
	);
};

export default DonutChart;
