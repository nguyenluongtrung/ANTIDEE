import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './UpdateVoucher.css';
import { updateVoucher } from '../../../../features/vouchers/voucherSlice';
import { useEffect, useState } from 'react';
import { formatDate, formatDateInput } from '../../../../utils/format';

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

    const onSubmit = async (data) => {
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
                                    {...register('name')}
                                    className="ml-6 py-1 update-voucher-input hover:cursor-pointer text-center"
                                    defaultValue={chosenVoucher?.name}
                                    style={{width: '93%'}}
                                >
                                </input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {' '}
                                <span  className="font-bold">Mô tả</span>
                            </td>
                            <td className="pl-6 py-1" >
                                <input
                                    {...register('description')}
                                    defaultValue={chosenVoucher?.description}
                                    className="text-sm update-voucher-input text-center"
                                />{' '}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Ngày bắt đầu</span>
                            </td>
                            <td className="pl-6 py-1">
                                <input
                                    {...register('startDate')}
                                    type="date"
                                    defaultValue={formatDateInput(chosenVoucher?.startDate)}
                                    className="update-voucher-input text-center"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Ngày kết thúc</span>
                            </td>
                            <td className="pl-6 py-1">
                                <input
                                    {...register('endDate')}
                                    type="date"
                                    defaultValue={formatDateInput(chosenVoucher?.endDate)}
                                    className="update-voucher-input text-center"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Giá trị chiết khấu</span>
                            </td>
                            <td className="pl-6 py-1">
                                <input
                                    type="number"
                                    {...register('discountValue')}
                                    defaultValue={chosenVoucher?.discountValue}
                                    className="update-voucher-input text-center"
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
                                    {...register('quantity')}
                                    defaultValue={
                                        chosenVoucher?.quantity
                                    }
                                    className="update-voucher-input text-center"
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
                                    {...register('price')}
                                    defaultValue={
                                        chosenVoucher?.price
                                    }
                                    className="update-voucher-input text-center"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Trạng thái</span>
                            </td>
                            <td className="pl-6 py-1">
                            <input
									type="radio"
									{...register('status')}
									defaultChecked={chosenVoucher?.status == 'Đang hoạt động'}
									value={'Đang hoạt động'}
									className="w-5"
								/>{' '}
								<span className="mr-3">Đang hoạt động</span>
								<input
									type="radio"
									{...register('status')}
									defaultChecked={chosenVoucher?.status == 'Đã hết hạn'}
									value={'Đã hết hạn'}
									className="w-5"
								/>{' '}
								<span>Đã hết hạn</span>
                                <input
									type="radio"
									{...register('status')}
									defaultChecked={chosenVoucher?.status == 'Đã sử dụng'}
									value={'Đã sử dụng'}
									className="w-5"
								/>{' '}
								<span>Đã sử dụng</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Mã giảm giá</span>
                            </td>
                            <td className="pl-6 py-1">
                                <input
                                    type="text"
                                    {...register('code')}
                                    defaultValue={
                                        chosenVoucher?.code
                                    }
                                    className="update-voucher-input text-center"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="font-bold">Thương hiệu</span>
                            </td>
                            <td className="pl-6 py-1">
                                <input
                                    type="text"
                                    {...register('brand')}
                                    defaultValue={
                                        chosenVoucher?.brand
                                    }
                                    className="update-voucher-input text-center"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button
                    type="submit"
                    className="block bg-primary
                     text-white text-center 
                     rounded-md p-2 font-medium mb-1 mt-3">
                    Cập nhật voucher
                </button>
            </form>
        </div>
    );
};
