import './SearchVoucher.css';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../components/Spinner/Spinner';
import { getAllVouchers } from '../../../features/vouchers/voucherSlice';
import { VoucherDetail } from '../VoucherDetail/VoucherDetail';
import { SlArrowRight, SlArrowLeft } from 'react-icons/sl';
import React, { useEffect, useState } from 'react';

export const SearchVoucher = ({ vouchers = [], searchName = '', brandName = '' }) => {
  const dispatch = useDispatch();
  const { isLoading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllVouchers());
  }, [dispatch]);

  const [isOpenDetailVoucher, setIsOpenDetailVoucher] = useState(false);
  const [chosenVoucherId, setChosenVoucherId] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const vouchersPerPage = 3;

  const handleGetAllVouchers = () => {
    dispatch(getAllVouchers()).catch((error) => {
      console.error('Error during dispatch:', error);
    });
  };

  const validVouchers = Array.isArray(vouchers) ? vouchers : [];

  const filteredVouchers = validVouchers.filter((val) => {
    const matchesSearch = searchName === '' || val.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesBrand = brandName === '' || val.brand.toLowerCase() === brandName.toLowerCase();
    const isNotExpired = val.endDate && new Date(val.endDate) >= new Date(); // Chỉ giữ lại các voucher chưa hết hạn

    return matchesSearch && matchesBrand && isNotExpired;
  });

  const sortedVouchers = filteredVouchers.sort((a, b) => {
    const aExpiry = new Date(a.endDate);
    const bExpiry = new Date(b.endDate);
    return aExpiry - bExpiry; 
  });

  const paginatedVouchers = sortedVouchers.length > vouchersPerPage
  ? Array.from({ length: vouchersPerPage }, (_, i) => sortedVouchers[(currentPage + i) % sortedVouchers.length])
  : sortedVouchers;

  if (authLoading) {
    return <Spinner />;
  }

  const handlePageChange = (increment) => {
    setCurrentPage((prevPage) => (prevPage + increment + sortedVouchers.length) % sortedVouchers.length);
  };

  return (
    <div className="flex justify-between items-center mt-6">
      {sortedVouchers.length > vouchersPerPage && (
        <div className="flex items-center mt-4">
          <button
            className="px-2 py-2 bg-[#FF467D] text-white rounded-full"
            onClick={() => handlePageChange(-1)}
          >
            <SlArrowLeft className="hover:cursor-pointer" />
          </button>
        </div>
      )}
      <div className="flex grid grid-cols-3 gap-[15px]">
        {paginatedVouchers.map((voucher, index) => (
          <div
            key={voucher?._id || index}
            className="transition duration-300 ease-in-out transform hover:scale-90 border-gray-300 shadow-2xl rounded-[15px] hover:cursor-pointer m-2 w-full"
          >
            <img src='/image/highland.png' alt="Offer" className="w-full h-[150px] object-cover rounded-t-lg" />
            <div className="p-4">
              <p className="text-2xl font-semibold">{voucher.name}</p>
              <p className="text-lg text-[#C0BFBF]">{voucher.brand}</p>
              <div className="flex items-center mt-2">
                <img className="w-5 h-5" src="/image/icon.png" alt="" />
                <span className="ml-1 block text-[#FB800E] text-lg">{voucher.price}</span>
              </div>
            </div>
            <button
              className="hover:cursor-pointer mt-2 w-[650px] italic self-end py-2 bg-orange-500 text-[#fccb70] rounded-b-lg"
              onClick={() => {
                setIsOpenDetailVoucher(true);
                setChosenVoucherId(voucher._id);
              }}
            >
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
      {isOpenDetailVoucher && (
        <VoucherDetail
          setIsOpenDetailVoucher={setIsOpenDetailVoucher}
          handleGetAllVouchers={handleGetAllVouchers}
          chosenVoucherId={chosenVoucherId}
        />
      )}
      {sortedVouchers.length > vouchersPerPage && (
        <div className="p-4 flex justify-between mt-4">
          <button
            className="px-2 py-2 bg-[#FF467D] text-white rounded-full"
            onClick={() => handlePageChange(1)}
          >
            <SlArrowRight className="hover:cursor-pointer" />
          </button>
        </div>
      )}
    </div>
  );
};
