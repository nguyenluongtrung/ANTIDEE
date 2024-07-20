import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getTransactionHistory } from '../../features/auth/authSlice'; 

export const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const result = await dispatch(getTransactionHistory());
            console.log(result);
            // Sao chép mảng trước khi sắp xếp
            const sortedTransactions = [...result.payload].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            setTransactions(sortedTransactions);
        };
        fetchData();
    }, [dispatch]);

    return (
        <div className="w-full min-h-screen bg-white flex flex-row">
            <div className="flex-1 px-10 pt-5">
                <div className="flex">
                    <div className="flex-1 pt-2">
                        <span>Displaying </span>
                        <select className="rounded-md p-1 mx-1 hover:cursor-pointer"
                            style={{ backgroundColor: '#E0E0E0' }}>
                            <option>10</option>
                            <option>20</option>
                            <option>30</option>
                        </select>
                        <span> rows</span>
                    </div>
                </div>

                <div>
                    <table className="w-full border-b border-gray mt-3">
                        <thead>
                        <tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
                            <td className="py-2 px-1 text-center font-bold">Người gửi </td>
                            <td className="py-2 px-1 text-center font-bold">Nội dung</td>
                            <td className="py-2 px-1 text-center font-bold">Người nhận</td>
                            <td className="py-2 px-1 text-center font-bold">Số tiền</td>
                            <td className="py-2 px-1 text-center font-bold">Thời gian giao dịch</td>
                        </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-gray">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => (
                                    <tr key={transaction._id} className="hover:bg-light_purple transition-colors group odd:bg-light_purple hover:cursor-pointer">
                                        <td className="font-medium text-center text-gray p-3"> 
                                            {transaction.fromAccountId?.name}
                                        </td>
                                        <td className="font-medium text-center text-gray p-3">
                                            {transaction.description}
                                        </td>
                                        <td className="font-medium text-center text-gray p-3">
                                            Admin Antidee
                                        </td>
                                        <td className="font-medium text-center text-gray p-3">
                                            {transaction.amount.toLocaleString()}
                                        </td>
                                        <td className="font-medium text-center text-gray p-3">
                                            {new Date(transaction.createdDate).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
