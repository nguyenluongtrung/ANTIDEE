import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const AreaChart = () => {
	const [chartOptions, setChartOptions] = useState({
		chart: {
			type: 'area',
			height: 350,
			zoom: {
				enabled: false,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: 'straight',
		},
		xaxis: {
			categories: [
				'T1',
				'T2',
				'T3',
				'T4',
				'T5',
				'T6',
				'T7',
				'T8',
				'T9',
				'T10',
				'T11',
				'T12',
			],
		},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.7,
				opacityTo: 0.9,
				stops: [0, 100],
			},
		},
	});

	const [chartSeries, setChartSeries] = useState([
		{
			name: 'Doanh thu',
			data: [31, 40, 28, 51, 42, 109, 100, 80, 95, 88, 62, 72],
		},
	]);

	return (
		<div id="chart">
			<p className="font-bold px-6 mb-3">Doanh thu theo tháng</p>
			<ReactApexChart
				options={chartOptions}
				series={chartSeries}
				type="area"
				height={350}
			/>
		</div>
	);
};

export default AreaChart;
