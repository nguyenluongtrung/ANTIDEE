import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountSalary } from './../../../features/auth/authSlice';
import MonthlySalaryChart from './component/MonthlySalaryChart/MonthlySalaryChart';

export const AccountSalary = ({ accountId }) => {
    const dispatch = useDispatch();
    const [monthlySalary, setMonthlySalary] = useState();

    const initiateAccountSalary = async () => {
        const response = await dispatch(getAccountSalary());
        setMonthlySalary(response.payload)
    }

    useEffect(() => {
        initiateAccountSalary()
    }, []);

    return (
        <div className="container mx-auto p-4">
    <h1 className="text-3xl font-bold mb-8 text-center">Salary Dashboard</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
            <div></div>
            <div></div>
        </div>
        <MonthlySalaryChart monthlySalary={monthlySalary} />
        <MonthlySalaryChart monthlySalary={monthlySalary} />
    </div>

</div>
    );
};


