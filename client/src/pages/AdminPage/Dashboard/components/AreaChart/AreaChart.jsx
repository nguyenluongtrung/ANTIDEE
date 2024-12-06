import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getRevenueByMonths } from '../../../../../features/jobPosts/jobPostsSlice';
import { useDispatch } from 'react-redux';

const colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

const AreaChart = () => {
	const [months, setMonths] = useState();
	const [revenues, setRevenues] = useState();

	const dispatch = useDispatch()

	useEffect(() => {
		const fetchData = async () => {
			const result = await dispatch(getRevenueByMonths());
			setMonths(result.payload.months);
			setRevenues(result.payload.revenues);
		};
		fetchData();
	}, []);

	const [chartOptions, setChartOptions] = useState({
		chart: {
			height: 350,
			type: 'bar',
		},
		colors: colors,
		plotOptions: {
			bar: {
				columnWidth: '30%',
				distributed: true,
			},
		},
		legend: {
			show: false,
		},
		tooltip: {
			custom: function({ series, seriesIndex, dataPointIndex, w }) {
				const amount = series[seriesIndex][dataPointIndex];
				return `<div style="padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
							<strong>${amount.toLocaleString()} VNĐ</strong>
						</div>`;
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
				type="bar"
				height={350}
			/>
		</div>
	);
};

export default AreaChart;
