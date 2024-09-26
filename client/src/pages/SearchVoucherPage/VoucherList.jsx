import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { getAllVouchers } from "../../features/vouchers/voucherSlice";
import { GiTwoCoins } from "react-icons/gi";
import { VoucherDetail } from "./VoucherDetail/VoucherDetail";
import { useNavigate, useParams } from "react-router-dom";

export const VoucherList = () => {
  const [vouchers, setVoucherList] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [showAll, setShowAll] = useState(false);
  const [isOpenDetailVoucher, setIsOpenDetailVoucher] = useState(false);

  const { voucherId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function initiateVoucherInformation() {
    let output = await dispatch(getAllVouchers());
    setVoucherList(output.payload);
  }

  useEffect(() => {
    initiateVoucherInformation();
  }, []);

  useEffect(() => {
    if (voucherId) {
      setIsOpenDetailVoucher(true);
    }
  }, [voucherId]);

  const onSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  const categories = vouchers
    ? ["Tất cả", ...new Set(vouchers.map((voucher) => voucher.category))]
    : ["Tất cả"];

  const filteredVouchers =
    vouchers?.filter((voucher) => {
      const matchesSearchName = voucher.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesCategory =
        selectedCategory === "Tất cả" || voucher.category === selectedCategory;
      return matchesSearchName && matchesCategory;
    }) || [];

  const handleVoucherDetail = (voucherId) => {
    navigate(`/vouchers/voucher-detail/${voucherId}`);
  };

  return (
    <div className="font-sans p-4 sm:p-8 md:p-20">
      <header className="bg-gray-100 p-5">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5 h-auto md:h-[450px]">
            <img
              src="/image/voucher.png"
              className="w-full sm:w-[400px] md:w-[600px] h-auto md:h-[430px] mb-4 md:mb-[100px] mx-auto"
            />
            <p className="mt-8 sm:mt-16 md:mt-40 text-center md:text-left">
              <span className="text-[#fac562] font-bold text-3xl sm:text-4xl md:text-5xl">
                Vô vàn{" "}
              </span>
              <span className="text-[#FB7F0C] font-bold text-3xl sm:text-4xl md:text-5xl">
                Ưu đãi
              </span>
              <br />
              <span className="text-[#FB7F0C] font-bold text-3xl sm:text-4xl md:text-5xl">
                Ngập tràn
              </span>
              <span className="text-[#fac562] font-bold text-3xl sm:text-4xl md:text-5xl">
                Niềm vui
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center bg-[#EFEFEF] p-3 rounded-xl w-full max-w-sm sm:max-w-md mx-auto md:mx-0">
          <FiSearch className="text-gray-500 ml-3" />
          <input
            type="text"
            placeholder="Tìm kiếm ưu đãi"
            className="focus:outline-none bg-[#EFEFEF] ml-2 w-full"
            value={searchName}
            onChange={onSearchChange}
          />
        </div>

        <div className="mt-8 sm:mt-[30px] flex space-x-4 justify-center md:justify-start">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 w-[80px] sm:w-[90px] md:w-[100px] h-10 border-[1px] text-white rounded-full ${
                selectedCategory === category
                  ? "bg-[#FF467D] border-[#FF467D]"
                  : "bg-[#FF9BB9] border-[#FF467D]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {filteredVouchers.length > 6 && (
        <div className="flex justify-center md:justify-end mt-4">
          {!showAll ? (
            <button
              onClick={() => setShowAll(true)}
              className="w-full sm:w-auto text-yellow hover:text-primary font-bold py-2 px-4 rounded-lg transition"
            >
              Xem tất cả
            </button>
          ) : (
            <button
              onClick={() => setShowAll(false)}
              className="w-full sm:w-auto text-yellow hover:text-primary font-bold py-2 px-4 rounded-lg transition"
            >
              Ẩn bớt
            </button>
          )}
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center mx-auto">
        {filteredVouchers
          ?.filter(
            (voucher) =>
              voucher?.couponType === "Voucher" && voucher?.status === "Enable"
          )
          .slice(0, showAll ? filteredVouchers.length : 6)
          .map((voucher) => (
            <div
              key={voucher.id}
              className="max-w-lg w-full min-h-[350px] rounded-lg shadow-lg bg-white flex flex-col justify-between mx-auto border-light_gray"
            >
              <img
                src={voucher?.image}
                alt="Ảnh voucher"
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="mt-4 flex-grow p-4">
                <span className="block text-lg font-bold text-gray">
                  {voucher?.name}
                </span>
                <span className="block text-sm text-gray">
                  {voucher?.category}
                </span>
                <div className="mt-2 flex items-center text-yellow text-xl font-semibold">
                  <GiTwoCoins className="mr-1" /> {voucher?.price}
                </div>
              </div>
              <button
                onClick={() => handleVoucherDetail(voucher._id)}
                className="mt-4 ml-auto w-auto text-yellow hover:text-primary font-bold py-2 px-4 rounded-lg transition"
              >
                Xem chi tiết
              </button>
            </div>
          ))}
      </section>
      {isOpenDetailVoucher && (
        <VoucherDetail
          setIsOpenDetailVoucher={setIsOpenDetailVoucher}
        />
      )}
    </div>
  );
};
