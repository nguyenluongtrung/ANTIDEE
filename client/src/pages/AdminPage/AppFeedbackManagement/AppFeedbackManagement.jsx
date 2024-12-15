import toast, { Toaster, ToastBar } from "react-hot-toast";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import "./AppFeedbackManagement.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../components";
import { getAllAppFeedbacks } from "../../../features/appFeedbacks/appFeedbackSlice";
import { BiReply } from "react-icons/bi";
import {
  calculateTotalPages,
  getPageItems,
  nextPage,
  previousPage,
} from "../../../utils/pagination";
import Pagination from "../../../components/Pagination/Pagination";

export const AppFeedbackManagement = () => {
  const { appFeedbacks, isLoading } = useSelector(
    (state) => state.appFeedbacks
  );
  const dispatch = useDispatch();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getAllAppFeedbacks());
  }, []);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = calculateTotalPages(appFeedbacks.length, rowsPerPage);
  const selectedAppFeedbacks = getPageItems(
    appFeedbacks,
    currentPage,
    rowsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage(nextPage(currentPage, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage(previousPage(currentPage));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-row">
      <AdminSidebar />
      <div className="flex-1 px-10 pt-5">
        <Toaster>
          {(t) => (
            <ToastBar
              toast={t}
              style={{
                ...t.style,
                animation: t.visible
                  ? "custom-enter 1s ease"
                  : "custom-exit 1s ease",
              }}
            />
          )}
        </Toaster>

        <div className="flex items-center justify-center">
          <div className="flex-1 pt-2" style={{ paddingRight: "70%" }}>
            <span>Hiển thị </span>
            <select
              className="rounded-md p-1 mx-1 hover:cursor-pointer bg-light_purple"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option>10</option>
              <option>20</option>
              <option>30</option>
            </select>
            <span> hàng</span>
          </div>
        </div>
        <table className="w-full border-b border-gray mt-3">
          <thead>
            <tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
              <td className="py-2 px-4 text-center font-bold">STT</td>
              <td className="py-2 px-4 text-center font-bold">Tên</td>
              <td className="py-2 px-4 text-center font-bold">SĐT</td>
              <td className="py-2 px-4 text-center font-bold">Email</td>
              <td className="py-2 px-4 text-center font-bold">Nội dung</td>
              <td className="py-2 px-4 text-center font-bold">Hành Động</td>
            </tr>
          </thead>
          <tbody>
            {selectedAppFeedbacks?.map((appFeedback, index) => {
              return (
                <tr className="hover:bg-primary hover:bg-opacity-25 transition-colors odd:bg-light_pink  hover:cursor-pointer">
                  <td className="font-medium text-center text-gray p-3">
                    <span>{index + 1}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <span>{appFeedback.name}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <span>{appFeedback.phoneNumber}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <span>{appFeedback.email}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <span>{appFeedback.description}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <button
                      className="hover:cursor-pointer text-xl pt-1.5"
                    >
                      <BiReply className="block mx-auto text-green" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-gray bg-white px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray">
                Hiển thị <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> đến{' '}
                <span className="font-medium">
                  {Math.min(currentPage * rowsPerPage, appFeedbacks.length)}
                </span>{' '}
                trong <span className="font-medium">{appFeedbacks.length}</span> kết quả
              </p>
            </div>
            <div>
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
                rowsPerPage={rowsPerPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};