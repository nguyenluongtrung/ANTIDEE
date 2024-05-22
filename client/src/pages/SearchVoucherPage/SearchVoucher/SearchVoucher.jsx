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
  const [isSliding, setIsSliding] = useState(false);
  const [direction, setDirection] = useState('');

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
    return matchesSearch && matchesBrand;
  });

  const sortedVouchers = filteredVouchers.sort((a, b) => {
    const now = new Date();
    const aExpiry = new Date(a.expiryDate);
    const bExpiry = new Date(b.expiryDate);
    if (aExpiry < now && bExpiry >= now) return 1;
    if (aExpiry >= now && bExpiry < now) return -1;
    return aExpiry - bExpiry;
  });

  const paginatedVouchers = sortedVouchers.slice(currentPage * vouchersPerPage, (currentPage + 1) * vouchersPerPage);

  if (authLoading) {
    return <Spinner />;
  }

  const handlePageChange = (newPage, dir) => {
    setDirection(dir);
    setIsSliding(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsSliding(false);
    }, 300); // Duration of the slide animation
  };

  return (
    <div className="flex justify-between items-center mt-6">
      <div className={`flex grid grid-cols-3 gap-[15px] ${isSliding ? `slide-${direction}` : ''}`}>
        {paginatedVouchers.map((voucher) => (
          <div
            key={voucher?._id}
            className="transition duration-300 ease-in-out transform hover:scale-90 border-gray-300 shadow-2xl rounded-[15px] hover:cursor-pointer m-4 w-full"
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
              className="hover:cursor-pointer text-xl pt-1.5"
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
      <div className="p-4 flex justify-between items-center mt-4">
        {currentPage > 0 && (
          <button
            className="px-2 py-2 bg-[#FF467D] text-white rounded-full"
            onClick={() => handlePageChange(currentPage - 1, 'left')}
          >
            <SlArrowLeft className="hover:cursor-pointer" />
          </button>
        )}
        {(currentPage + 1) * vouchersPerPage < filteredVouchers.length && (
          <button
            className="px-2 py-2 bg-[#FF467D] text-white rounded-full"
            onClick={() => handlePageChange(currentPage + 1, 'right')}
          >
            <SlArrowRight className="hover:cursor-pointer" />
          </button>
        )}
      </div>
    </div>
  );
};
