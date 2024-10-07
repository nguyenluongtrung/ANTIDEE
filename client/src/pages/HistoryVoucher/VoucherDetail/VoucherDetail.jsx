import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../components/Spinner/Spinner";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect, useState } from "react";

import { formatDate } from "../../../utils/format";
import { useNavigate, useParams } from "react-router-dom";
import { getAllVouchers } from "../../../features/vouchers/voucherSlice";

export const VoucherDetail = ({ setIsOpenDetailVoucher }) => {
  const { isLoading: voucherLoading } = useSelector((state) => state.vouchers);
  const [chosenVoucher, setChosenVoucher] = useState(null);
  const { voucherId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [vouchers, setVoucherList] = useState(null);
  console.log(chosenVoucher);

  async function initiateVoucherList() {
    let output = await dispatch(getAllVouchers());
    setVoucherList(output.payload);

    const foundVoucher = output.payload.find(
        (voucher) => voucher._id === voucherId
      );
      setChosenVoucher(foundVoucher);
  }

  useEffect(() => {
    initiateVoucherList();
  }, [voucherId]);

  if (voucherLoading) {
    return <Spinner />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-11/12 max-w-lg bg-white rounded-lg shadow-lg p-5">
        <AiOutlineClose
          className="absolute top-2 right-2 text-xl cursor-pointer"
          onClick={() => {
            setIsOpenDetailVoucher(false);
            navigate("/voucher-history");
          }}
        />
        <p className="text-green font-bold text-xl mb-3 text-center">
          CHI TIẾT VOUCHER
        </p>
        <img
          src={
            chosenVoucher?.image ||
            "https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/441383852_1176452586830228_6532755626084556078_n.png?_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEWDG5ykBC2m4DKPH9prDgb5rEFbXOYYPPmsQVtc5hg87OKXE-ibmrgn2z-w977MsaCQjRRdGoBb34mwXN-9dNa&_nc_ohc=5VZSoYoKs7AQ7kNvgG5dT37&_nc_ht=scontent.fsgn2-4.fna&oh=03_Q7cD1QEjM_tZ2zZfVcF2YKAg3glzYDK7UbfyIOBhvzETS6Ccng&oe=667984CA"
          }
          alt="Offer"
          className="w-full h-56 object-cover rounded-lg mb-4"
        />
        <div className="text-center w-full">
          {chosenVoucher ? (
            <>
              <p className="mb-2">{chosenVoucher.description}</p>
              <p className="mb-2 font-bold">{chosenVoucher?.brand}</p>
              <p className="mb-2 font-bold">
                Giá trị giảm: {chosenVoucher?.discountValue}%
              </p>
              <div
                className="voucher-code p-3 rounded-md mb-3 flex justify-center items-center"
                
              >
                <p className="font-bold text-red text-lg">
                  {chosenVoucher?.code}
                </p>
              </div>
              <p className="mb-2 font-bold">
                Hạn sử dụng:{" "}
                <span className="text-red">
                  {formatDate(chosenVoucher.endDate)}
                </span>
              </p>
            </>
          ) : (
            <p>Loading voucher details...</p>
          )}
        </div>
      </div>
    </div>
  );
};
