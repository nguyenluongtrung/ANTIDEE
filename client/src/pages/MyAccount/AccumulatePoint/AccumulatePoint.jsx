import React, { useEffect, useState } from 'react';
import { formatDateTime } from '../../../utils/format';
import { getAccountInformation } from '../../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { Sidebar } from '../components/Sidebar/Sidebar';

export const AccumulatePoint = () => {
  const [account, setAccount] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const pointsPerPage = 10;
  const dispatch = useDispatch();

  async function initiateAccountInformation() {
    let output = await dispatch(getAccountInformation());
    setAccount(output.payload);
  }

  useEffect(() => {
    initiateAccountInformation();
  }, []);

  const filteredHistory = account?.aPointHistory?.filter(historyItem => historyItem?.apoint !== 0) || [];
  const totalPages = Math.ceil(filteredHistory.length / pointsPerPage);
  const currentPoints = filteredHistory.slice((currentPage - 1) * pointsPerPage, currentPage * pointsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getPaginationItems = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((page) => {
      if (l) {
        if (page - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (page - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(page);
      l = page;
    });

    return rangeWithDots;
  };

  const paginationItems = getPaginationItems();
 const formatDateTimeHistory = (dateString) => {
    const daysOfWeek = [
      'Chủ nhật',
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
    ];
    const date = new Date(dateString);
    date.setUTCHours(date.getUTCHours() + 7);
  
    const dayOfWeek = daysOfWeek[date.getUTCDay()];
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  
    const formattedDate = `${dayOfWeek}, ${day}/${month}/${year} ${hours}:${minutes}`;
  
    return formattedDate;
  };

  return (
    <div className="flex flex-col md:flex-row px-4 md:px-16 pt-10 md:pt-20">
  <div className="md:pr-24 pt-3 md:w-1/3 w-full">
    <Sidebar account={account} />
  </div>

  <div className="w-full">
    <h5 className="font-bold text-xl md:text-2xl text-green text-center">
      LỊCH SỬ ĐIỂM TÍCH LŨY
    </h5>

    <div className="w-full overflow-x-auto mt-3">
      <table className="min-w-full border-b border-gray">
        <thead>
          <tr className="text-xs md:text-sm font-medium text-gray border-b border-gray">
            <th className="py-2 px-1 md:px-4 text-center">STT</th>
            <th className="py-2 px-1 md:px-4 text-center">Điểm</th>
            <th className="py-2 px-1 md:px-4 text-center">Dịch vụ</th>
            <th className="py-2 px-1 md:px-4 text-center">Ngày cập nhật</th>
          </tr>
        </thead>
        <tbody>
          {currentPoints?.map((historyItem, index) => (
            <tr
              className="hover:bg-purple transition-colors group odd:bg-light_pink cursor-pointer"
              key={index}
            >
              <td className="font-medium text-center text-gray py-2 px-1 md:px-3">
                <span>{(currentPage - 1) * pointsPerPage + index + 1}</span>
              </td>
              <td className="font-medium text-center text-gray py-2 px-1 md:px-3">
                <span>
                  {historyItem?.operationType === "add" ? "+" : "-"}
                  {historyItem?.apoint}
                </span>
              </td>
              <td className="font-medium text-center text-gray py-2 px-1 md:px-3">
                <span>{historyItem?.serviceId?.name}</span>
              </td>
              <td className="font-medium text-center text-gray py-2 px-1 md:px-3">
                <span>{formatDateTimeHistory(historyItem?.update)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Phần phân trang */}
    <div className="flex justify-center mt-4 mb-4">
      <div className="flex">
        <button
          onClick={() => handlePageChange(1)}
          className="px-2 py-1 text-lg font-bold text-gray hover:text-blue disabled:opacity-50"
          disabled={currentPage === 1}
        >
          «
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-2 py-1 text-lg font-bold text-gray hover:text-blue disabled:opacity-50"
          disabled={currentPage === 1}
        >
          ‹
        </button>

        {paginationItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(item)}
            className={`px-3 py-1 mx-1 text-sm font-bold rounded ${
              item === currentPage
                ? "bg-green text-white"
                : item === "..."
                ? "text-gray-500 cursor-default"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={item === "..."}
          >
            {item}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-2 py-1 text-lg font-bold text-gray hover:text-blue disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          ›
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          className="px-2 py-1 text-lg font-bold text-gray hover:text-blue disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  </div>
</div>

  );
};
