import toast, { Toaster, ToastBar } from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import './VoucherManagement.css'
import { MdAddCircleOutline, MdOutlineRemoveRedEye } from 'react-icons/md';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteVoucher, getAllVouchers } from '../../../features/vouchers/voucherSlice';
import { Spinner } from '../../../components';
import { VoucherDetail } from './VoucherDetail/VoucherDetail';
import { UpdateVoucher } from './UpdateVoucher/UpdateVoucher';
import { CreateVoucher } from './CreateVoucher/CreateVoucher';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { IoAddOutline } from 'react-icons/io5';

export const VoucherManagement = () => {
    const [isOpenCreateVoucher, setIsOpenCreateVoucher] = useState(false);
    const [isOpenUpdateVoucher, setIsOpenUpdateVoucher] = useState(false);
    const [isOpenDetailVoucher, setIsOpenDetailVoucher] = useState(false);
    const [chosenVoucherId, setChosenVoucherId] = useState('');
    const { vouchers, isLoading } = useSelector((state) => state.vouchers);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllVouchers());
    }, []);

    // delete voucher
    const handleDeleteVoucher = async (id) => {
        const result = await dispatch(deleteVoucher(id));
        if (result.type.endsWith('fulfilled')) {
            toast.success('Xoá voucher thành công', successStyle);
        } else if (result?.error?.message === 'Rejected') {
            toast.error(result?.payload, errorStyle);
        }
    };

    const handleGetAllVouchers = () => {
        Promise.all([dispatch(getAllVouchers())]).catch((error) => {
            console.error('Error during dispatch:', error);
        });
    };

    if (isLoading) {
        return <Spinner />;
    }
    return (
        <div className="w-full min-h-screen bg-white flex flex-row">
            <AdminSidebar />
            <div className="flex-1 px-10 pt-5">
                <Toaster>
                    {(t) => (
                        <ToastBar
                            toast={t}
                            style={{
                                ...t.style,
                                animation: t.visible
                                    ? 'custom-enter 1s ease'
                                    : 'custom-exit 1s ease',
                            }}
                        />
                    )}
                </Toaster>
                {isOpenCreateVoucher && (
                    <CreateVoucher
                        setIsOpenCreateVoucher={setIsOpenCreateVoucher}
                        handleGetAllVouchers={handleGetAllVouchers}
                    />
                )}
                {isOpenUpdateVoucher && (
                    <UpdateVoucher
                        setIsOpenUpdateVoucher={setIsOpenUpdateVoucher}
                        handleGetAllVouchers={handleGetAllVouchers}
                        chosenVoucherId={chosenVoucherId}
                    />
                )}
                {isOpenDetailVoucher && (
                    <VoucherDetail
                        setIsOpenDetailVoucher={setIsOpenDetailVoucher}
                        handleGetAllVouchers={handleGetAllVouchers}
                        chosenVoucherId={chosenVoucherId}
                    />
                )}

                <div className="flex">
                    <div className="flex-1 pt-2">
                        <span>Hiển thị </span>
                        <select
                            className="rounded-md p-1 mx-1 hover:cursor-pointer"
                            style={{ backgroundColor: '#E0E0E0' }}
                        >
                            <option>10</option>
                            <option>20</option>
                            <option>30</option>
                        </select>
                        <span> hàng</span>
                    </div>
                    <button

                        className="bg-pink text-white rounded-md block mx-auto"
                        style={{ width: '150px' }}
                        onClick={() => setIsOpenCreateVoucher(true)}
                    >
                        <div className="flex items-center">
                            <IoAddOutline className='size-8 pl-2 mr-2' />
                            <span className="text-sm pr-2">Thêm voucher</span>
                        </div>


                    </button>
                </div>
                <table className="w-full border-b border-gray mt-3">
                    <thead>
                        <tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
                            <td className="py-2 px-4 text-center font-bold">STT</td>
                            <td className="py-2 px-4 text-center font-bold">Tên voucher</td>
                            <td className="py-2 px-4 text-center font-bold">Giá trị chiết khấu(%)</td>
                            <td className="py-2 px-4 text-center font-bold">Điểm trao đổi</td>
                            <td className="py-2 px-4 text-center font-bold">Trạng thái</td>
                            <td className="py-2 px-4 text-center font-bold">Thương hiệu</td>
                            <td className="py-2 px-4 text-center font-bold">Chi tiết</td>
                            <td className="py-2 px-4 text-center font-bold">Hành Động</td>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers?.map((voucher, index) => {
                            return (
                                <tr className="hover:bg-light_purple transition-colors group odd:bg-light_purple hover:cursor-pointer">
                                    <td className="font-medium text-center text-gray p-3">
                                        <span>{index + 1}</span>
                                    </td>
                                    <td className="font-medium text-center text-gray">
                                        <span>{voucher?.name}</span>

                                    </td>
                                    <td className="font-medium text-center text-gray">
                                        <span>{voucher?.discountValue}</span>
                                    </td>
                                    <td className="font-medium text-center text-gray">
                                        <span>{voucher?.price}</span>
                                    </td>
                                    <td>
                                        <span >
                                            <div className={`text-center p-2 rounded-full font-semibold text-sm 
                                        ${new Date(voucher?.endDate)?.getTime() >= new Date().getTime()
                                                    ? 'bg-green bg-opacity-25 text-green'
                                                    : 'bg-red bg-opacity-25 text-red'}`
                                            }>
                                                {new Date(voucher?.endDate)?.getTime() >= new Date().getTime() ? 'Đang hoạt động' : 'Đã hết hạn'}
                                            </div>

                                        </span>
                                    </td>
                                    <td className="font-medium text-center text-gray">
                                        <span>{voucher?.brand}</span>
                                    </td>
                                    <td className="font-medium text-center text-gray">
                                        <button
                                            className="hover:cursor-pointer text-xl pt-1.5"
                                            onClick={() => {
                                                setIsOpenDetailVoucher(true);
                                                setChosenVoucherId(voucher._id);
                                            }}>
                                            <MdOutlineRemoveRedEye className="block mx-auto" />
                                        </button>
                                    </td>
                                    <td className="">
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="flex items-center justify-end py-3 pr-2 text-xl"
                                                onClick={() => {
                                                    setIsOpenUpdateVoucher(true);
                                                    setChosenVoucherId(voucher._id);
                                                }}
                                            >
                                                <BiEdit className="text-green" />
                                            </button>
                                            <button className="flex items-center justify-start py-3 pl-2 text-xl">
                                                <BiTrash
                                                    className="text-red"
                                                    onClick={() => handleDeleteVoucher(voucher._id)}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

    );
}
