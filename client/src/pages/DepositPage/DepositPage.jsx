import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountInformation } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export const DepositPage = () => {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [appTransId, setAppTransId] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { account } = useSelector((state) => state.auth);

    const handleDeposit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/antidee/api/payment/payment', { 
                amount: parseInt(amount.replace(/,/g, '')), // Chuyển đổi số định dạng lại thành số nguyên
                userId: account._id 
            });
            console.log('Phản hồi khởi tạo thanh toán:', response.data);
            setAppTransId(response.data.app_trans_id);
            if (response.data.order_url) {
                window.location.href = response.data.order_url; // Chuyển hướng tới ZaloPay
            } else {
                setMessage('Không thể lấy được URL thanh toán');
            }
        } catch (error) {
            console.error('Lỗi khởi tạo thanh toán:', error.response ? error.response.data : error.message);
            setMessage('Khởi tạo thanh toán thất bại');
        }
    };

    const updateBalance = async () => {
        try {
            const response = await axios.post('http://localhost:5000/antidee/api/payment/updateBalance', { 
                amount: parseInt(amount.replace(/,/g, '')),
                userId: account._id
            });
            console.log('Phản hồi cập nhật số dư:', response.data);
            dispatch(getAccountInformation()); // Cập nhật thông tin tài khoản
            setMessage('Số dư đã được cập nhật');
            navigate('/'); // Chuyển hướng về trang chủ
        } catch (error) {
            console.error('Lỗi cập nhật số dư:', error.response ? error.response.data : error.message);
            setMessage('Cập nhật số dư thất bại');
        }
    };

    const checkPaymentStatus = async () => {
        if (!appTransId) {
            setMessage('Không có giao dịch nào để kiểm tra');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/antidee/api/payment/orderStatus/${appTransId}`);
            console.log('Phản hồi kiểm tra trạng thái thanh toán:', response.data);
            if (response.data.return_code === 1) {
                await updateBalance(); // Cập nhật số dư nếu thanh toán thành công
            } else {
                setMessage('Thanh toán thất bại hoặc đang chờ xử lý');
            }
        } catch (error) {
            console.error('Lỗi kiểm tra trạng thái thanh toán:', error.response ? error.response.data : error.message);
            setMessage('Kiểm tra trạng thái thanh toán thất bại');
        }
    };

    const handleChange = (e) => {
        const value = e.target.value.replace(/,/g, ''); // Loại bỏ dấu phẩy
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setAmount(value === '' ? '' : parseInt(value, 10).toLocaleString()); // Định dạng số
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-light p-4">
            <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Trang Nạp Tiền</h1>
                <input 
                    type="text" 
                    value={amount} 
                    onChange={handleChange} 
                    placeholder="Nhập số tiền (VND)" 
                    className="w-full p-2 border border-gray rounded mb-4"
                />
                <button 
                    onClick={handleDeposit} 
                    className="w-full bg-primary text-white py-2 rounded hover:bg-primary_dark mb-2"
                >
                    Nạp Tiền
                </button>
                <button 
                    onClick={checkPaymentStatus} 
                    className="w-full bg-green text-white py-2 rounded hover:bg-light_green"
                >
                    Kiểm Tra Trạng Thái Thanh Toán
                </button>
                <span className="block text-center mt-4 text-gray">
                    ID: {account._id}
                </span>
                {message && <p className="mt-4 text-center text-red">{message}</p>}
            </div>
        </div>
    );
};
