import { BiEdit, BiTrash } from "react-icons/bi";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllAccounts } from "../../../features/auth/authSlice";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { BlockAccount } from "./BlockAccount/BlockAccount";

export const AccountManagement = () => {
  //Chỉ lấy account đã đăng nhập
  const { accounts, isLoading } = useSelector((state) => state.auth);

  const [isOpenBlockAccount, setIsOpenBlockAccount] = useState(false);
  const [chosenAccountId, setChosenAccountId] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllAccounts());
  }, []);

  // const onBlockChange = async (accountId) => {
  //   const result = await dispatch(blockAccountChange(accountId));
  //   if (result.type.endsWith("fulfilled")) {
  //     toast.success("Chặn người dùng thành công");
  //   } else if (result?.error?.message === "Rejected") {
  //     toast.error(result?.payload);
  //   }
  // };
  const handleGetAllAccounts = () => {
    Promise.all([dispatch(getAllAccounts())]).catch((error) => {
      console.error("Error during dispatch:", error);
    });
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-row">
      <AdminSidebar />
      {isOpenBlockAccount && (
        <BlockAccount
          setIsOpenBlockAccount={setIsOpenBlockAccount}
          handleGetAllAccounts={handleGetAllAccounts}
          chosenAccountId={chosenAccountId}
        />
      )}
      <div className="flex-1 px-10 pt-5">
        <div className="flex items-center justify-center">
          <div className="flex-1 pt-2" style={{ paddingRight: "70%" }}>
            <span>Hiển thị </span>
            <select
              className="rounded-md p-1 mx-1 hover:cursor-pointer"
              style={{ backgroundColor: "#E0E0E0" }}
            >
              <option>10</option>
              <option>20</option>
              <option>30</option>
            </select>
            <span> hàng</span>
          </div>
        </div>
        <table className="w-full border-b border-gray mt-3">
          <thead>
            <tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
              <td className="py-2 px-4 text-center font-bold">STT</td>
              <td className="py-2 px-4 text-center font-bold">Tên</td>
              <td className="py-2 px-4 text-center font-bold">Vai trò</td>
              <td className="py-2 px-4 text-center font-bold">Email</td>
              <td className="py-2 px-4 text-center font-bold">Giới Tính</td>
              <td className="py-2 px-4 text-center font-bold">Chặn/Bỏ Chặn</td>
              <td className="py-2 px-4 text-center font-bold">Hành động</td>
            </tr>
          </thead>
          <tbody>
            {accounts?.map((account, index) => {
              return (
                <tr className="hover:bg-primary hover:bg-opacity-25 transition-colors odd:bg-light_pink  hover:cursor-pointer">
                  <td className="font-medium text-center text-gray p-3">
                    <span>{index + 1}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <span>{account.name}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <span>{account.role}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <span>{account.email}</span>
                  </td>
                  <td className="font-medium text-center text-gray">
                    <span>{account.gender}</span>
                  </td>
                  <td className="">
                    <div className="">
                      <button
                        onClick={() => {
                          setIsOpenBlockAccount(true);
                          setChosenAccountId(account._id);
                        }}
                      >
                        {account.isBlocked ?<FaLock className="text-red m-auto"/> : <FaLockOpen className="text-primary m-auto"/>}
                      </button>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center">
                      <button className="flex items-center justify-end py-3 pr-2 text-xl group">
                        <BiEdit
                          className="text-green group-hover:text-primary"
                          // onClick={() => {
                          //   setIsOpenUpdateQualification(true);
                          //   setChosenQualificationId(qualification._id);
                          // }}
                        />
                      </button>
                      <button className="flex items-center justify-start p-3 text-xl group">
                        <BiTrash
                          className="text-red group-hover:text-primary"
                          // onClick={() =>
                          //   handleDeleteQualification(qualification._id)
                          // }
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
