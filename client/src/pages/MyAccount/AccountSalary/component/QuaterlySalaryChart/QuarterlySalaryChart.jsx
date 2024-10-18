import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const QuarterlySalaryChart = ({ quarterlySalary = [] }) => {
    const [state, setState] = useState({
        series: [],
        options: {
            chart: {
                type: 'pie',
                height: 350,
            },
            labels: ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4'],
            colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560'],
            dataLabels: {
                enabled: true,
            },
            tooltip: {
                y: {
                    formatter: (val) => `${val.toLocaleString()} VNĐ`,
                },
            },
        },
    });

    useEffect(() => {
        if (quarterlySalary.length > 0) {
            setState((prevState) => ({
                ...prevState,
                series: quarterlySalary,
            }));
        }
    }, [quarterlySalary]);

    return (
        <div>
            <ReactApexChart
                options={state.options}
                series={state.series}
                type="pie"
                height={350}
            />
        </div>
    );
};

export default QuarterlySalaryChart;
