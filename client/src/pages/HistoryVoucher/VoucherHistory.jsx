import React from 'react';

const voucherHistory = [
  {
    id: 1,
    code: 'ABC123',
    discount: '10%',
    dateUsed: '2024-01-01',
  },
  {
    id: 2,
    code: 'XYZ456',
    discount: '20%',
    dateUsed: '2024-02-15',
  },
  // Thêm nhiều voucher hơn ở đây...
];

export const VoucherHistory = () => {
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
            {voucherHistory.map(voucher => (
              <tr key={voucher.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{voucher.code}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{voucher.discount}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{voucher.dateUsed}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

 
