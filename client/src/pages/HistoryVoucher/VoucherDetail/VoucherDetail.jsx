import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../components/Spinner/Spinner';
import { AiOutlineClose } from 'react-icons/ai';
import { useEffect, useState } from 'react';

export const VoucherDetail = ({ chosenVoucherId, setIsOpenDetailVoucher, handleGetAllVouchers }) => {
    const { vouchers, isLoading: voucherLoading } = useSelector((state) => state.vouchers);
    const [chosenVoucher, setChosenVoucher] = useState(null);

    useEffect(() => {
        console.log('vouchers:', vouchers);
        console.log('chosenVoucherId:', chosenVoucherId);
        if (vouchers.length > 0) {
            const selectedVoucher = vouchers.find((voucher) => String(voucher._id) === String(chosenVoucherId));
            setChosenVoucher(selectedVoucher);
            console.log('selectedVoucher:', selectedVoucher);
        }
    }, [chosenVoucherId, vouchers]);

    if (voucherLoading) {
        return <Spinner />;
    }

    return (
        <div className="popup active">
            <div className="overlay" onClick={() => { setIsOpenDetailVoucher(false); handleGetAllVouchers(); }}></div>
            <div className="content rounded-md p-5 flex flex-col items-center" style={{ width: '35vw' }}>
                <AiOutlineClose
                    className="absolute top-2 right-2 text-lg cursor-pointer"
                    onClick={() => { setIsOpenDetailVoucher(false); handleGetAllVouchers(); }}
                />
                <p className="text-green-600 font-bold text-xl mb-3">
                    CHI TIẾT VOUCHER
                </p>
                <img
                    src={chosenVoucher?.image || 'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/441383852_1176452586830228_6532755626084556078_n.png?_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEWDG5ykBC2m4DKPH9prDgb5rEFbXOYYPPmsQVtc5hg87OKXE-ibmrgn2z-w977MsaCQjRRdGoBb34mwXN-9dNa&_nc_ohc=5VZSoYoKs7AQ7kNvgG5dT37&_nc_ht=scontent.fsgn2-4.fna&oh=03_Q7cD1QEjM_tZ2zZfVcF2YKAg3glzYDK7UbfyIOBhvzETS6Ccng&oe=667984CA'}
                    alt="Offer"
                    className="w-full h-[230px] object-cover rounded-t-lg"
                />
                <div className="text-center mt-4">
                    {chosenVoucher ? (
                        <>
                            <p className="mb-2">{chosenVoucher.description}</p>
                            <p className="mb-2 font-bold">Thương hiệu: {chosenVoucher?.brand}</p>
                            <p className="mb-2 font-bold">Giá trị giảm: {chosenVoucher?.discountValue}%</p>
                            <p className="mb-2 font-bold">Mã giảm giá: {chosenVoucher?.code}</p>
                            <p className="mb-2 font-bold">Hạn sử dụng: {new Date(chosenVoucher.endDate).toLocaleDateString()}</p>
                        </>
                    ) : (
                        <p>Loading voucher details...</p>
                    )}
                </div>
            </div>
        </div>
    );
};
