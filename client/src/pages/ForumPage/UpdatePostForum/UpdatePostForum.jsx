import { useForm } from 'react-hook-form';
import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateForumPost } from '../../../features/forumPost/forumPostSlice';
import { Spinner } from '../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './UpdatePostForum.css';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../firebase';

export const UpdatePostForum = ({ setIsOpenUpdatePostForum, chosenPostForumId , handleGetAllPostForums }) => {
    const { postForums, isLoading: postForumLoading } = useSelector((state) => state.postForums || {});
    const [chosenPostForum, setChosenPostForum] = useState(
        postForums[postForums.findIndex((postForum) => postForum._id == chosenPostForumId)]
    );

    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState('');
    const [imagesUrl, setImagesUrl] = useState('');
    const [isCheckingImage, setIsCheckingImage] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();

    const dispatch = useDispatch();

    const checkThreshold = (item, threshold) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
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
        if (imagesUrl || !formData.images) {
            try {
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
                const postForumData = {
                    ...formData,
                    images: imagesUrl || formData.images,
                };
                
                const result = await dispatch(updateForumPost({ postForumData, id: chosenPostForumId }));
                if (result.type.endsWith('fulfilled')) {
                    toast.success('Cập nhật bài viết thành công', successStyle);
                } else if (result?.error?.message === 'Rejected') {
                    toast.error(result?.payload, errorStyle);
                }
                setIsOpenUpdatePostForum(false);
                handleGetAllPostForums();
            } catch (error) {
                setIsCheckingImage(false);
                toast.error(`Lỗi: ${error.message}`, errorStyle);
            }
        } else {
            toast.error('Vui lòng tải ảnh lên trước khi cập nhật bài viết', errorStyle);
        }
    };

    useEffect(() => {
        if (file) {
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
                setFileUploadError(''); 
            },
            (error) => {
                setFileUploadError('Tải ảnh lên thất bại');
                setFilePerc(0); 
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImagesUrl(downloadURL); 
                    setFilePerc(100);
                    setFileUploadError('');
                });
            }
        );
    };

    if (postForumLoading) {
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
                    onClick={() => setIsOpenUpdatePostForum(false)}
                />
                <p className="grid text-primary font-bold text-xl justify-center">
                    CẬP NHẬT BÀI VIẾT
                </p>
                <div className="mt-3">
                    <textarea
                        {...register('content', { required: 'Nội dung bài viết là bắt buộc' })}
                        className="update-postForum-input text-center text-sm w-full h-40"
                        defaultValue={chosenPostForum?.content}
                        placeholder="Cập nhật nội dung bài viết"
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
                        className="update-postForum-input w-full h-16 hidden"
                        placeholder="Ảnh"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    {filePerc > 0 && <progress value={filePerc} max="100" />}
                    {fileUploadError && <p className="text-red text-center">{fileUploadError}</p>}
                </div>
                <button
                    className="w-full bg-primary p-2 mt-5 rounded-md text-white font-bold text-sm"
                    type="submit"
                    disabled={isCheckingImage}
                >
                    {isCheckingImage ? <Spinner /> : 'CẬP NHẬT'}
                </button>
            </form>
        </div>
    );
};
``
