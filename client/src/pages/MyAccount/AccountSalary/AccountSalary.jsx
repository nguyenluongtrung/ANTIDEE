import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountSalary } from './../../../features/auth/authSlice';
import MonthlySalaryChart from './component/MonthlySalaryChart/MonthlySalaryChart';

export const AccountSalary = ({ accountId }) => {
    const dispatch = useDispatch();
    const account = useSelector((state) => state.account);
    const { monthlySalary = [], loading = false, error = null } = account || {};

    useEffect(() => {
        if (accountId) {
            dispatch(getAccountSalary(accountId));
        }
    }, [dispatch, accountId]);

    if (!Array.isArray(monthlySalary) || monthlySalary.some(isNaN)) {
        return <p>No valid salary data available.</p>;
    }

    return (
        <div className="container mx-auto p-4">
    <h1 className="text-3xl font-bold mb-8 text-center">Salary Dashboard</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <MonthlySalaryChart monthlySalary={monthlySalary} />
    </div>

</div>
    );
};


