import React, { useEffect, useState } from 'react';
import { formatDateTime } from '../../../utils/format';
import { getAccountInformation } from '../../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { calculateTotalPages, getPageItems, nextPage, previousPage } from '../../../utils/pagination';

export const AccumulatePoint = () => {
  const [account, setAccount] = useState();

  const pointsPerPage = 10;
  const dispatch = useDispatch();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  async function initiateAccountInformation() {
    let output = await dispatch(getAccountInformation());
    setAccount(output.payload);
  }

  useEffect(() => {
    initiateAccountInformation();
  }, []);

  const filteredHistory = account?.aPointHistory?.filter(historyItem => historyItem?.apoint !== 0) || [];

  const currentPoints = filteredHistory.slice((currentPage - 1) * pointsPerPage, currentPage * pointsPerPage);

  
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

  const totalPages = calculateTotalPages(filteredHistory.length, rowsPerPage);
  const selectedAPoints = getPageItems(filteredHistory, currentPage, rowsPerPage);

  const handleNextPage = () => setCurrentPage(nextPage(currentPage, totalPages));
  const handlePreviousPage = () => setCurrentPage(previousPage(currentPage));

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
              {selectedAPoints?.map((historyItem, index) => (
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


        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            className="bg-light_gray hover:bg-gray hover:text-white w-fit px-4 py-2 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
          >
            &#9664;
          </button>
          <span className="text-sm font-semibold">Page {currentPage} of {totalPages}</span>
          <button
            className="bg-light_gray hover:bg-gray hover:text-white w-fit px-4 py-2 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            &#9654;
          </button>
        </div>

      </div>
    </div>

  );
};
