import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountBalance } from '../../../../../features/auth/authSlice';

const colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

const AccountBalanceColumnChart = () => {
	const dispatch = useDispatch();
	const [state, setState] = useState({
		series: [
			{
				data: [],
			},
		],
		options: {
			chart: {
				height: 350,
				type: 'bar',
				events: {
					click: function (chart, w, e) {},
				},
			},
			colors: colors,
			plotOptions: {
				bar: {
					columnWidth: '30%',
					distributed: true,
				},
			},
			dataLabels: {
				enabled: false,
			},
			legend: {
				show: false,
			},
			tooltip: {
				custom: function ({ series, seriesIndex, dataPointIndex, w }) {
					return (
						'<div class="arrow_box">' +
						'<span style="padding-y: 1rem, font-weight: bold">' +
						series[seriesIndex][dataPointIndex] +
						'</span>' +
						'<span style="paddingY: 1rem"> VND</span>' +
						'</div>'
					);
				},
			},
			xaxis: {
				categories: [],
				labels: {
					style: {
						colors: colors,
						fontSize: '12px',
					},
				},
			},
		},
	});

	const accountBalances = useSelector((state) => state.auth.accountBalance);

	useEffect(() => {
		const fetchData = async () => {
			const result = await dispatch(getAccountBalance());
			let balances = [];
			result.payload.map((account) => {
				balances.push(Number(account.accountBalance));
			});
			setState((prevState) => ({
				...prevState,
				series: [
					{
						data: balances,
					},
				],
				options: {
					...prevState.options,
					xaxis: {
						...prevState.options.xaxis,
						categories: accountNames,
					},
				},
			}));
		};
		fetchData();
	}, [dispatch]);

	return (
		<div>
			<div id="chart" className="w-[30vw]">
				<p className="font-bold px-6 mb-3">Thu nhập trong tháng</p>
				<ReactApexChart
					options={state?.options}
					series={state?.series}
					type="bar"
					height={350}
				/>
			</div>
		</div>
	);
};

export default AccountBalanceColumnChart;