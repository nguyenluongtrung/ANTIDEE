import toast, { Toaster, ToastBar } from "react-hot-toast";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import "./VideoManagement.css";
// import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../components";
import { deleteVideo, getAllVideos } from "../../../features/videos/videoSlice";

import { CreateVideo } from "./CreateVideo/CreateVideo";
import { UpdateVideo } from "./UpdateVideo/UpdateVideo";

import { IoAddOutline } from "react-icons/io5";

export const VideoManagement = () => {
  //Create Video
  const [isOpenCreateVideo, setIsOpenCreateVideo] = useState(false);
  //Update Video
  const [isOpenUpdateVideo, setIsOpenUpdateVideo] = useState(false);
  const [chosenVideoId, setChosenVideoId] = useState("");

  const { videos, isLoading } = useSelector((state) => state.videos);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllVideos());
  }, []);

  //Delete Video
  const handleDeleteVideo = async (id) => {
    const result = await dispatch(deleteVideo(id));
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

  //Get All Video
  const handleGetAllVideos = () => {
    Promise.all([dispatch(getAllVideos())]).catch((error) => {
      console.error("Error during dispatch:", error);
    });
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
        {isOpenCreateVideo && (
          <CreateVideo
            setIsOpenCreateVideo={setIsOpenCreateVideo}
            handleGetAllVideos={handleGetAllVideos}
          />
        )}
        {isOpenUpdateVideo && (
          <UpdateVideo
            setIsOpenUpdateVideo={setIsOpenUpdateVideo}
            handleGetAllVideos={handleGetAllVideos}
            chosenVideoId={chosenVideoId}
          />
        )}

        <div className="flex items-center justify-center">
          <div className="flex-1 pt-2" style={{ paddingRight: "70%" }}>
            <span>Hiển thị </span>
            <select
              className="rounded-md p-1 mx-1 hover:cursor-pointer"
              style={{ backgroundColor: "#E0E0E0" }}
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
            onClick={() => setIsOpenCreateVideo(true)}
          >
            <div className="flex items-center">
              <IoAddOutline className="size-8 pl-2 mr-2" />
              <span className="text-sm pr-2">Thêm Video</span>
            </div>
          </button>
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
            {videos?.map((video, index) => {
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
                      <button className="flex items-center justify-end py-3 pr-2 text-xl group">
                        <BiEdit
                          className="text-green group-hover:text-primary"
                          onClick={() => {
                            setIsOpenUpdateVideo(true);
                            setChosenVideoId(video._id);
                          }}
                        />
                      </button>
                      <button className="flex items-center justify-start p-3 text-xl group">
                        <BiTrash
                          className="text-red group-hover:text-primary"
                          onClick={() => handleDeleteVideo(video._id)}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
