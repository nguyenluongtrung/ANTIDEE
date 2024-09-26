import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllAccountVouchers, getAllVouchers } from "../../features/vouchers/voucherSlice";
import { Sidebar } from "../MyAccount/components/Sidebar/Sidebar";
import { VoucherDetail } from "./VoucherDetail/VoucherDetail";
import { Spinner } from "../../components/Spinner/Spinner";
import { getAccountInformation } from "../../features/auth/authSlice";
import { useNavigate, useParams } from "react-router-dom";

export const VoucherHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { account, isLoading: authLoading } = useSelector((state) => state.auth);
  const [myAccountId, setMyAccountId] = useState(null);
  const [isOpenDetailVoucher, setIsOpenDetailVoucher] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const vouchersPerPage = 4;

  const [accountVoucher, setAccountVoucher] = useState(null);
  const [vouchers, setAllVouchers] = useState(null);
  const { voucherId } = useParams();
  // Fetch account information
  async function initiateAccountInformation() {
    let output = await dispatch(getAccountInformation());
    setMyAccountId(output.payload._id);
  }

  useEffect(() => {
    initiateAccountInformation();
  }, []);

  // Fetch account-specific vouchers
  async function initiateAccountVoucher() {
    if (myAccountId) {
      let output = await dispatch(getAllAccountVouchers(myAccountId));
      setAccountVoucher(output.payload); // Store user's vouchers
    }
  }

  useEffect(() => {
    if (myAccountId) {
      initiateAccountVoucher();
    }
  }, [myAccountId]);

  useEffect(() => {
    if (voucherId) {
      setIsOpenDetailVoucher(true);
    }
  }, [voucherId]);

  // Fetch all available vouchers
  async function initiateVouchers() {
    let output = await dispatch(getAllVouchers());
    setAllVouchers(output.payload);
  }

  useEffect(() => {
    initiateVouchers();
  }, []);

  if (authLoading) {
    return <Spinner />;
  }

  const handleShowUsed = () => setShowUsed(true);
  const handleShowUnused = () => setShowUsed(false);

  // Function to filter vouchers from the full list based on the user's accountVoucher data
  const filterAccountVouchers = () => {
    if (!accountVoucher || !vouchers) return [];

    // Filter vouchers that match the IDs in accountVoucher
    return vouchers.filter((voucher) =>
      accountVoucher.some((accountV) => accountV.voucherId === voucher._id)
    );
  };

  // Filter based on used or unused status
  const filterVouchersByUsage = (vouchers) => {
    if (showUsed) {
      return vouchers.filter((voucher) =>
        accountVoucher.some((accountV) => accountV.voucherId === voucher._id && accountV.isUsed)
      );
    } else {
      return vouchers.filter((voucher) =>
        accountVoucher.some((accountV) => accountV.voucherId === voucher._id && !accountV.isUsed)
      );
    }
  };

  const accountVouchers = filterAccountVouchers();
  const displayedVouchers = filterVouchersByUsage(accountVouchers);

  // Pagination
  const indexOfLastVoucher = currentPage * vouchersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
  const currentVouchers = displayedVouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);

  // Pagination logic
  const totalPages = Math.ceil(displayedVouchers.length / vouchersPerPage);
  const maxPageButtons = 3; // Số trang hiển thị tối đa trên thanh phân trang

  const paginate = () => {
    const pageNumbers = [];

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Helper function to calculate days left until voucher expiration
  const calculateDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const handleVoucherDetail = (voucherId) => {
    navigate(`/voucher-history/voucher-detail/${voucherId}`);
  };

  return (
    <div className="flex px-16 pt-20">
      <div className="left-container pr-24 pt-3 w-1/3">
        <Sidebar account={account} />
      </div>
      <div className="w-full">
        <h1 className="text-2xl font-bold text-center">Kho voucher</h1>
        <p className="mb-3 text-center">Quản lý voucher</p>
        {account ? (
          <div>
            <div className="flex border-t border-b border-gray-400 p-5">
              <button onClick={handleShowUnused} className={`mr-2 px-4 py-2 ${!showUsed ? "text-yellow" : "text-black"}`}>
                Voucher Chưa Sử Dụng
              </button>
              |
              <button onClick={handleShowUsed} className={`px-4 py-2 ${showUsed ? "text-yellow" : "text-black"}`}>
                Voucher Đã Sử Dụng
              </button>
            </div>
            <div className="mt-5">
              {currentVouchers.length > 0 ? (
                <div className="flex flex-wrap">
                  {currentVouchers.map((voucher) => (
                    <div key={voucher?._id} className="w-1/2 p-2">
                      <div className="flex items-center shadow-2xl p-4 rounded-lg transition-transform transform hover:scale-105">
                        <img
                          src={
                            voucher?.image ||
                            "https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/441383852_1176452586830228_6532755626084556078_n.png"
                          }
                          alt="Offer"
                          className="w-36 h-36 object-cover rounded-lg mr-4"
                        />
                        <div className="flex-1">
                          <p className="text-xl font-semibold">{voucher.name}</p>
                          {!voucher.isUsed && (
                            <p className="text-gray">Còn lại: {calculateDaysLeft(voucher?.endDate)} ngày</p>

                          )}
                          <p className="font-semibold">{voucher.category}</p>
                          {accountVoucher.some(
                            (accountV) =>
                              accountV.voucherId === voucher._id && accountV.isUsed
                          ) ? (
                            <p className="text-red font-semibold text-base">CODE: {voucher?.code}</p>
                          ) : (
                            ""
                          )}

                        </div>

                        <button
                          className={`ml-4 w-20 py-1 px-2 text-sm rounded-lg ${accountVoucher.some((accountV) => accountV.voucherId === voucher._id && accountV.isUsed)
                            ? "bg-[#da9452] text-white cursor-not-allowed"
                            : "bg-[#FB7F0C] text-white"
                            }`}
                          onClick={() => {
                            const voucherIsUsed = accountVoucher.some((accountV) => accountV.voucherId === voucher._id && accountV.isUsed);
                            if (!voucherIsUsed) {
                              handleVoucherDetail(voucher?._id)
                            }
                          }}
                          disabled={accountVoucher.some((accountV) => accountV.voucherId === voucher._id && accountV.isUsed)}
                        >
                          {accountVoucher.some((accountV) => accountV.voucherId === voucher._id && accountV.isUsed) ? "Đã Dùng" : "Dùng"}
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Không có voucher nào trong danh mục này</p>
              )}
              <div className="flex justify-center mt-4 text-primary font-semibold">
                {currentPage > 1 && (
                  <button onClick={() => setCurrentPage(currentPage - 1)} className="mx-2 px-4 py-2 bg-gray-300 rounded-lg">
                    Trang trước
                  </button>
                )}
                {currentPage < totalPages && (
                  <button onClick={() => setCurrentPage(currentPage + 1)} className="mx-2 px-4 py-2 bg-gray-300 rounded-lg">
                    Trang sau
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Không có thông tin người dùng</p>
        )}
      </div>
      {isOpenDetailVoucher && (
        <VoucherDetail setIsOpenDetailVoucher={setIsOpenDetailVoucher} />
      )}
    </div>
  );
};
