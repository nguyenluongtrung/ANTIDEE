import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../../components";
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import { errorStyle } from "../../../../utils/toast-customize";
import { AiOutlineClose } from "react-icons/ai";
import { getAllVideos, getVideo, updateVideo } from "../../../../features/videos/videoSlice";
import React, { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../../../firebase';

export const UpdateVideo = () => {
  const params = useParams();
  const [videos, setVideos] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { },
  } = useForm();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.videos.isLoading);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    if (file.size > 50 * 1024 * 1024) {
      setFileUploadError('Dung lượng video phải nhỏ hơn 50MB');
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
      },
      (error) => {
        setFileUploadError(`Tải video lên thất bại: ${error.message}`);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setVideoUrl(downloadURL);
          setFilePerc(100);
        });
      }
    );
  };

  useEffect(() => {
    const handleFetchVideo = async () => {
      const resultFetchVideo = await dispatch(getAllVideos());
      setVideos(resultFetchVideo.payload);
    };
    handleFetchVideo();
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: ''
  });

  useEffect(() => {
    const fetchVideo = async () => {
      const resultFetchVideo = await dispatch(getVideo(params.videoId));
      if (resultFetchVideo.type.endsWith('fulfilled')) {
        const video = resultFetchVideo.payload;
        setFormData({
          title: video.title,
          url: video.url,
          description: video.description,
        });
      }
    }
    fetchVideo();
  }, [params.videoId]);

  const handleFormChange = (field, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: value
    }));
  };

  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    const videoData = { ...formData, url: videoUrl || formData.url }; // Cập nhật URL nếu có video mới
    const resultCreateVideo = await dispatch(updateVideo({ videoData, id: params.videoId }));
    if (resultCreateVideo.type.endsWith('fulfilled')) {
      navigate("/admin-video");
      toast.success('Cập nhật video thành công');
    } else if (resultCreateVideo?.error?.message === 'Rejected') {
      toast.error(resultCreateVideo?.payload);
    }
  };
  const urlValue = watch("url");
  return (
    <div className='w-full min-h-screen bg-[#F6F7FB] p-6 flex flex-row'>
      <div>
        <AdminSidebar />
      </div>
      <div className="flex-1 bg-white rounded-lg shadow-md p-6 max-w-[1600px] mx-auto">
        <div className='flex items-center mb-10 text-2xl font-bold'>Đang <p className='text-primary text-2xl px-2'>{params.videoId ? 'Cập nhật' : 'Tạo mới'}</p>  video </div>

        <form >
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Tiêu đề</label>
              <input
                className="shadow appearance-none border py-3 px-3 rounded"
                value={formData.title}
                onChange={e => handleFormChange('title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Đường dẫn</label>
              <input
                type="text"
                value={videoUrl || formData.url} // Hiển thị link video mới hoặc cũ
                readOnly
                className="create-exam-input text-center"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Tải video lên từ máy tính </label>
              <div
                className={`block w-full px-4 py-2 border border-gray-300 rounded-lg text-center cursor-pointer ${urlValue ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                onClick={(e) => {
                  if (!urlValue) {
                    e.preventDefault();
                    fileRef.current.click();
                  }
                }}
              >
                Chọn video
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
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-primary focus:outline-none"
                value={formData.description}
                onChange={e => handleFormChange('description', e.target.value)}
              />
            </div>
          </div>
          <button onClick={handleUpdateVideo}
            type="submit"
            className="block w-full bg-primary text-white rounded-lg py-2 mt-6 font-medium hover:bg-primary-dark transition duration-300"
          >
            Cập nhật video
          </button>

        </form>
      </div>
    </div>
  );
};
