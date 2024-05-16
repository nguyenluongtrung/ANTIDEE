import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './UpdateVoucher.css';
import { updateVoucher } from '../../../../features/vouchers/voucherSlice';
import { useEffect, useState } from 'react';
import { formatDateInput, formatDatePicker } from '../../../../utils/format';
import { rules } from '../../../../utils/rules';

export const UpdateVoucher = ({ setIsOpenUpdateVoucher, chosenVoucherId, handleGetAllVouchers }) => {
    const { vouchers, isLoading: voucherLoading } = useSelector((state) => state.vouchers);
    const [chosenVoucher, setChosenVoucher] = useState(
        vouchers[vouchers.findIndex((voucher) => voucher._id == chosenVoucherId)]
    );
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();

    useEffect(() => {
        formatDatePicker();
    })


    const onSubmit = async (data) => {
        console.log(data);
        const voucherData = {
            ...data,
        };
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
