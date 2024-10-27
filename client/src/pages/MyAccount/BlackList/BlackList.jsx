import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDomesticHelperFromBlackList, getAccountInformation } from "../../../features/auth/authSlice";
import { Spinner } from "../../../components";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { BiTrash } from "react-icons/bi";
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import toast from "react-hot-toast";
import { calculateTotalPages, getPageItems, nextPage, previousPage } from "../../../utils/pagination";
import Pagination from "../../../components/Pagination/Pagination";

export const BlackList = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [accounts, setAccounts] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  async function initiateAccountInformation() {
    let output = await dispatch(getAccountInformation());

    setAccounts(output.payload);
  }

  useEffect(() => {
    initiateAccountInformation();
  }, []);

  useEffect(() => {
    dispatch(getAccountInformation());
  }, [dispatch]);

  const handleDeleteDomesticHelper = async (id) => {
    const result = await dispatch(deleteDomesticHelperFromBlackList(id));
    if (result.type.endsWith('fulfilled')) {
      toast.success('Xoá thành công', successStyle);
    } else if (result?.error?.message === 'Rejected') {
      toast.error(result?.payload, errorStyle);
    }
    dispatch(getAccountInformation());
  }


  const totalPages = calculateTotalPages(accounts.blackList?.length || 0, rowsPerPage);
  const currentItems = getPageItems(accounts.blackList, currentPage, rowsPerPage);

  const handleNextPage = () => setCurrentPage(nextPage(currentPage, totalPages));
  const handlePreviousPage = () => setCurrentPage(previousPage(currentPage));


  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="flex flex-col px-4 pt-10 md:flex-row md:px-16 md:pt-20">
      <div className="left-container pb-6 md:pb-0 pr-0 md:pr-24 w-full md:w-1/3">
        <Sidebar account={accounts} />
      </div>
      <div className="w-full">
        {accounts.blackList && accounts.blackList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className=" md:w-full border-b border-gray mt-3">
              <thead>
                <tr className="text-xs md:text-sm font-medium text-gray border-b border-gray border-opacity-50">
                  <td className="py-2 px-2 md:px-4 text-center font-bold">STT</td>
                  <td className="py-2 px-2 md:px-4 text-center font-bold">Tên</td>
                  <td className="py-2 px-2 md:px-4 text-center font-bold">Địa Chỉ</td>
                  <td className="py-2 px-2 md:px-4 text-center font-bold">Email</td>
                  <td className="py-2 px-2 md:px-4 text-center font-bold">Option</td>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    className="hover:bg-light_purple transition-colors group odd:bg-light_purple hover:cursor-pointer"
                    key={index}
                  >
                    <td className="font-medium text-center text-gray p-2 md:p-3">
                      <span>{index + 1}</span>
                    </td>
                    <td className="font-medium text-center text-gray p-2 md:p-3">
                      <span>{item?.domesticHelperId?.name}</span>
                    </td>
                    <td className="font-medium text-center text-gray px-2 md:px-3">
                      <span>{item?.domesticHelperId?.address}</span>
                    </td>
                    <td className="font-medium text-center text-gray px-2 md:px-3">
                      <span>{item?.domesticHelperId?.email}</span>
                    </td>
                    <td className="px-2 md:px-3">
                      <div>
                        <button className="flex items-center justify-start py-2 md:py-3 pl-2 text-xl">
                          <BiTrash
                            className="text-red"
                            onClick={() => handleDeleteDomesticHelper(item?.domesticHelperId?._id)}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <span className="text-sm md:text-lg">
            Không có người giúp việc nào trong danh sách đen
          </span>
        )}
        <div className="flex items-center justify-between border-t border-gray bg-white px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray">
                Hiển thị <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> đến{' '}
                <span className="font-medium">
                  {Math.min(currentPage * rowsPerPage, accounts.blackList?.length)}
                </span>{' '}
                trong <span className="font-medium">{accounts.blackList?.length}</span> kết quả
              </p>
            </div>
            <div>
              <Pagination totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
                rowsPerPage={rowsPerPage} />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};
