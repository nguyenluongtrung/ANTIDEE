import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import { BiUser, BiBlock, BiTrash, BiEdit, BiSun, BiSearch } from "react-icons/bi";
import { GrUserManager } from "react-icons/gr";
import { GiConfirmed } from "react-icons/gi";

export const AdminPage = () => {
  const menu = [
    { name: "Người Dùng", icon: <BiUser /> },
    { name: "Quản Lý", icon: <GrUserManager /> },
    { name: "Chờ Xác Nhận", icon: <GiConfirmed /> },
    { name: "Đã chặn", icon: <BiBlock /> },
  ];

  const users = [
    {
      name: "Hưng",
      age: "20",
      dateRegister: "1/5/2024",
      rating: "5",
      budget: "10",
    },
    {
      name: "Hưng",
      age: "20",
      dateRegister: "1/5/2024",
      rating: "5",
      budget: "10",
    },
    {
      name: "Hưng",
      age: "20",
      dateRegister: "1/5/2024",
      rating: "5",
      budget: "10",
    },
    {
      name: "Hưng",
      age: "20",
      dateRegister: "1/5/2024",
      rating: "5",
      budget: "10",
    },
    {
      name: "Hưng",
      age: "20",
      dateRegister: "1/5/2024",
      rating: "5",
      budget: "10",
    },
    {
      name: "Hưng",
      age: "20",
      dateRegister: "1/5/2024",
      rating: "5",
      budget: "10",
    },
    {
      name: "Hưng",
      age: "20",
      dateRegister: "1/5/2024",
      rating: "5",
      budget: "10",
    },
  ];
  return (
    <div className="w-full min-h-screen bg-white flex flex-row">
      {/* Admin page */}
      <AdminSidebar />
      {/* Admin Main */}
      <div className="flex-1 px-10">
        {/* Admin Header */}
        <div className="pb-6 border-b border-gray border-opacity-50">
          <div className="flex flex-row justify-between items-center">
            <div className="font-semibold">Ngày: 1/5/2024</div>
            <div className="border pl-5 pr-72 py-1 rounded-full flex items-center content-start">
              <BiSearch size={20}/>
              <div className="pl-3">Tìm Kiếm</div>
            </div>
            <div className="flex flex-row items-center justify-between space-x-5">
              <BiSun size={30} />
              <BiUser size={30} />
              <img
                src="https://kenh14cdn.com/203336854389633024/2023/5/6/photo-1-16833400761141879326054.png"
                alt="user"
                className="h-9 w-9 object-cover rounded-full"
              />
            </div>
          </div>
        </div>
        {/* Admin Components */}
        <div className="py-5 px-2">
          {/* Admin Components Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Tài Khoản</h1>
              <p className="text-sm font-medium text-gray pt-1">
                Quản lí tất cả các tài khoản của người dùng
              </p>
            </div>

            <div className="flex">
              <div className="px-5 flex flex-col items-center">
                <h2 className="text-2xl font-semibold">100</h2>
                <h1 className="text-sm font-medium text-gray">Người Dùng</h1>
              </div>
              <div className="px-5 flex flex-col items-center">
                <h2 className="text-2xl font-semibold">10</h2>
                <h1 className="text-sm font-medium text-gray">Quản Lý</h1>
              </div>
            </div>
          </div>
          {/* Admin Components Choose */}
          <ul className="flex gap-x-5 items-center justify-between px-4 border-y border-gray border-opacity-50 mt-10">
            {menu.map((item, index) => {
              return (
                <li
                  key={index}
                  className="flex flex-row items-center text-gray"
                >
                  <button className="flex gap-x-2 items-center py-5 px-6 hover:text-primary relative group">
                    <div>{item.icon}</div>
                    <div>{item.name}</div>
                    <span className="left-3 absolute w-full h-0.5 bg-primary rounded bottom-0 scale-x-0 group-hover:scale-x-100 transition-transform ease-in-out" />
                  </button>
                </li>
              );
            })}
          </ul>
          {/* Admin Components Content */}
          <table className="w-full border-b border-gray">
            <thead>
              <tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
                <td className="py-2 px-4 text-center">Tên</td>
                <td className="py-2 px-4 text-center">Tuổi</td>
                <td className="py-2 px-4 text-center">Ngày Đăng Kí</td>
                <td className="py-2 px-4 text-center">Đánh Giá</td>
                <td className="py-2 px-4 text-center">Số dư</td>
                <td className="py-2 px-4 text-center">Sửa</td>
                <td className="py-2 px-4 text-center">Xoá</td>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                return (
                  <tr className="hover:bg-primary transition-colors group">
                    <td className="font-medium text-center text-gray">
                      {user.name}
                    </td>
                    <td className="font-medium text-center text-gray">
                      {user.age}
                    </td>
                    <td className="font-medium text-center text-gray">
                      {user.dateRegister}
                    </td>
                    <td className="font-medium text-center text-gray">
                      {user.rating}
                    </td>
                    <td className="font-medium text-center text-gray">
                      {user.budget}
                    </td>
                    <td>
                      <button className="flex items-center justify-center hover:rounded-md py-2 hover:bg-green">
                        <BiEdit />
                      </button>
                    </td>
                    <td>
                      <button className="flex items-center justify-center hover:rounded-md py-2 hover:bg-red">
                        <BiTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
