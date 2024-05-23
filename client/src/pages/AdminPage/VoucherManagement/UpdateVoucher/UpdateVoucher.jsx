import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './UpdateVoucher.css';
import { updateVoucher } from '../../../../features/vouchers/voucherSlice';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../../firebase';
import { useEffect, useRef, useState } from 'react';
import { formatDateInput, formatDatePicker } from '../../../../utils/format';
import { rules } from '../../../../utils/rules';

export const UpdateVoucher = ({ setIsOpenUpdateVoucher, chosenVoucherId, handleGetAllVouchers }) => {
    const { vouchers, isLoading: voucherLoading } = useSelector((state) => state.vouchers);
    const [chosenVoucher, setChosenVoucher] = useState(
        vouchers[vouchers.findIndex((voucher) => voucher._id == chosenVoucherId)]
    );
    const fileRef = useRef(null);
	const [file, setFile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [voucherUrl, setVoucherUrl] = useState(''); 
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();

    useEffect(() => {
        formatDatePicker();
    })
    useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
	}, [file]);
    const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, `vouchers/${fileName}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePerc(Math.round(progress));
			},
			(error) => {
				setFileUploadError(true);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
					setVoucherUrl(downloadURL)
				);
			}
		);
	};

    const onSubmit = async (data) => {
        console.log(data);
        const trimmedData = {
			...data,
			name: data.name.trim(),  // Trim the voucher name
		};
		const voucherData = voucherUrl !== '' ? { ...trimmedData, image: voucherUrl } : { ...trimmedData };

        const result = await dispatch(updateVoucher({ voucherData, id: chosenVoucherId }));
        if (result.type.endsWith('fulfilled')) {
            toast.success('Cập nhật voucher thành công', successStyle);
        } else if (result?.error?.message === 'Rejected') {
            toast.error(result?.payload, errorStyle);
        }
        setIsOpenUpdateVoucher(false);
        handleGetAllVouchers();
    };

    if (voucherLoading) {
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
                    onClick={() => setIsOpenUpdateVoucher(false)}
                />
                <p className="grid text-green font-bold text-xl justify-center">
                    CẬP NHẬT VOUCHER
                </p>
                <table className="mt-3 text-sm">
                    <tbody>
                        <tr>
                            <td >
                                <span className='font-bold'>Tên voucher</span>
                            </td>
                            <td>
                                <input
                                    {...register('name', rules.name)}
                                    className={`ml-6 py-1 update-voucher-input text-center w-80 ${errors.name ? 'error-border' : ''}`}
                                    defaultValue={chosenVoucher?.name}
                                >
                                </input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Ảnh ưu đãi</span>
                            </td>
                            <td className="pl-[30px] py-2 grid justify-center">
                                <img 
                                   src={voucherUrl || chosenVoucher?.image || 'https://static8.depositphotos.com/1010338/959/i/450/depositphotos_9597931-stock-photo-team-gear-3d-isolated-characters.jpg'}
                                   className="block mx-auto mb-1 w-[210px] h-[210px]"
                                />
                                <span
                                    className="rounded-md rounded-customized-gray p-1 mx-auto w-[130px] text-center hover:cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault(); 
                                        fileRef.current.click();
                                    }}
                                >
                                    <span>Chọn ảnh ưu đãi</span>
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
                                {' '}
                                <span className="font-bold">Mô tả</span>
                            </td>
                            <td className="pl-6 py-1" >
                                <input
                                    {...register('description', rules.description)}
                                    defaultValue={chosenVoucher?.description}
                                    className={`text-sm update-voucher-input text-center ${errors.description ? 'error-border' : ''}`}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Ngày bắt đầu</span>
                            </td>
                            <td className="pl-6 py-1">
                                <input
                                    {...register('startDate', rules.startDate)}
                                    type="date"
                                    defaultValue={formatDateInput(chosenVoucher?.startDate)}
                                    className={`update-voucher-input text-center ${(errors.startDate) ? 'error-input' : ''}`}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Ngày kết thúc</span>
                            </td>
                            <td className="pl-6 py-1">
                                <input
                                    {...register('endDate', rules.endDate)}
                                    type="date"
                                    defaultValue={formatDateInput(chosenVoucher?.endDate)}
                                    className={`update-voucher-input text-center ${(errors.endDate) ? 'error-input' : ''}`}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Giá trị chiết khấu</span>
                            </td>
                            <td className="pl-6 py-1">
                                <input
                                    type="text"
                                    {...register('discountValue', rules.discountValue)}
                                    defaultValue={chosenVoucher?.discountValue}
                                    className={`update-voucher-input text-center pr-3.5 ${(errors.discountValue) ? 'error-input' : ''}`}
                                />
                               
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {' '}
                                <span className="font-bold">Số lượng</span>
                            </td>
                            <td className="pl-6 py-1">
                                <input
                                    type="number"
                                    {...register('quantity', rules.quantity)}
                                    defaultValue={
                                        chosenVoucher?.quantity
                                    }
                                    className={`update-voucher-input text-center ${(errors.quantity) ? 'error-input' : ''}`}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Điểm trao đổi</span>
                            </td>
                            <td className="pl-6 py-1">
                                <input
                                    type="number"
                                    {...register('price', rules.price)}
                                    defaultValue={
                                        chosenVoucher?.price
                                    }
                                    className={`update-voucher-input text-center ${(errors.price) ? 'error-input' : ''}`}
                                />
                                
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Mã giảm giá</span>
                            </td>
                            <td className="pl-6 py-1">
                                <input
                                    type="text"
                                    {...register('code', rules.code)}
                                    defaultValue={
                                        chosenVoucher?.code
                                    }
                                    className={`update-voucher-input text-center ${(errors.code) ? 'error-input' : ''}`}
                                />
                                {errors.code && (
                                    <p className="text-red small-text text-sm">{errors.code.message}</p>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Thương hiệu</span>
                            </td>
                            <td className="pl-6 py-1">
                                <input
                                    type="text"
                                    {...register('brand', rules.brand)}
                                    defaultValue={
                                        chosenVoucher?.brand
                                    }
                                    className={`update-voucher-input text-center ${(errors.brand) ? 'error-input' : ''}`}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button
                    type="submit"
                    className="block bg-primary
                     text-white text-center 
                     rounded-md p-2 font-medium mb-1 mt-3 hover:bg-primary_dark">
                    Cập nhật voucher
                </button>
            </form>
        </div>
    );
};
