import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export const DepositPage = () => { 
  const [amount, setAmount] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const { account } = useSelector((state) => state.auth);
  const bankId = 'Vietinbank';
  const template = 'print';
  const accountName = 'Dinh Van Toan'; // Change to dynamic if needed
  const accountNo = '109875723785';

  const qrCodeValue = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount.replace(/\./g, '')}&addInfo=${account._id}&accountName=${accountName}`;

  const handleGenerateQRCode = () => {
    if (parseFloat(amount.replace(/\./g, '')) > 0) {
      setShowQRCode(true);
    } else {
      alert("Please enter a valid amount.");
    }
  };

  const formatAmount = (value) => {
    const numberString = value.replace(/\D/g, '');
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAmountChange = (e) => {
    setAmount(formatAmount(e.target.value));
  };

  return (
    <div className="deposit-page pt-20 px-9 text-center flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Nạp tiền vào tài khoản</h1>
      <div className="input-group mb-6">
        <label htmlFor="amount" className="block text-lg mb-2">Số tiền muốn chuyển:</label>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={handleAmountChange}
          className="px-4 py-2 border border-gray-300 rounded mb-4 w-64"
          placeholder="0"
        />
        <button 
          onClick={handleGenerateQRCode} 
          className="px-6 py-2 bg-primary text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Tạo mã QR
        </button>
      </div>
      <div className="qrcode mt-6 w-[550px] h-auto flex justify-center">
        {showQRCode && <img src={qrCodeValue} alt="QR Code" className="inline-block" />}
      </div>
    </div>
  );
};

export default DepositPage;
