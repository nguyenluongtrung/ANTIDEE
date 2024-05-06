import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createVoucher } from '../../../../features/vouchers/voucherSlice';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './CreateVoucher.css';

export const CreateVoucher = ({ setIsOpenCreateVoucher, handleGetAllVouchers }) => {
    const { isLoading: voucherLoading } = useSelector((state) => state.vouchers);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        console.log(data);
        const voucherData = {
            ...data,
        };
        const result = await dispatch(createVoucher(voucherData));
        if (result.type.endsWith('fulfilled')) {
            toast.success('Thêm voucher thành công', successStyle);
        } else if (result?.error?.message === 'Rejected') {
            toast.error(result?.payload, errorStyle);
        }
        setIsOpenCreateVoucher(false);
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
                    onClick={() => setIsOpenCreateVoucher(false)}
                />
                <p className="grid text-green font-bold text-xl justify-center">
                    TẠO VOUCHER
                </p>
                <table className="mt-3 text-sm">
                    <tbody>
                        <tr>
                            <td>
                                <span className="font-bold">Tên voucher</span>
                            </td>
                            <td className='pl-12'>

                                <input {...register('name')} className='text-center w-72 create-voucher-input'
                                    placeholder='Nhập tên voucher'></input>
                            </td>

                        </tr>
                        <tr >
                            <td className='pt-3'>
                                <span className="font-bold">Mô tả</span>
                            </td>
                            <td className='pt-3 pl-12'>

                                <input {...register('description')}
                                className='text-center create-voucher-input w-72'
                                    placeholder='Mô tả'></input>
                            </td>

                        </tr>
                        <tr>
                            <td className='pt-3'>
                                <span className="font-bold">Ngày bắt đầu</span>
                            </td>
                            <td className='pt-3 pl-12'>

                                <input {...register('startDate')}
                                className='text-center create-voucher-input w-72'                                
                                    type='date'
                                    placeholder='Ngày bắt đầu'></input>
                            </td>

                        </tr>
                        <tr>
                            <td className='pt-3'>
                                <span className="font-bold">Ngày kết thúc</span>
                            </td>
                            <td className='pt-3 pl-12'>
                                
                                <input {...register('endDate')}
                                className='text-center create-voucher-input w-72'
                                type='date' placeholder='Ngày kết thúc'></input>
                            </td>

                        </tr>
                        <tr>
                            <td className='pt-3'>
                                <span className="font-bold ">Giá trị chiết khấu</span>
                            </td>
                            <td className='pt-3 pl-12'>
                                
                                <input {...register('discountValue')}
                                className='text-center create-voucher-input w-72'
                                type='number'
                                    placeholder='Giá trị chiết khấu (%)'></input>
                            </td>

                        </tr>
                        <tr>
                            <td className='pt-3'>
                                <span className="font-bold">Số lượng</span>
                            </td>
                            <td className='pt-3 pl-12'>
                            
                                <input {...register('quantity')}
                                className='text-center create-voucher-input w-72'
                                type='number'
                                    placeholder='Số lượng'></input>
                            </td>

                        </tr>
                        <tr>
                            <td className='pt-3'>
                                <span className="font-bold">Điểm trao đổi</span>
                            </td>
                            <td className='pt-3 pl-12'>
                                
                                <input {...register('price')}
                                className='text-center create-voucher-input w-72'
                                type='number'
                                    placeholder='Điểm trao đổi'></input>
                            </td>

                        </tr>
                        <tr>
                            <td className='pt-3'>
                                <span className="font-bold">Trạng thái</span>
                            </td>
                            <td className="pl-6 py-1 pt-3">
                            <input
									type="radio"
									{...register('status')}
									value={'Đang hoạt động'}
									className="w-5"
								/>{' '}
								<span className="mr-3">Đang hoạt động</span>
								<input
									type="radio"
									{...register('status')}
							
									value={'Đã hết hạn'}
									className="w-5"
								/>{' '}
								<span>Đã hết hạn</span>
                                <input
									type="radio"
									{...register('status')}
									value={'Đã sử dụng'}
									className="w-5"
								/>{' '}
								<span>Đã sử dụng</span>
                            </td>
                        </tr>
                        <tr>
                            <td className='pt-3'>
                                <span className="font-bold">Mã giảm giá</span>
                            </td>
                            <td className='pt-3 pl-12'>
                               
                                <input  {...register('code')}
                                className='text-center create-voucher-input w-72'
                                placeholder='Mã giảm giá'></input>
                            </td>

                        </tr>
                        <tr>
                            <td className='pt-3'>
                                <span className="font-bold">Thương hiệu</span>
                            </td>
                            <td className='pt-3 pl-12'>
                               
                                <input  {...register('brand')}
                                className='text-center create-voucher-input w-72'
                                placeholder='Thương hiệu'></input>
                            </td>

                        </tr>
                    </tbody>
                </table>
                <button
                    type="submit"
                    className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
                >
                    Tạo bài thi
                </button>
            </form>
        </div>
    );
};
