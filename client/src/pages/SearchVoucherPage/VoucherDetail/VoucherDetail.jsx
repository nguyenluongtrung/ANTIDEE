import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect, useState } from "react";
import { formatDateDetail } from "../../../utils/format";
import {
  getAllVouchers,
  getVoucherById,
  redeemVoucher,
  reset,
} from "../../../features/vouchers/voucherSlice";
import { getAllServices } from "../../../features/services/serviceSlice";
import { useNavigate, useParams } from "react-router-dom";

export const VoucherDetail = ({ setIsOpenDetailVoucher }) => {
  const { isLoading: voucherLoading, isSuccess } = useSelector(
    (state) => state.vouchers
  );
  const { account, isLoading: isAuthLoading } = useSelector(
    (state) => state.auth
  );

  const [chosenVoucher, setChosenVoucher] = useState(null);
  const [services, setServiceList] = useState([]);
  const [myVoucher, setMyVoucher] = useState(null);
  const { voucherId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function initiateVouchers() {
    let output = await dispatch(getAllVouchers());
    setChosenVoucher(
      output.payload.find(
        (voucher) => String(voucher._id) === String(voucherId)
      )
    );
  }

  async function initiateServiceInformation() {
    let output = await dispatch(getAllServices());
    setServiceList(output.payload);
  }

  useEffect(() => {
    initiateVouchers();
    initiateServiceInformation();
  }, [voucherId]);

  const handleGetVoucherById = async (voucherId, accountId) => {
    const result = await dispatch(getVoucherById({ voucherId, accountId }));
    if (result.type.endsWith("fulfilled")) {
      setMyVoucher(result.payload);
    } else {
      toast.error("Failed to fetch voucher details", errorStyle);
    }
  };

  useEffect(() => {
    if (account?._id) {
      handleGetVoucherById(voucherId, account._id);
    }
    initiateServiceInformation();
  }, [voucherId, account?._id]);

  useEffect(() => {
    if (isSuccess) {
      initiateVouchers();
      dispatch(reset());
    }
  }, [isSuccess, dispatch]);

  const handleRedeemVoucher = async (accountId, voucherId) => {
    const result = await dispatch(redeemVoucher({ accountId, voucherId }));

    if (result.type.endsWith("fulfilled")) {
      toast.success("Nhận voucher thành công", successStyle);
      setIsOpenDetailVoucher(false);
      navigate("/vouchers");
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
  };

  if (voucherLoading || isAuthLoading) {
    return <div>Loading...</div>;
  }

  const isVoucherActive =
    new Date(chosenVoucher?.endDate)?.getTime() >= new Date().getTime();

  return (
    <div className="popup active fixed inset-0 flex items-center justify-center z-50">
      <div className="overlay"></div>
      <form className="content rounded-md p-5" style={{ width: "35vw" }}>
        <AiOutlineClose
          className="absolute text-sm hover:cursor-pointer"
          onClick={() => {
            setIsOpenDetailVoucher(false);
            navigate("/vouchers");
          }}
        />
        <p className="grid text-green font-bold text-xl justify-center">
          CHI TIẾT VOUCHER
        </p>
        <table className="mt-3">
          <tbody>
            <tr>
              <td>
                <span className="font-bold">Tên voucher</span>
              </td>
              <td className="pl-6 py-1 w-80">
                <p className="text-center" style={{ width: "100%" }}>
                  {chosenVoucher?.name}
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Mô tả</span>
              </td>
              <td className="pl-6 py-1 w-80">
                <p className="text-center" style={{ width: "100%" }}>
                  {chosenVoucher?.description}
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Ngày bắt đầu</span>
              </td>
              <td className="pl-6 py-1 w-80">
                <p className="text-center" style={{ width: "100%" }}>
                  {formatDateDetail(chosenVoucher?.startDate)}
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Ngày kết thúc</span>
              </td>
              <td className="pl-6 py-1 w-80">
                <p className="text-center" style={{ width: "100%" }}>
                  {formatDateDetail(chosenVoucher?.endDate)}
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Điểm trao đổi</span>
              </td>
              <td className="pl-6 py-1 w-80">
                <p className="text-center" style={{ width: "100%" }}>
                  {chosenVoucher?.price}
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Dịch vụ được áp dụng</span>
              </td>
              <td className="pl-6 py-1 w-80">
                <div className="text-center" style={{ width: "100%" }}>
                  {chosenVoucher?.serviceId.map((serviceId) => {
                    const service = services.find(
                      (service) => String(service._id) === String(serviceId)
                    );
                    return (
                      <p key={serviceId}>
                        {service ? service.name : "Dịch vụ không xác định"}
                      </p>
                    );
                  })}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-2">
          {myVoucher ? (
            <div className="bg-[red] p-2 rounded-full text-[white] font-semibold text-center cursor-not-allowed">
              Bạn đã nhận voucher này
            </div>
          ) : isVoucherActive ? (
            <button
              className="bg-primary p-2 rounded-full text-white font-semibold"
              onClick={() =>
                handleRedeemVoucher(account?._id, chosenVoucher?._id)
              }
            >
              {chosenVoucher?.price > 0 ? "Đổi ngay" : "Nhận voucher"}
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
