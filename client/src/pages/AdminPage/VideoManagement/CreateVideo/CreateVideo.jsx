import { useForm } from "react-hook-form";
import React, { useRef, useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
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

export const CreateVideo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,  
  } = useForm();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      navigate('/admin-video')
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
  };
 
  const urlValue = watch("url");

  return (
    <div className="w-full min-h-screen bg-[#F6F7FB] p-6 flex flex-row">
      <AdminSidebar />
      <div className="flex-1 bg-white rounded-lg shadow-md p-6 max-w-[1600px] mx-auto">
      <div className='flex items-center mb-10 text-2xl font-bold'>Đang <p className='text-primary text-2xl px-2'>{params.videoId ? 'Cập nhật' : 'Tạo mới'}</p>  video </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Tiêu đề</label>
              <input
                type="text"
                {...register("title")}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Đường dẫn</label>
              <input
                type="text"
                {...register("url")}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-primary focus:outline-none"
                disabled={Boolean(videoUrl)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Video ưu đãi</label>
              <div
                className={`block w-full px-4 py-2 border border-gray-300 rounded-lg text-center cursor-pointer ${
                  urlValue ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={(e) => {
                  if (!urlValue) {  
                    e.preventDefault();
                    fileRef.current.click();
                  }
                }}
              >
                Chọn video ưu đãi
              </div>
              <input
                type="file"
                ref={fileRef}
                hidden
                accept="video/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <p className="text-sm mt-1">
                {fileUploadError ? (
                  <span className="text-red ">{fileUploadError}</span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className="text-gray ">{`Đang tải lên ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                  <span className="text-green ">Tải video lên thành công!</span>
                ) : (
                  ''
                )}
              </p>
            </div>
            <div>
              <label className="block text-gray  font-medium mb-1">Mô tả</label>
              <textarea
                {...register("description")}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-primary focus:outline-none"
                rows="3"
              />
            </div>
          </div>
          <button
            type="submit"
            className="block w-full bg-primary text-white rounded-lg py-2 mt-6 font-medium hover:bg-primary-dark transition duration-300"
          >
            Thêm video
          </button>
        </form>
      </div>
    </div>
  );
};
