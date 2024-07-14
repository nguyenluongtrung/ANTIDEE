import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch } from 'react-redux';
import { getDomesticHelpersRanking } from '../../../../../features/auth/authSlice';
import { countNumberOfJobsByAccountId } from '../../../../../features/jobPosts/jobPostsSlice';

const colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

const ColumnChart = ({ isCustomerMode }) => {
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
						'<span style="paddingY: 1rem">' +
						`${isCustomerMode ? ' công việc' : ' điểm'}` +
						'</span>' +
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

	useEffect(() => {
		const fetchData = async () => {
			if (!isCustomerMode) {
				const result = await dispatch(getDomesticHelpersRanking());
				let selectedNames = [];
				let selectedScores = [];
				result.payload.map((domesticHelper) => {
					selectedNames.push(domesticHelper.name);
					selectedScores.push(
						Number(domesticHelper.domesticHelperRankingCriteria)
					);
				});
				setState((prevState) => ({
					...prevState,
					series: [
						{
							data: selectedScores,
						},
					],
					options: {
						...prevState.options,
						xaxis: {
							...prevState.options.xaxis,
							categories: selectedNames,
						},
					},
				}));
			} else {
				const result = await dispatch(countNumberOfJobsByAccountId());
				let totalJobPosts = [];
				let accountNames = [];
				result.payload.map((customer) => {
					totalJobPosts.push(Number(customer.totalJobPosts));
					accountNames.push(customer.accountName);
				});
				console.log(accountNames, totalJobPosts);
				setState((prevState) => ({
					...prevState,
					series: [
						{
							data: totalJobPosts,
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
			}
		};
		fetchData();
	}, []);

	return (
		<div>
			<div id="chart" className="w-[30vw]">
				<p className="font-bold px-6">
					{isCustomerMode
						? 'Những khách hàng thân thiết'
						: 'Những người giúp việc ưu tú'}
				</p>
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

export default ColumnChart;
