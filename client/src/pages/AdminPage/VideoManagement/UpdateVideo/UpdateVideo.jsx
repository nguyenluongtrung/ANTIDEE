import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../../components";
import toast from "react-hot-toast";
import { errorStyle } from "../../../../utils/toast-customize";
import { AiOutlineClose } from "react-icons/ai";
import { updateVideo } from "../../../../features/videos/videoSlice";
import React, { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../../firebase';
export const UpdateVideo = ({
  setIsOpenUpdateVideo,
  handleGetAllVideos,
  chosenVideoId,
}) => {
  const { videos, isLoading } = useSelector((state) => state.videos);
  const [chosenVideo, setChosenVideo] = useState(
    videos[videos.findIndex((video) => video._id === chosenVideoId)]
  );

  const [isFormValid, setIsFormValid] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(chosenVideo?.url);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState('');
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    if (file.size > 50 * 1024 * 1024) {
      setFileUploadError('Dung lượng video phải nhỏ hơn 50MB');
      setFilePerc(0);
      return;
    }
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `videos/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
        setFileUploadError('');
      },
      (error) => {
        setFileUploadError(`Tải video lên thất bại: ${error.message}`);
        setFilePerc(0);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setVideoUrl(downloadURL);
          setFilePerc(100);
          setFileUploadError('');
        });
      }
    );
  };

  const title = watch("title");
  const url = watch("url");
  const description = watch("description");

  const validateForm = () => {
    const isValid =
      title && title.trim().length > 0 &&
      videoUrl && videoUrl.trim().length > 0 &&
      description && description.trim().length > 0 &&
      !/\s{2,}/.test(title) &&
      !/\s{2,}/.test(videoUrl) &&
      !/\s{2,}/.test(description);
    setIsFormValid(isValid);
  };

  useEffect(() => {
    validateForm();
  }, [title, videoUrl, description]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) return;

    const videoRef = ref(storage, `videos/${videoFile.name}`);
    await uploadBytes(videoRef, videoFile);
    const url = await getDownloadURL(videoRef);
    setVideoUrl(url);
  };

  const onSubmit = async (data) => {
     
 
    if (videoFile) {
      await uploadVideo();
    }

    const videoData = {
      title: data.title.trim(),
      url: videoUrl || chosenVideo.url,
      description: data.description.trim(),
    };

    if (videoData.url !== chosenVideo.url) {
      if (checkExistUrl(videoData.url)) {
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
    return listUrls.includes(newUrl);
  };

  if (isLoading) {
    return <Spinner />;
  }
  const urlValue = watch("url");
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
                  value={videoUrl}
                  readOnly
                  className="create-exam-input text-center"
                />
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Video ưu đãi</span>
              </td>
              <td className="pl-[30px] py-2 grid justify-center">
                <span
                  className="rounded-md rounded-customized-gray p-1 mx-auto w-[130px] text-center hover:cursor-pointer" // Loại bỏ điều kiện vô hiệu hóa
                  onClick={(e) => {
                    e.preventDefault();
                    fileRef.current.click();
                  }}
                >
                  <span>Chọn video ưu đãi</span>
                </span>

                <input
                  type="file"
                  ref={fileRef}
                  hidden
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <p className="text-sm self-center pl-2">
                  {fileUploadError ? (
                    <span className="text-red">{fileUploadError}</span>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <span className="text-gray">{`Đang tải lên ${filePerc}%`}</span>
                  ) : filePerc === 100 ? (
                    <span className="text-green">Tải video lên thành công!</span>
                  ) : (
                    ''
                  )}
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <span>Mô tả</span>
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
          type="button" // Use a button to upload the video
          onClick={uploadVideo}
          className="block bg-secondary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
        >
          Tải video lên
        </button>
        <button
          type="submit"
          className={`block ${isFormValid ? "bg-primary" : "bg-gray-300"} text-white text-center rounded-md p-2 font-medium mb-1 mt-3`}
          disabled={!isFormValid}
        >
          Cập nhật video
        </button>
      </form>
    </div>
  );
};
