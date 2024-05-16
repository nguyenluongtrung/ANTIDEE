import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../../firebase';
import { useEffect, useRef, useState } from 'react';
import { createService, reset } from '../../../../features/services/serviceSlice';
import { getAllQualifications } from '../../../../features/qualifications/qualificationSlice';
import { rules } from '../../../../utils/rules';
import './CreateService.css';

export const CreateService = ({ setIsOpenCreateService, handleGetAllServices }) => {
    const { qualifications, isLoading: qualificationLoading } = useSelector((state) => state.qualifications);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState('');
    const [serviceUrl, setServiceUrl] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset: resetForm,
    } = useForm();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllQualifications());
    }, [dispatch]);

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        if (file.size > 2 * 1024 * 1024) { // Check if file size is greater than 2MB
            setFileUploadError('Dung lượng ảnh phải nhỏ hơn 2MB');
            setFilePerc(0);
            return;
        }

        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, `services/${fileName}`);
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
                    setServiceUrl(downloadURL);
                    setFilePerc(100); // Set progress to 100 on successful upload
                    setFileUploadError(''); // Reset error state on successful upload
                });
            }
        );
    };

    const onSubmit = async (data) => {
        const trimmedData = {
            ...data,
            name: data.name.trim(),  // Trim the service name
        };

        const serviceData = serviceUrl !== '' ? { ...trimmedData, image: serviceUrl } : { ...trimmedData, image: 'https://static8.depositphotos.com/1010338/959/i/450/depositphotos_9597931-stock-photo-team-gear-3d-isolated-characters.jpg' };

        const result = await dispatch(createService(serviceData));

        if (result.type.endsWith('fulfilled')) {
            toast.success('Thêm dịch vụ thành công', successStyle);
            resetForm();
            handleGetAllServices(); // Tải lại danh sách dịch vụ sau khi thêm thành công
        } else if (result?.error?.message === 'Rejected') {
            toast.error("Tên dịch vụ đã bị trùng", errorStyle);
        }

        setIsOpenCreateService(false);
        handleGetAllServices();
    };

    return (
        <div className="popup active">
            <div className="overlay"> </div>
            <form 
                onSubmit={handleSubmit(onSubmit)}
                className="content rounded-md p-5"
                style={{ width: '40vw' }}
            >
                <AiOutlineClose
                    className="absolute text-sm hover:cursor-pointer"
                    onClick={() => setIsOpenCreateService(false)}
                />
                <p className="grid text-green font-bold text-xl justify-center">
                    TẠO DỊCH VỤ
                </p>
                <table className="mt-3">
                    <tbody>
                        <tr>
                            <td>
                                <span className="font-bold">Tên dịch vụ</span>
                            </td>
                            <td className="pl-[30px] py-2">
                                <input 
                                    type="text" 
                                    {...register('name', rules.name)}
                                    className={` ${errors.name && "border-red"} create-question-input text-center ml-[60px] text-sm w-[380px]`} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Ảnh dịch vụ</span>
                            </td>
                            <td className="pl-[30px] py-2 grid justify-center">
                                <img 
                                    src={serviceUrl || 'https://static8.depositphotos.com/1010338/959/i/450/depositphotos_9597931-stock-photo-team-gear-3d-isolated-characters.jpg'}
                                    className="block mx-auto mb-1 w-[210px] h-[210px]"
                                />
                                <span
                                    className="rounded-md rounded-customized-gray p-1 mx-auto w-[130px] text-center hover:cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault(); 
                                        fileRef.current.click();
                                    }}
                                >
                                    <span>Chọn ảnh dịch vụ</span>
                                </span>
                                <input
                                    type="file"
                                    ref={fileRef}
                                    hidden
                                    onChange={(e) => {
                                        setFile(e.target.files[0]);
                                        setFileUploadError(''); // Reset error state on file change
                                    }}
                                />
                                <p className="text-sm self-center pl-2">
                                    {fileUploadError ? (
                                        <span className="text-red">
                                            {fileUploadError}
                                        </span>
                                    ) : filePerc > 0 && filePerc < 100 ? (
                                        <span className="text-gray">{`Đang tải lên ${filePerc}%`}</span>
                                    ) : filePerc === 100 ? (
                                        <span className="text-green">Tải ảnh lên thành công!</span>
                                    ) : (
                                        ''
                                    )}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Chứng chỉ</span>
                            </td>
                            <td className="pl-[30px] py-2">
                                <select
                                    {...register('requiredQualification')}
                                    className="create-question-input text-center ml-[60px] text-sm w-[380px]"
                                >
                                    {qualifications?.map((qualification) => (
                                        <option key={qualification._id} value={qualification._id}>{qualification.name}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Giá</span>
                            </td>
                            <td className="pl-[30px] py-2">
                                {/* <input type="text"
                                    {...register('description')}
                                    className="create-question-input text-center ml-[60px] text-sm w-[380px]"
                                    defaultValue={chosenService?.description}
                                /> */}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Mô tả</span>
                            </td>
                            <td className='pl-[30px] py-2'>
                                <input type="text"
                                    {...register('description')}
                                    className="create-question-input text-center ml-[60px] text-sm w-[380px]"
                                /> 
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button
                    type="submit"
                    className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
                >
                    Tạo dịch vụ
                </button>
            </form>
        </div>
    );
};
