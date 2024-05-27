import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { SearchVoucher } from './SearchVoucher/SearchVoucher';
import { getAllVouchers } from '../../features/vouchers/voucherSlice';

export const VoucherList = () => {
  const { vouchers } = useSelector((state) => state.vouchers);
  const [searchName, setSearchName] = useState('');
  const [brandName, setBrandName] = useState('Antidee');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllVouchers());
  }, [dispatch]);

  const onSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  const categories = vouchers
    ? ['Tất cả', ...new Set(vouchers.map(voucher => voucher.category))]
    : ['Tất cả'];

  const filteredVouchers = vouchers?.filter(voucher => {
    const matchesSearchName = voucher.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || voucher.category === selectedCategory;
    return matchesSearchName && matchesCategory;
  }) || [];

  const exclusiveVouchers = filteredVouchers.filter(voucher => voucher.brand.toLowerCase() === brandName.toLowerCase());
  const topVouchers = filteredVouchers.filter(voucher => voucher.brand.toLowerCase() !== brandName.toLowerCase());

  const isVoucherValid = (voucher) => {
    const isNotExpired = voucher.endDate && new Date(voucher.endDate) >= new Date();
    const hasQuantity = voucher.quantity > 0;
    return isNotExpired && hasQuantity;
  };

  const validExclusiveVouchers = exclusiveVouchers.filter(isVoucherValid);
  const validTopVouchers = topVouchers.filter(isVoucherValid);

  const noValidVouchersFound = validExclusiveVouchers.length === 0 && validTopVouchers.length === 0;

  return (
    <div className="font-sans p-20">
      <header className="bg-gray-100 p-5">
        <div>
          <div className='flex ml-20 grid grid-cols-2 gap-5 h-[450px]'>
            <img src="/image/voucher.png" className="w-[600px] h-[430px] ml-9 mb-[100px]" />
            <p className="mt-40">
              <span className="text-[#fac562] font-bold text-5xl">Vô vàn{' '}</span>
              <span className="text-[#FB7F0C] text-5xl font-bold">Ưu đãi</span> <br />
              <span className="text-[#FB7F0C] font-bold text-5xl"> Ngập tràn</span>
              <span className="text-[#fac562] font-bold text-5xl">Niềm vui{' '}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center bg-[#EFEFEF] p-3 rounded-xl w-full max-w-md">
          <FiSearch className="text-gray-500 ml-3" />
          <input
            type="text"
            placeholder="Tìm kiếm ưu đãi"
            className="focus:outline-none bg-[#EFEFEF] ml-2 w-full"
            value={searchName}
            onChange={onSearchChange}
          />
        </div>

        <div className="mt-[30px] flex space-x-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 mt-[-2px] py-2 w-[100px] h-10 border-[1px] text-white rounded-full ${
                selectedCategory === category ? 'bg-[#FF467D] border-[#FF467D]' : 'bg-[#FF9BB9] border-[#FF467D]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <section className="p-5">
        {noValidVouchersFound ? (
          <p className="p-10 text-center text-xl text-gray">Voucher bạn tìm kiếm không tồn tại!!</p>
        ) : (
          <>
            {validExclusiveVouchers.length > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Ưu đãi độc quyền</h2>
                </div>
                <SearchVoucher
                  vouchers={validExclusiveVouchers}
                  searchName={searchName}
                  brandName={brandName}
                />
              </>
            )}

            {validTopVouchers.length > 0 && (
              <>
                <div className="flex justify-between items-center mt-6">
                  <h2 className="text-lg font-bold">Ưu đãi hàng đầu</h2>
                </div>
                <SearchVoucher
                  vouchers={validTopVouchers}
                  searchName={searchName}
                />
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
};
