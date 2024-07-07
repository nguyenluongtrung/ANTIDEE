import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../../components";
import toast from "react-hot-toast";
import { blockAccountChange } from "../../../../features/auth/authSlice";
import { useState } from "react";
import { FaAngleRight, FaLock, FaLockOpen } from "react-icons/fa";
import { TiLockClosed, TiTick } from "react-icons/ti";

export const BlockAccount = ({
  setIsOpenBlockAccount,
  handleGetAllAccounts,
  chosenAccountId,
}) => {
  const { accounts, isLoading } = useSelector((state) => state.auth);

  const [chosenAccount, setChosenAccount] = useState(
    accounts[accounts.findIndex((account) => account._id == chosenAccountId)]
  );

  const dispatch = useDispatch();

  const onBlockChange = async () => {
    const result = await dispatch(blockAccountChange(chosenAccountId));
    if (result.type.endsWith("fulfilled")) {
      //   toast.success("Chặn người dùng thành công");
      setIsOpenBlockAccount(false);
      handleGetAllAccounts();
    } else if (result?.error?.message === "Rejected") {
      //   toast.error(result?.payload);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="popup active">
      <div className="overlay"></div>
      <div className="content rounded-md p-10">
        <div className="font-bold mb-6 text-xl">
          Bạn có chắc muốn
          {chosenAccount.isBlocked ? <span className="text-green font-bold text-2xl p-2">MỞ KHOÁ</span> : <span className="text-red  font-bold text-2xl p-2">KHOÁ</span>}
          tài khoản này không
        </div>
        <div className="pb-10">Tài khoản: {chosenAccount.name}</div>
        <div className="flex items-center justify-around">
          <div
            onClick={() => onBlockChange()}
            className={`flex items-center justify-center  rounded-lg p-2 w-[100px] text-center text-white font-bold cursor-pointer fea-item hover:bg-primary_dark ${
              !chosenAccount.isBlocked ? "bg-red" : "bg-green"
            }`}
          >
            Có
            {chosenAccount.isBlocked ? (
              <FaLockOpen size={20} className="ml-2" />
            ) : (
              <FaLock size={20} className="ml-2" />
            )}
          </div>
          <div
            onClick={() => setIsOpenBlockAccount(false)}
            className={`flex items-center justify-center bg-green p-2 w-[100px] rounded-lg text-center text-white font-bold cursor-pointer fea-item hover:bg-primary_dark ${
              chosenAccount.isBlocked ? "bg-red" : "bg-green"
            }`}
          >
            Không
            {chosenAccount.isBlocked ? (
              <FaLock size={20} className="ml-2" />
            ) : (
              <FaLockOpen size={20} className="ml-2" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
