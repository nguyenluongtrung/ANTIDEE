import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

const MonthlySalaryChart = ({ monthlySalary = [] }) => {
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
                custom: function({ series, seriesIndex, dataPointIndex, w }) {
                    const amount = series[seriesIndex][dataPointIndex];
                    return `<div style="padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                                <strong>${amount.toLocaleString()} VNĐ</strong>
                            </div>`;
                },
            },
            xaxis: {
                categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
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
        if (monthlySalary.length > 0) {
            setState((prevState) => ({
                ...prevState,
                series: [
                    {
                        data: monthlySalary,
                    },
                ],
            }));
        }
    }, [monthlySalary]);

    return (
        <div>
            <ReactApexChart
                options={state.options}
                series={state.series}
                type="bar"
                height={350}
            />
        </div>
    );
};

export default MonthlySalaryChart;
