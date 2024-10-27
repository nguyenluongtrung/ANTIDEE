import { useForm } from "react-hook-form";
import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../../components";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../../../utils/toast-customize";
import { AiOutlineClose } from "react-icons/ai";
import { createVideo } from "../../../../features/videos/videoSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../../firebase';

export const CreateVideo = ({ setIsOpenCreateVideo, handleGetAllVideos }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,  
  } = useForm();

  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

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

  const onSubmit = async (data) => {
    const videoData = {
      title: data.title.trim(),
      url: videoUrl || data.url,   
      description: data.description.trim(),
    };

    const { title, description } = videoData;

    if (!title.trim()) {
      toast.error('Vui lòng nhập "Tiêu Đề"', errorStyle);
      return;
    }
    if (/ {2,}/.test(title)) {
      toast.error("Tiêu đề không được chứa khoảng trắng !!!", errorStyle);
      return;
    }
    if (!description.trim()) {
      toast.error('Vui lòng nhập "Mô tả" chứng chỉ', errorStyle);
      return;
    }
    if (/ {2,}/.test(description)) {
      toast.error("Mô tả không được chứa khoảng trắng !!!", errorStyle);
      return;
    }

    const result = await dispatch(createVideo(videoData));
    if (result.type.endsWith("fulfilled")) {
      toast.success("Thêm Video thành công", successStyle);
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
    setIsOpenCreateVideo(false);
    handleGetAllVideos();
  };
 
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
          onClick={() => setIsOpenCreateVideo(false)}
        />
        <p className="grid text-green font-bold text-xl justify-center">
          TẠO VIDEO
        </p>
        <table className="mt-3">
          <tbody>
            <tr>
              <td>
                <span>Tiêu đề</span>
              </td>
              <td className="pl-6 py-1 w-96">
                <input
                  type="text"
                  {...register("title")}
                  className="create-exam-input text-center"
                />
              </td>
            </tr>
            <tr>
              <td>
                <span>Đường dẫn</span>
              </td>
              <td className="pl-6 py-1 w-96">
                <input
                  type="text"
                  {...register("url")}
                  className="create-exam-input text-center"
                  disabled={Boolean(videoUrl)}  
                />
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Video ưu đãi</span>
              </td>
              <td className="pl-[30px] py-2 grid justify-center">
                <span
                  className={`rounded-md rounded-customized-gray p-1 mx-auto w-[130px] text-center hover:cursor-pointer ${urlValue ? 'opacity-50 cursor-not-allowed' : ''}`} // Thêm điều kiện vô hiệu hóa
                  onClick={(e) => {
                    if (!urlValue) {  
                      e.preventDefault();
                      fileRef.current.click();
                    }
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
          Thêm video
        </button>
      </form>
    </div>
  );
};
