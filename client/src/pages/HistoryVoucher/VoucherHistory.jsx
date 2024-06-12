import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getRedeemedVouchers } from '../../features/vouchers/voucherSlice';
import { Sidebar } from '../MyAccount/components/Sidebar/Sidebar';
import { VoucherDetail } from './VoucherDetail/VoucherDetail';
import { formatDate } from '../../utils/format';
import { Spinner } from '../../components/Spinner/Spinner';

export const VoucherHistory = () => {
  const dispatch = useDispatch();
  const { account, isLoading: authLoading } = useSelector((state) => state.auth);
  const { vouchers, isLoading: vouchersLoading } = useSelector((state) => state.vouchers);
  const [isOpenDetailVoucher, setIsOpenDetailVoucher] = useState(false);
  const [chosenVoucherId, setChosenVoucherId] = useState('');
  const [usedVouchers, setUsedVouchers] = useState([]);
  const [unusedVouchers, setUnusedVouchers] = useState([]);
  const [showUsed, setShowUsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const vouchersPerPage = 4;

  useEffect(() => {
    if (account) {
      dispatch(getRedeemedVouchers(account._id))
        .then((response) => {
          console.log(response.payload);
          const used = response.payload.filter(voucher => voucher.isUsed);
          const unused = response.payload.filter(voucher => !voucher.isUsed);
          setUsedVouchers(used);
          setUnusedVouchers(unused);
          console.log('Used Vouchers:', used);
          console.log('Unused Vouchers:', unused);
        })
        .catch((error) => {
          console.error('Error fetching vouchers:', error);
        });
    }
  }, [dispatch, account]);

  if (authLoading || vouchersLoading) {
    return <Spinner />;
  }

  const handleShowUsed = () => {
    setShowUsed(true);  
  };

  const handleShowUnused = () => {
    setShowUsed(false); 
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  const filterVouchers = (vouchers) => {
    if (selectedCategory === 'antidee') {
      return vouchers.filter(voucher => voucher.brand === 'Antidee');
    } else if (selectedCategory === 'partners') {
      return vouchers.filter(voucher => voucher.brand !== 'Antidee');
    }
    return vouchers;
  };

  const handleGetRedeemedVouchers = () => {
    dispatch(getRedeemedVouchers()).catch((error) => {
      console.error('Error during dispatch:', error);
    });
  };

  const displayedVouchers = showUsed ? filterVouchers(usedVouchers) : filterVouchers(unusedVouchers);

  const indexOfLastVoucher = currentPage * vouchersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
  const currentVouchers = displayedVouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);

  const totalPages = Math.ceil(displayedVouchers.length / vouchersPerPage);

  const calculateDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  return (
    <div className="flex px-16 mt-10">
      <div className="left-container pr-24 pt-3 w-1/3">
        <Sidebar account={account} />
      </div>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-center">Kho voucher</h1>
        <p className='mb-3 text-center'>Quản lý voucher</p>
        {account ? (
          <div>
            <div className='flex border-t border-b border-gray-400 p-5'>
              <button onClick={handleShowUnused} className={`mr-2 px-4 py-2 ${!showUsed ? 'text-yellow' : 'text-black'}`}>Voucher Chưa Sử Dụng</button>
              | 
              <button onClick={handleShowUsed} className={`px-4 py-2 ${showUsed ? 'text-yellow' : 'text-black'}`}>Voucher Đã Sử Dụng</button>
            </div>
            <div className='flex border border-gray-400 p-1 mt-2 rounded-lg'>
              <button onClick={() => handleCategoryChange('all')} className={`mr-2 px-4 py-2 ${selectedCategory === 'all' ? ' text-yellow' : 'text-black'}`}>Tất Cả Voucher</button>
              <button onClick={() => handleCategoryChange('antidee')} className={`mr-2 px-4 py-2 ${selectedCategory === 'antidee' ? ' text-yellow' : 'text-black'}`}>Voucher của Antidee</button>
              <button onClick={() => handleCategoryChange('partners')} className={`mr-2 px-4 py-2 ${selectedCategory === 'partners' ? ' text-yellow' : 'text-black'}`}>Voucher của Đối Tác</button>
            </div>
            <div className="mt-5">
              {currentVouchers.length > 0 ? (
                <div className="flex flex-wrap">
                  {currentVouchers.map((voucher) => (
                    <div key={voucher?._id} className="w-1/2 p-2">
                      <div className="flex items-center border p-4 rounded-lg transition-transform transform hover:scale-105">
                        <img src={voucher?.image || 'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/441383852_1176452586830228_6532755626084556078_n.png?_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEWDG5ykBC2m4DKPH9prDgb5rEFbXOYYPPmsQVtc5hg87OKXE-ibmrgn2z-w977MsaCQjRRdGoBb34mwXN-9dNa&_nc_ohc=5VZSoYoKs7AQ7kNvgG5dT37&_nc_ht=scontent.fsgn2-4.fna&oh=03_Q7cD1QEjM_tZ2zZfVcF2YKAg3glzYDK7UbfyIOBhvzETS6Ccng&oe=667984CA'} alt="Offer" className="w-36 h-36 object-cover rounded-lg mr-4" />
                        <div className="flex-1">
                          <p className="text-xl font-semibold">{voucher.name}</p>
                          {!voucher.isUsed && <p className="text-gray">Còn lại: {calculateDaysLeft(voucher?.endDate)} ngày</p>}
                        </div>
                        <button
                          className={`ml-4 w-20 py-1 px-2 text-sm rounded-lg ${voucher.isUsed ? 'bg-[#da9452] text-white cursor-not-allowed' : 'bg-[#FB7F0C] text-white'}`}
                          onClick={() => {
                            if (!voucher.isUsed) {
                              setIsOpenDetailVoucher(true);
                              setChosenVoucherId(voucher.voucherId);
                            }
                          }}
                          disabled={voucher.isUsed}
                        >
                          {voucher.isUsed ? 'Đã Dùng' : 'Dùng'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Không có voucher nào trong danh mục này</p>
              )}
              <div className="flex justify-center mt-4">
                {currentPage > 1 && (
                  <button onClick={() => setCurrentPage(currentPage - 1)} className="mx-2 px-4 py-2 bg-gray-300 rounded-lg">Trang trước</button>
                )}
                {currentPage < totalPages && (
                  <button onClick={() => setCurrentPage(currentPage + 1)} className="mx-2 px-4 py-2 bg-gray-300 rounded-lg">Trang sau</button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Không có thông tin người dùng</p>
        )}
      </div>
      {isOpenDetailVoucher && (
        <VoucherDetail
          setIsOpenDetailVoucher={setIsOpenDetailVoucher}
          handleGetRedeemedVouchers={handleGetRedeemedVouchers}
          chosenVoucherId={chosenVoucherId}
        />
      )}
    </div>
  );
};
