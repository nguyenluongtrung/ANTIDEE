import toast, { Toaster, ToastBar } from "react-hot-toast";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import "./VideoManagement.css";
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../components";
import { deleteVideo, getAllVideos } from "../../../features/videos/videoSlice";

import { Link } from 'react-router-dom'
import { IoAddOutline } from "react-icons/io5";
import {
  calculateTotalPages,
  getPageItems,
  nextPage,
  previousPage,
} from "../../../utils/pagination";
import Pagination from "../../../components/Pagination/Pagination";
import DeletePopup from "../../../components/DeletePopup/DeletePopup";

export const VideoManagement = () => { 

  const { isLoading } = useSelector((state) => state.videos);
  const [videos, setVideos] = useState([]);

  const dispatch = useDispatch();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedIdDelete, setSelectedIdDelete] = useState('');

  async function initiateVideos() {
    let output = await dispatch(getAllVideos());
    setVideos(output.payload);
  }

  useEffect(() => {
    initiateVideos();
  }, []);

  useEffect(() => {
    dispatch(getAllVideos());
  }, []);

  const openDeletePopup = (videoId) => {
    setSelectedIdDelete(videoId);
    setIsDeletePopupOpen(true);
  };

  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setSelectedIdDelete('');
  };

  //Delete Video
  const handleDeleteVideo = async () => {
    const result = await dispatch(deleteVideo(selectedIdDelete));
    console.log("***", result);
    if (result.type.endsWith("fulfilled")) {
      toast.success("Xoá video thành công");
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
  };
  if (isLoading) {
    return <Spinner />;
  }

  const handleGetAllVideos = () => {
    Promise.all([dispatch(getAllVideos())]).catch((error) => {
      console.error("Error during dispatch:", error);
    });
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = calculateTotalPages(videos.length, rowsPerPage);
  const selectedVideos = getPageItems(videos, currentPage, rowsPerPage);

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

        <DeletePopup
          open={isDeletePopupOpen}
          onClose={closeDeletePopup}
          deleteAction={handleDeleteVideo}
          itemName="video"
        />

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
          <Link to="/admin-video/create">
            <button
              className="bg-pink text-white rounded-md block mx-auto py-0.5"
              style={{ width: "170px" }}

            >
              <div className="flex items-center">
                <IoAddOutline className="size-8 pl-2 mr-2" />
                <span className="text-sm pr-2">Thêm Video</span>
              </div>
            </button>
            </Link>

        </div>
        <table className="w-full border-b border-gray mt-3">
          <thead>
            <tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
              <td className="py-2 px-4 text-center font-bold">STT</td>
              <td className="py-2 px-4 text-center font-bold">Tên</td>
              <td className="py-2 px-4 text-center font-bold">Mô Tả</td>
              <td className="py-2 px-4 text-center font-bold">Đường dẫn</td>
              <td className="py-2 px-4 text-center font-bold">Hành Động</td>
            </tr>
          </thead>
          <tbody>
            {selectedVideos?.map((video, index) => {
              return (
                <tr className="hover:bg-primary hover:bg-opacity-25 transition-colors odd:bg-light_pink  hover:cursor-pointer">
                  <td className="font-medium text-center text-gray p-3">
                    <span>{index + 1}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <span>{video.title}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <span>{video.description}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <span>{video.url}</span>
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center">
                      <Link to={`/admin-video/update/${video._id}`}>
                        <button
                          className="flex items-center justify-end py-3 pr-2 text-xl"
                        >
                          <BiEdit className="text-green" />
                        </button>
                      </Link>
                      <button className="flex items-center justify-start p-3 text-xl group">
                        <BiTrash
                          className="text-red group-hover:text-primary"
                          onClick={() => openDeletePopup(video._id)}
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
