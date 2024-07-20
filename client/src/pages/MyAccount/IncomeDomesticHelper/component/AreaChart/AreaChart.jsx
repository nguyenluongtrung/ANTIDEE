import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountBalance } from '../../../../../features/auth/authSlice'; 

const AccountBalanceAreaChart = () => {
	const dispatch = useDispatch();
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
			curve: 'smooth',
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
			name: 'Số dư tài khoản',
			data: [], 
		},
	]);

	const accountBalances = useSelector((state) => state.auth.accountBalances);

	useEffect(() => {
		const fetchData = async () => {
			const result = await dispatch(getAccountBalance()); 
			let balances = [];
			result.payload.map((account) => {
				balances.push(Number(account.balance));
			});
			setChartOptions((prevState) => ({
				...prevState,
				xaxis: {
					...prevState.xaxis,
					categories: dates,
				},
			}));
			setChartSeries([
				{
					name: 'Số dư tài khoản',
					data: balances,
				},
			]);
		};
		fetchData();
	}, [dispatch]);

	return (
		<div id="chart">
			<p className="font-bold px-6 mb-3">Thu nhập trong năm</p>
			<ReactApexChart
				options={chartOptions}
				series={chartSeries}
				type="area"
				height={350}
			/>
		</div>
	);
};

export default AccountBalanceAreaChart;