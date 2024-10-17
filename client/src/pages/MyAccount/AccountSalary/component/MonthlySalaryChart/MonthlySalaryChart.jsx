import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch } from 'react-redux';
import { getAccountSalary } from '../../../../../features/auth/authSlice';

const MonthlySalaryChart = ({ monthlySalary }) => {
    
    const dispatch = useDispatch();
    const { monthlySalary, status, error } = useSelector((state) => state.salary);
  
    useEffect(() => {
      if (status === 'idle') {
        dispatch(getAccountSalary());
      }
    }, [status, dispatch]);
  
    const chartOptions = {
      chart: {
        type: 'bar',
      },
      xaxis: {
        categories: [
          'January', 'February', 'March', 'April', 'May', 'June', 
          'July', 'August', 'September', 'October', 'November', 'December'
        ],
      },
      title: {
        text: 'Monthly Salary',
      },
      colors: ['#34D399'],
    };
  
    const chartSeries = [
      {
        name: 'Salary',
        data: monthlySalary,
      },
    ];
  
    return (
      <div className="max-w-lg mx-auto mt-8">
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>Error: {error}</p>}
        {status === 'succeeded' && (
          <Chart 
            options={chartOptions} 
            series={chartSeries} 
            type="bar" 
            height={350} 
          />
        )}
      </div>
    );
  };

export default MonthlySalaryChart;
