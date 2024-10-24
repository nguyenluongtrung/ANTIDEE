import toast, { Toaster, ToastBar } from "react-hot-toast";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import "./QualificationManagement.css";
// import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../components";
import {
  deleteQualification,
  getAllQualifications,
} from "../../../features/qualifications/qualificationSlice";
import { CreateQualification } from "./CreateQualification/CreateQualification";
import { UpdateQualification } from "./UpdateQualification/UpdateQualification";
import { IoAddOutline } from "react-icons/io5";
import { calculateTotalPages, getPageItems, nextPage, previousPage } from "../../../utils/pagination";

export const QualificationManagement = () => {
  const [isOpenCreateQualification, setIsOpenCreateQualification] =
    useState(false);

  const [isOpenUpdateQualification, setIsOpenUpdateQualification] =
    useState(false);
  const [chosenQualificationId, setChosenQualificationId] = useState("");

  const { qualifications, isLoading } = useSelector(
    (state) => state.qualifications
  );
  const dispatch = useDispatch();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getAllQualifications());
  }, []);

  const handleDeleteQualification = async (id) => {
    const result = await dispatch(deleteQualification(id));
    console.log("***", result);
    if (result.type.endsWith("fulfilled")) {
      toast.success("Xoá chứng chỉ thành công");
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
  };
  if (isLoading) {
    return <Spinner />;
  }

  const handleGetAllQualifications = () => {
    Promise.all([dispatch(getAllQualifications())]).catch((error) => {
      console.error("Error during dispatch:", error);
    });
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };


  const totalPages = calculateTotalPages(qualifications.length, rowsPerPage);
  const selectedQualifications = getPageItems(qualifications, currentPage, rowsPerPage);

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
        {isOpenCreateQualification && (
          <CreateQualification
            setIsOpenCreateQualification={setIsOpenCreateQualification}
            handleGetAllQualifications={handleGetAllQualifications}
          />
        )}
        {isOpenUpdateQualification && (
          <UpdateQualification
            setIsOpenUpdateQualification={setIsOpenUpdateQualification}
            handleGetAllQualifications={handleGetAllQualifications}
            chosenQualificationId={chosenQualificationId}
          />
        )}

        <div className="flex items-center justify-center">
          <div className="flex-1 pt-2" style={{ paddingRight: "70%" }}>
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
          <button
            className="bg-pink text-white rounded-md block mx-auto py-0.5"
            style={{ width: "170px" }}
            onClick={() => setIsOpenCreateQualification(true)}
          >
            <div className="flex items-center">
              <IoAddOutline className="size-8 pl-2 mr-2" />
              <span className="text-sm pr-2">Thêm chứng chỉ</span>
            </div>
          </button>
        </div>
        <table className="w-full border-b border-gray mt-3">
          <thead>
            <tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
              <td className="py-2 px-4 text-center font-bold">STT</td>
              <td className="py-2 px-4 text-center font-bold">Tên</td>
              <td className="py-2 px-4 text-center font-bold">Mô Tả</td>
              <td className="py-2 px-4 text-center font-bold">Hành Động</td>
            </tr>
          </thead>
          <tbody>
            {selectedQualifications?.map((qualification, index) => {
              return (
                <tr className="hover:bg-primary hover:bg-opacity-25 transition-colors odd:bg-light_pink  hover:cursor-pointer">
                  <td className="font-medium text-center text-gray p-3">
                    <span>{index + 1}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <span>{qualification.name}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <span>{qualification.description}</span>
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center">
                      <button className="flex items-center justify-end py-3 pr-2 text-xl group">
                        <BiEdit
                          className="text-green group-hover:text-primary"
                          onClick={() => {
                            setIsOpenUpdateQualification(true);
                            setChosenQualificationId(qualification._id);
                          }}
                        />
                      </button>
                      <button className="flex items-center justify-start p-3 text-xl group">
                        <BiTrash
                          className="text-red group-hover:text-primary"
                          onClick={() =>
                            handleDeleteQualification(qualification._id)
                          }
                        />
                      </button>
                    </div>
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
