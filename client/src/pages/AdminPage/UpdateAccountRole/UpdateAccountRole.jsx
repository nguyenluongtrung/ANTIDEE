import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../components";
import toast, { Toaster, ToastBar } from "react-hot-toast";
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import { BiCheck } from "react-icons/bi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import {
  getAllEligibleAccounts,
  updateRole,
} from "../../../features/auth/authSlice";
import { QualificationDetail } from "./QualificationDetail/QualificationDetail";
import { ImageDetail } from "./ImageDetail/ImageDetail";
import { getAccountQualifications } from "../../../features/qualifications/qualificationSlice";
import {
  calculateTotalPages,
  getPageItems,
  nextPage,
  previousPage,
} from "../../../utils/pagination";
export const UpdateAccountRole = () => {
  const [isOpenDetailAccount, setIsOpenDetailAccount] = useState(false);
  const [isOpenImageDetail, setIsOpenImageDetail] = useState(false);
  const [chosenAccountId, setChosenAccountId] = useState("");
  const [accounts, setAccounts] = useState("");
  const [accountQualifications, setAccountQualifications] = useState([]);
  const dispatch = useDispatch();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleGetAllEligibleAccount = async () => {
    const response = await dispatch(getAllEligibleAccounts());
    setAccounts(response.payload);
  };

  useEffect(() => {
    handleGetAllEligibleAccount();
  }, []);

  if (!Array.isArray(accounts)) {
    return <Spinner />;
  }

  const handleSubmitUpdateRole = async (id) => {
    const response = await dispatch(updateRole(id));
    if (response.type.endsWith("fulfilled")) {
      toast.success("Cập nhật thành công", successStyle);
    } else if (response?.error?.message === "Rejected") {
      toast.error(response?.payload, errorStyle);
    }
    handleGetAllAccount();
  };

  const handleGetDetailQualificationImg = async (accountId) => {
    const response = await dispatch(getAccountQualifications(accountId));
    setAccountQualifications(response.payload);
    setIsOpenDetailAccount(true);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = calculateTotalPages(accounts.length, rowsPerPage);
  const selectedAccounts = getPageItems(accounts, currentPage, rowsPerPage);

  const handleNextPage = () => {
    setCurrentPage(nextPage(currentPage, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage(previousPage(currentPage));
  };

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

        {isOpenDetailAccount && (
          <QualificationDetail
            setIsOpenDetailAccount={setIsOpenDetailAccount}
            accountQualifications={accountQualifications}
          />
        )}

        {isOpenImageDetail && (
          <ImageDetail
            setIsOpenImageDetail={setIsOpenImageDetail}
            chosenAccountId={chosenAccountId}
            accounts={accounts}
          />
        )}

        <div className="flex">
          <div className="flex-1 pt-2">
            <span>Hiển thị </span>
            <select
              className="rounded-md p-1 mx-1 hover:cursor-pointer"
              style={{ backgroundColor: "#E0E0E0" }}
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
              <td className="py-2 px-4 text-center font-bold">Người dùng</td>
              <td className="py-2 px-4 text-center font-bold">Chứng chỉ</td>
              <td className="py-2 px-4 text-center font-bold">
                Các giấy tờ liên quan
              </td>
              <td className="py-2 px-4 text-center font-bold">Hành Động</td>
            </tr>
          </thead>
          <tbody>
            {selectedAccounts?.map((account, index) => {
              return (
                <tr className="hover:bg-light_purple transition-colors group odd:bg-light_purple hover:cursor-pointer">
                  <td className="font-medium text-center text-gray p-3">
                    <span>{index + 1}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <span>{account?.name}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <button
                      className="hover:cursor-pointer text-xl pt-1.5"
                      onClick={() =>
                        handleGetDetailQualificationImg(account._id)
                      }
                    >
                      <MdOutlineRemoveRedEye className="block mx-auto" />
                    </button>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <button
                      className="hover:cursor-pointer text-xl pt-1.5"
                      onClick={() => {
                        setIsOpenImageDetail(true);
                        setChosenAccountId(account._id);
                      }}
                    >
                      <MdOutlineRemoveRedEye className="block mx-auto" />
                    </button>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <button
                      className="hover:cursor-pointer text-xl pt-1.5"
                      onClick={() => handleSubmitUpdateRole(account._id)}
                    >
                      <BiCheck className="block mx-auto text-green" />
                    </button>
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center"></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            className="bg-light_gray hover:bg-gray hover:text-white w-fit px-4 py-2 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
          >
            &#9664;
          </button>
          <span className="text-sm font-semibold">
            Page {currentPage} of {totalPages}
          </span>
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
