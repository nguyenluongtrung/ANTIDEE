import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const VoucherHistory = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      const token = localStorage.getItem('token'); // Giả định token được lưu trong localStorage
      try {
        const response = await axios.get('/api/vouchers/history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setVouchers(response.data.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lịch Sử Voucher Đã Sử Dụng</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Mã Voucher
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Giảm Giá
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ngày Sử Dụng
              </th>
            </tr>
          </thead>
          <tbody>
          {vouchers && vouchers.length > 0 ? (
  vouchers.map((voucher) => (
    <tr key={voucher._id}>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{voucher.voucherId.code}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{voucher.voucherId.discount}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{new Date(voucher.dateUsed).toLocaleDateString()}</p>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="3" className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
      No vouchers found.
    </td>
  </tr>
)}

          </tbody>
        </table>
      </div>
    </div>
  );
};

