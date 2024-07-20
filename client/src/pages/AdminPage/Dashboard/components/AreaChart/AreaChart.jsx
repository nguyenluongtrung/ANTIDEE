import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getRevenueByMonths } from '../../../../../features/jobPosts/jobPostsSlice';
import { useDispatch } from 'react-redux';

const AreaChart = () => {
	const [months, setMonths] = useState();
	const [revenues, setRevenues] = useState();

	const dispatch = useDispatch()

	useEffect(() => {
		const fetchData = async () => {
			const result = await dispatch(getRevenueByMonths());
			console.log(result.payload)
			setMonths(result.payload.months);
			setRevenues(result.payload.revenues);
		};
		fetchData();
	}, []);

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
			categories: [],
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
			data: [],
		},
	]);

	useEffect(() => {
		setChartSeries([
			{
			  name: 'Doanh thu',
			  data: revenues,
			},
		  ]);
		  setChartOptions((prevState) => ({
			...prevState,
			xaxis: {
			  ...prevState.xaxis,
			  categories: months,
			},
		  }));
	}, [months, revenues])

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
