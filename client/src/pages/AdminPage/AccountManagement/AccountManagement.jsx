import { BiBlock, BiEdit, BiTrash, BiUser } from "react-icons/bi";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllAccounts } from "../../../features/auth/authSlice";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { BlockAccount } from "./BlockAccount/BlockAccount";
import { GrUserManager } from "react-icons/gr";
import { GiConfirmed } from "react-icons/gi";
import { FaUsersLine } from "react-icons/fa6";

export const AccountManagement = () => {
  //Chỉ lấy account đã đăng nhập
  const { accounts, isLoading } = useSelector((state) => state.auth);

  const [isOpenBlockAccount, setIsOpenBlockAccount] = useState(false);
  const [chosenAccountId, setChosenAccountId] = useState("");

  const [selectedRole, setSelectedRole] = useState(null);
  const [blockFilter, setBlockFilter] = useState(null);
  const [pageStanding, setPageStanding] = useState("Tất cả");

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setBlockFilter(null); // Reset block filter when role is selected
  };

  const handleBlockFilterClick = (blockStatus) => {
    setBlockFilter(blockStatus);
    setSelectedRole(null); // Reset role filter when block status is selected
  };

  const handleViewAllAccounts = () => {
    setBlockFilter(null);
    setSelectedRole(null);
  };

  const filteredAccounts = accounts.filter((account) => String(account.role) != "Admin").filter((account) => {
    const roleMatch = selectedRole ? account.role.includes(selectedRole) : true;
    const blockMatch =
      blockFilter !== null ? account.isBlocked === blockFilter : true;
    return roleMatch && blockMatch;
  });

  // const handleRoleClick = (role) => {
  //   setSelectedRole(role);
  // };

  //const filteredAccounts = selectedRole ? accounts.filter(account => account.role.includes(selectedRole)) : accounts;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllAccounts());
  }, []);

  const handleGetAllAccounts = () => {
    Promise.all([dispatch(getAllAccounts())]).catch((error) => {
      console.error("Error during dispatch:", error);
    });
  };

  const menu = [
    { name: "Khách hàng", icon: <BiUser />, role: "Khách hàng" },
    {
      name: "Người giúp việc",
      icon: <GrUserManager />,
      role: "Người giúp việc",
    },
    { name: "Chưa chặn", icon: <GiConfirmed /> },
    { name: "Đã chặn", icon: <BiBlock /> },
  ];

  const menuRole = [
    { name: "Khách hàng", icon: <BiUser />, role: "Khách hàng" },
    {
      name: "Người giúp việc",
      icon: <GrUserManager />,
      role: "Người giúp việc",
    },
  ];

  const menuBlock = [
    { name: "Chưa chặn", icon: <GiConfirmed />, isBlocked: false },
    { name: "Đã chặn", icon: <BiBlock />, isBlocked: true },
  ];

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
      {console.log("ACCCCCCC", filteredAccounts)}
      <div className="flex-1 px-10 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Tài Khoản</h1>
            <p className="text-sm font-medium text-gray pt-1">
              Quản lí tất cả các tài khoản của người dùng
            </p>
          </div>

          <div className="flex">
            <div className="px-5 flex flex-col items-center">
              <h2 className="text-2xl font-semibold">{accounts.length}</h2>
              <h1 className="text-sm font-medium text-gray">Người Dùng</h1>
            </div>
          </div>
        </div>
        <ul className="flex gap-x-5 items-center justify-between px-4 border-y border-gray border-opacity-50 mt-10">
          <li className="flex flex-row items-center text-gray">
            <button
              className={`flex gap-x-2 items-center py-5 px-6 hover:text-primary relative group ${
                pageStanding === "Tất cả" && "text-primary"
              }`}
              onClick={() => {
                handleViewAllAccounts();
                setPageStanding("Tất cả");
              }}
            >
              <div>
                <FaUsersLine />
              </div>
              <div>Tất cả</div>
              <span className="left-3 absolute w-full h-0.5 bg-primary rounded bottom-0 scale-x-0 group-hover:scale-x-100 transition-transform ease-in-out" />
            </button>
          </li>
          {menuRole.map((item, index) => {
            return (
              <li key={index} className="flex flex-row items-center text-gray">
                <button
                  className={`flex gap-x-2 items-center py-5 px-6 hover:text-primary relative group ${
                    pageStanding === item.name && "text-primary"
                  }`}
                  onClick={() => {
                    handleRoleClick(item.role);
                    setPageStanding(item.name);
                  }}
                >
                  <div>{item.icon}</div>
                  <div>{item.name}</div>
                  <span className="left-3 absolute w-full h-0.5 bg-primary rounded bottom-0 scale-x-0 group-hover:scale-x-100 transition-transform ease-in-out" />
                </button>
              </li>
            );
          })}
          {menuBlock.map((item, index) => {
            return (
              <li key={index} className="flex flex-row items-center text-gray">
                <button
                  className={`flex gap-x-2 items-center py-5 px-6 hover:text-primary relative group ${
                    pageStanding === item.name && "text-primary"
                  }`}
                  onClick={() => {
                    handleBlockFilterClick(item.isBlocked);
                    setPageStanding(item.name);
                  }}
                >
                  <div>{item.icon}</div>
                  <div>{item.name}</div>
                  <span className="left-3 absolute w-full h-0.5 bg-primary rounded bottom-0 scale-x-0 group-hover:scale-x-100 transition-transform ease-in-out" />
                </button>
              </li>
            );
          })}
        </ul>
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
            {filteredAccounts?.map((account, index) => {
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
                        {account.isBlocked ? (
                          <FaLock className="text-red m-auto" />
                        ) : (
                          <FaLockOpen className="text-primary m-auto" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="">
                    <div className="flex items-center justify-center">
                      {/* <button className="flex items-center justify-end py-3 pr-2 text-xl group">
                        <BiEdit
                          className="text-green group-hover:text-primary"
                        />
                      </button> */}
                      <button className="flex items-center justify-start p-3 text-xl group">
                        <BiTrash
                          className="text-red group-hover:text-primary m-auto"
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
