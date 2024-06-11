import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../../components";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../../../utils/toast-customize";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import { updateVideo } from "../../../../features/videos/videoSlice";

export const UpdateVideo = ({
  setIsOpenUpdateVideo,
  handleGetAllVideos,
  chosenVideoId,
}) => {
  const { videos, isLoading } = useSelector((state) => state.videos);
  const [chosenVideo, setChosenVideo] = useState(
    videos[videos.findIndex((video) => video._id == chosenVideoId)]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    const videoData = {
      title: data.title.trim(),
      url: data.url.trim(),
      description: data.description.trim(),
    };

    const { title, url, description } = videoData;

    if (!title.trim()) {
      toast.error('Vui lòng nhập "Tiêu Đề"', errorStyle);
      return;
    }
    if (/ {2,}/.test(title)) {
      toast.error("Tiêu đề không được chứa khoảng trắng !!!", errorStyle);
      return;
    }
    if (!url.trim()) {
      toast.error('Vui lòng nhập "Đường dẫn Youtube"', errorStyle);
      return;
    }
    if (/ {2,}/.test(url)) {
      toast.error("Đường dẫn không được chứa khoảng trắng !!!", errorStyle);
      return;
    }
    if (!description.trim()) {
      toast.error('Vui lòng nhập "Mô tả" video', errorStyle);
      return;
    }
    if (/ {2,}/.test(description)) {
      toast.error("Mô tả không được chứa khoảng trắng !!!", errorStyle);
      return;
    }

    if (url !== chosenVideo.url) {
      if (checkExistUrl(url)) {
        toast.error("Đường dẫn đã tồn tại", errorStyle);
        return;
      }
    }

    const result = await dispatch(
      updateVideo({
        videoData: videoData,
        id: chosenVideoId,
      })
    );
    if (result.type.endsWith("fulfilled")) {
      toast.success("Cập nhật Video thành công");
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
    setIsOpenUpdateVideo(false);
    handleGetAllVideos();
  };

  const checkExistUrl = (newUrl) => {
    const listUrls = videos.map((item) => item.url);
    if (listUrls.includes(newUrl)) {
      return true;
    } else {
      return false;
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="popup active">
      <div className="overlay"></div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="content rounded-md p-5"
        style={{ width: "35vw" }}
      >
        <AiOutlineClose
          className="absolute text-sm hover:cursor-pointer"
          onClick={() => setIsOpenUpdateVideo(false)}
        />
        <p className="grid text-green font-bold text-xl justify-center">
          CẬP NHẬT VIDEO
        </p>
        <table className="mt-3">
          <tbody>
            <tr>
              <td>
                <span>Tiêu đề</span>
              </td>
              <td className="pl-6 py-1 w-80">
                <input
                  type="text"
                  {...register("title")}
                  defaultValue={chosenVideo?.title}
                  className="create-exam-input text-center"
                />
              </td>
            </tr>
            <tr>
              <td>
                <span>Đường dẫn</span>
              </td>
              <td className="pl-6 py-1 w-80">
                <input
                  type="text"
                  {...register("url")}
                  defaultValue={chosenVideo?.url}
                  className="create-exam-input text-center"
                />
              </td>
            </tr>
            <tr>
              <td>
                <span className="">Mô tả</span>
              </td>
              <td className="pl-6 py-1">
                <textarea
                  type="text"
                  {...register("description")}
                  defaultValue={chosenVideo?.description}
                  className="create-exam-textarea text-center"
                  rows="3"
                  cols="40"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="submit"
          className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
        >
          Cập nhật video
        </button>
      </form>
    </div>
  );
};
