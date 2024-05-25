import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../components/Spinner/Spinner';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { formatDate } from '../../../utils/format';
import { getAllVouchers, redeemVoucher } from '../../../features/vouchers/voucherSlice';

export const VoucherDetail = ({ chosenVoucherId, setIsOpenDetailVoucher, handleGetAllVouchers }) => {
    const { vouchers, isLoading: voucherLoading } = useSelector((state) => state.vouchers);
    const { account, isLoading: isAuthLoading } = useSelector((state) => state.auth);
    const [chosenVoucher, setChosenVoucher] = useState();



    async function initiateVouchers() {
        let output = await dispatch(getAllVouchers());

        setChosenVoucher(output.payload[output.payload.findIndex((voucher) =>
            String(voucher._id) === String(chosenVoucherId))]);

    }

    useEffect(() => {
        initiateVouchers();
    }, []);



    const dispatch = useDispatch();
    const handleRedeemVoucher = async (userId, voucherId) => {
        console.log(userId, voucherId);
        const result = await dispatch(redeemVoucher({ userId, voucherId }));

        if (result.type.endsWith('fulfilled')) {
            toast.success('Nhận voucher thành công', successStyle);
        } else if (result?.error?.message === 'Rejected') {
            toast.error(result?.payload, errorStyle);
            setIsOpenDetailVoucher(false);
            handleGetAllVouchers();
        }
    }


    if (voucherLoading || isAuthLoading) {
        return <Spinner />;
    }

    function getStatusColor(status) {
        let backgroundColor = '';
        if (status === 'Đang hoạt động') {
            backgroundColor = 'text-green font-semibold';
        } else if (status === 'Đã hết hạn') {
            backgroundColor = 'text-red font-semibold';
        }
        return backgroundColor;
    }

    function TableRow({ status }) {
        const backgroundColor = getStatusColor(status);

        return (
            <div className={`p-1 rounded-full ${backgroundColor} flex items-center justify-center`}>
                <div>{status}</div>
            </div>
        );
    }

    const isVoucherActive = new Date(chosenVoucher?.endDate)?.getTime() >= new Date().getTime();
    const voucherStatus = isVoucherActive ? 'Đang hoạt động' : 'Đã hết hạn';

    return (
        <div className="popup active fixed inset-0 flex items-center justify-center z-50">
            <div className="overlay"></div>
            <form className="content rounded-md p-5" style={{ width: '35vw' }}>
                <AiOutlineClose
                    className="absolute text-sm hover:cursor-pointer"
                    onClick={() => {
                        setIsOpenDetailVoucher(false);
                        handleGetAllVouchers();
                    }}
                />
                <p className="grid text-green font-bold text-xl justify-center">CHI TIẾT VOUCHER</p>
                <table className="mt-3">
                    <tbody>
                        <tr>
                            <td><span className="font-bold">Tên voucher</span></td>
                            <td className="pl-6 py-1 w-80">
                                <p className="text-center" style={{ width: '100%' }}>{chosenVoucher?.name}</p>
                            </td>
                        </tr>
                        <tr>
                            <td><span className="font-bold">Mô tả</span></td>
                            <td className="pl-6 py-1 w-80">
                                <p className="text-center" style={{ width: '100%' }}>{chosenVoucher?.description}</p>
                            </td>
                        </tr>
                        <tr>
                            <td><span className="font-bold">Ngày bắt đầu</span></td>
                            <td className="pl-6 py-1 w-80">
                                <p className="text-center" style={{ width: '100%' }}>{formatDate(chosenVoucher?.startDate)}</p>
                            </td>
                        </tr>
                        <tr>
                            <td><span className="font-bold">Ngày kết thúc</span></td>
                            <td className="pl-6 py-1 w-80">
                                <p className="text-center" style={{ width: '100%' }}>{formatDate(chosenVoucher?.endDate)}</p>
                            </td>
                        </tr>
                        <tr>
                            <td><span className="font-bold">Điểm trao đổi</span></td>
                            <td className="pl-6 py-1 w-80">
                                <p className="text-center" style={{ width: '100%' }}>{chosenVoucher?.price}</p>
                            </td>
                        </tr>
                        <tr>
                            <td><span className="font-bold">Loại voucher</span></td>
                            <td className="pl-6 py-1 w-80">
                                <p className="text-center" style={{ width: '100%' }}>{chosenVoucher?.category}</p>
                            </td>
                        </tr>
                        <tr>
                            <td><span className="font-bold">Trạng thái</span></td>
                            <td className="pl-6 py-1 w-80">
                                <p className="text-center" style={{ width: '100%' }}>
                                    <TableRow status={voucherStatus} />
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td><span className="font-bold">Mã giảm giá</span></td>
                            <td className="pl-6 py-1 w-80">
                                <p className="text-center" style={{ width: '100%' }}>{chosenVoucher?.code}</p>
                            </td>
                        </tr>
                        <tr>
                            <td><span className="font-bold">Thương hiệu</span></td>
                            <td className="pl-6 py-1 w-80">
                                <p className="text-center" style={{ width: '100%' }}>{chosenVoucher?.brand}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-2">
                    {isVoucherActive ? (
                        <button className="bg-primary p-2 rounded-full"
                            onClick={() => handleRedeemVoucher(account?._id, chosenVoucher?._id)}
                        >
                            <p>{account?._id}</p>
                            <p>{chosenVoucher._id}</p>
                            {chosenVoucher?.price > 0 ? 'Đổi ngay' : 'Nhận voucher'}
                        </button>
                    ) : (
                        <div className="bg-[red] p-2 rounded-full text-[black] text-center cursor-not-allowed">
                            Không khả dụng
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};
