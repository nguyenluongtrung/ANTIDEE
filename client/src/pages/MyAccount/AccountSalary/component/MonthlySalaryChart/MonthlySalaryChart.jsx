import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

const MonthlySalaryChart = ({ monthlySalary }) => {
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
				categories: ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'],
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
    if(monthlySalary){
      setState((prevState) => ({
        ...prevState,
        series: [
          {
            data: monthlySalary,
          },
        ],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'],
          },
        },
      }));
    }
				
	}, [monthlySalary]);

	return (
		<div>
			<div id="chart" className="w-[30vw]">
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

export default MonthlySalaryChart;
