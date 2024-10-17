import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const QuarterlySalaryChart = ({ monthlySalary }) => {
    
    const quarterlySalary = [
        monthlySalary.slice(0, 3).reduce((acc, val) => acc + val, 0),  // Q1
        monthlySalary.slice(3, 6).reduce((acc, val) => acc + val, 0),  // Q2
        monthlySalary.slice(6, 9).reduce((acc, val) => acc + val, 0),  // Q3
        monthlySalary.slice(9, 12).reduce((acc, val) => acc + val, 0), // Q4
    ];

    const data = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                label: 'Quarterly Salary',
                data: quarterlySalary,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Salary by Quarter',
            },
        },
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quarterly Salary</h2>
            <Pie data={data} options={options} />
        </div>
    );
};

export default QuarterlySalaryChart;
