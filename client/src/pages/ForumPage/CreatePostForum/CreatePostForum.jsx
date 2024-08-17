import { useForm } from 'react-hook-form';
import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createForumPost, getAllForumPosts } from '../../../features/forumPost/forumPostSlice';
import { Spinner } from '../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './CreatePostForum.css';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../firebase';

export const CreatePostForum = ({ setIsOpenCreateForumPost, handleGetAllForumPosts }) => {
    const { isLoading: forumPostLoading, forumPosts } = useSelector((state) => state.forumPosts);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm();

    const dispatch = useDispatch();

    useEffect(() => {
        if (!forumPosts || forumPosts.length === 0) {
            dispatch(getAllForumPosts());
        }
    }, [dispatch, forumPosts]);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState('');
    const [imagesUrl, setImagesUrl] = useState('');
    const [isCheckingImage, setIsCheckingImage] = useState(false);
    const checkThreshold = (item, threshold) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
            // Loại bỏ thuộc tính 'indoor_other' và 'outdoor_other' khỏi đối tượng nudity.context
            if (item.hasOwnProperty('indoor_other')) {
                delete item.indoor_other;
            }
            if (item.hasOwnProperty('outdoor_other')) {
                delete item.outdoor_other;
            }

            return Object.values(item).some(value => value > threshold);
        } else if (Array.isArray(item)) {
            return item.some(value => value > threshold);
        }
        return false;
    };

    const onSubmit = async (formData) => {
        if (imagesUrl || !formData.images) { // Điều kiện kiểm tra nếu ảnh không bắt buộc
            try {
                // Gọi API kiểm duyệt hình ảnh nếu có ảnh
                setIsCheckingImage(true);
                if (imagesUrl) {
                    const response = await axios.get('https://api.sightengine.com/1.0/check.json', {
                        params: {
                            url: imagesUrl,
                            models: 'nudity-2.1,weapon,text-content,face-attributes,gore-2.0,tobacco,violence,self-harm,gambling',
                            api_user: '36950956',
                            api_secret: 'FkPHdBHxik6823yZw5Nms9uDV9wjVQjY',
                        }
                    });
    
                    const data = response.data;
                    console.log(data); // Kiểm tra kết quả từ API

                    const thresholds = {
                        nudity: 0.2,
                        weapon: 0.4,
                        text_content: 0.4,
                        face_attributes: 0.4,
                        gore: 0.4,
                        tobacco: 0.4,
                        violence: 0.4,
                        self_harm: 0.4,
                        gambling: 0.4
                    };
    
                    let warnings = [];
                    let isImageValid = true;
    
                    if (data.weapon && checkThreshold(data.weapon.classes, thresholds.weapon)) {
                        isImageValid = false;
                        warnings.push('Ảnh chứa vũ khí.');
                    }
                    if (data.text_content && checkThreshold(data.text_content, thresholds.text_content)) {
                        isImageValid = false;
                        warnings.push('Ảnh chứa nội dung văn bản không phù hợp.');
                    }
                    if (data.face_attributes && checkThreshold(data.face_attributes, thresholds.face_attributes)) {
                        isImageValid = false;
                        warnings.push('Ảnh chứa thông tin về đặc điểm khuôn mặt không phù hợp.');
                    }
                    if (data.gore && checkThreshold(data.gore, thresholds.gore)) {
                        isImageValid = false;
                        warnings.push('Ảnh chứa nội dung máu me hoặc bạo lực.');
                    }
                    if (data.tobacco && checkThreshold(data.tobacco, thresholds.tobacco)) {
                        isImageValid = false;
                        warnings.push('Ảnh chứa nội dung thuốc lá hoặc thuốc lá điện tử.');
                    }
                    if (data.nudity && checkThreshold(data.nudity.context, thresholds.nudity)) {
                        isImageValid = false;
                        warnings.push('Ảnh chứa nội dung khiêu dâm.');
                    }
                    if (data.violence && checkThreshold(data.violence, thresholds.violence)) {
                        isImageValid = false;
                        warnings.push('Ảnh chứa bạo lực.');
                    }
                    if (data.self_harm && checkThreshold(data.self_harm, thresholds.self_harm)) {
                        isImageValid = false;
                        warnings.push('Ảnh chứa hành vi tự hại.');
                    }
                    if (data.gambling && checkThreshold(data.gambling, thresholds.gambling)) {
                        isImageValid = false;
                        warnings.push('Ảnh chứa nội dung cờ bạc.');
                    }
    
                    if (!isImageValid) {
                        throw new Error(warnings.join(' '));
                    }
                }
                setIsCheckingImage(false);
                // Tạo bài đăng nếu ảnh được duyệt hoặc không có ảnh
                const forumPostData = {
                    ...formData,
                    images: imagesUrl || formData.images, // Đảm bảo trường ảnh không rỗng nếu không có ảnh
                };
                console.log('Forum Post Data:', forumPostData); // Kiểm tra dữ liệu gửi
                const result = await dispatch(createForumPost(forumPostData));
                if (result.type.endsWith('fulfilled')) {
                    toast.success('Đăng bài thành công', successStyle);
                } else if (result?.error?.message === 'Rejected') {
                    toast.error(result?.payload, errorStyle);
                }
                setIsOpenCreateForumPost(false);
                handleGetAllForumPosts();
            } catch (error) {
                setIsCheckingImage(false);
                toast.error(`Lỗi: ${error.message}`, errorStyle);
            }
        } else {
            toast.error('Vui lòng tải ảnh lên trước khi đăng bài', errorStyle);
        }
    };
    


    useEffect(() => {
		if (file) {
			setFileUploadError(false);
			handleFileUpload(file);
		}
	}, [file]);

    const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, `images/${fileName}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
                setFileUploadError(''); // Reset error state on new upload
            },
            (error) => {
                setFileUploadError('Tải ảnh lên thất bại');
                setFilePerc(0); // Reset progress on error
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('Download URL:', downloadURL);
                    setImagesUrl(downloadURL); // Thay vì setServiceUrl, sử dụng setImagesUrl
                    setFilePerc(100); // Set progress to 100 on successful upload
                    setFileUploadError(''); // Reset error state on successful upload
                });
            }
        );
    };
    if (forumPostLoading) {
      return <Spinner />;
  }

    return (
        <div className="popup active">
            <div className="overlay"></div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="content rounded-md p-5"
                style={{ width: '35vw' }}
            >
                <AiOutlineClose
                    className="absolute text-sm hover:cursor-pointer"
                    onClick={() => setIsOpenCreateForumPost(false)}
                />
                <p className="grid text-primary font-bold text-xl justify-center">
                    TẠO BÀI VIẾT
                </p>
                <div className="mt-3">
                    <textarea
                        {...register('content', { required: 'Nội dung bài viết là bắt buộc' })}
                        className="create-forumPost-input text-center text-sm w-full h-40"
                        placeholder="Bạn đang nghĩ gì thế?"
                        required
                    />
                    {errors.content && <p className="text-red text-center">{errors.content.message}</p>}
                </div>
                <div className="mt-3">
                
                        <span
                                    className="block bg-white rounded-md cursor-pointer text-primary justify-center border p-2 text-sm"
                                    onClick={() => fileRef.current.click()}
                                >
                                    Chọn ảnh
                                </span>
                            
                    <input
                        ref={fileRef}
                        className="create-forumPost-input w-full h-16 hidden"
                        placeholder="Ảnh"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    {filePerc > 0 && <span> Đang tải ảnh lên: {filePerc}%</span>}
                    {fileUploadError && <p className="text-red">{fileUploadError}</p>}
                </div>
                {imagesUrl && (
                    <div className="mt-3 image-preview">
                        <img src={imagesUrl} alt="Preview" className="w-[40%] max-h-96 object-contain" />
                    </div>
                )}
                <div className="flex mt-3 justify-center">
                <button
    className="btn-submit bg-primary w-full h-10 text-white p-2 rounded-md hover:bg-primary-dark"
    type="submit"
    disabled={isCheckingImage || forumPostLoading}
>
    {isCheckingImage ? (
        <>
            <Spinner /> Đang kiểm tra hình ảnh
        </>
    ) : 'Đăng bài'}
</button>
                </div>
            </form>
        </div>
    );
};

