import {
	BiUser,
	BiBlock,
	BiTrash,
	BiEdit,
	BiSun,
	BiSearch,
	BiChevronLeft,
	BiChevronRight,
} from 'react-icons/bi';
import { GrUserManager } from 'react-icons/gr';
import { GiConfirmed } from 'react-icons/gi';
import AdminSidebar from './components/AdminSidebar/AdminSidebar';

export const AdminPage = () => {
	const menu = [
		{ name: 'Người Dùng', icon: <BiUser /> },
		{ name: 'Quản Lý', icon: <GrUserManager /> },
		{ name: 'Chờ Xác Nhận', icon: <GiConfirmed /> },
		{ name: 'Đã chặn', icon: <BiBlock /> },
	];

	const users = [
		{
			name: 'Hưng',
			age: '20',
			dateRegister: '1/5/2024',
			rating: '5',
			budget: '10',
			status: 'Thành Công',
		},
		{
			name: 'Hưng',
			age: '20',
			dateRegister: '1/5/2024',
			rating: '5',
			budget: '10',
			status: 'Đã Huỷ',
		},
		{
			name: 'Hưng',
			age: '20',
			dateRegister: '1/5/2024',
			rating: '5',
			budget: '10',
			status: 'Đang Làm',
		},
		{
			name: 'Hưng',
			age: '20',
			dateRegister: '1/5/2024',
			rating: '5',
			budget: '10',
			status: 'Đang Làm',
		},
		{
			name: 'Hưng',
			age: '20',
			dateRegister: '1/5/2024',
			rating: '5',
			budget: '10',
			status: 'Đang Làm',
		},
		{
			name: 'Hưng',
			age: '20',
			dateRegister: '1/5/2024',
			rating: '5',
			budget: '10',
			status: 'Đang Làm',
		},
		{
			name: 'Hưng',
			age: '20',
			dateRegister: '1/5/2024',
			rating: '5',
			budget: '10',
			status: 'Đang Làm',
		},
	];

	const pages = [1, 2, 3, 4, 5];
	function getStatusColor(status) {
		let backgroundColor = '';
		if (status === 'Thành Công') {
			backgroundColor = 'bg-green bg-opacity-25 text-green font-semibold';
		} else if (status === 'Đã Huỷ') {
			backgroundColor = 'bg-red bg-opacity-25 text-red font-semibold';
		} else if (status === 'Đang Làm') {
			backgroundColor = 'bg-yellow bg-opacity-25 text-primary font-semibold';
		}
		return backgroundColor;
	}

	function TableRow({ status }) {
		const backgroundColor = getStatusColor(status);

		return (
			<div
				className={`p-1 rounded-full ${backgroundColor} flex items-center justify-center`}
			>
				<div>{status}</div>
			</div>
		);
	}

	return (
		<div className="w-full min-h-screen bg-white flex flex-row">
			<AdminSidebar />
			<div className="flex-1 px-10 pt-5">
				<div className="pb-3 border-b border-gray border-opacity-50">
					<div className="flex flex-row justify-between items-center">
						<div className="font-semibold">Ngày: 1/5/2024</div>
						<div className="border pl-5 pr-72 py-1 rounded-full flex items-center content-start">
							<BiSearch size={20} />
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
				<div className="py-5 px-2">
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
					<table className="w-full border-b border-gray">
						<thead>
							<tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
								<td className="py-2 px-4 text-center font-bold">STT</td>
								<td className="py-2 px-4 text-center font-bold">Tên</td>
								<td className="py-2 px-4 text-center font-bold">Tuổi</td>
								<td className="py-2 px-4 text-center font-bold">
									Ngày Đăng Kí
								</td>
								<td className="py-2 px-4 text-center font-bold">Đánh Giá</td>
								<td className="py-2 px-4 text-center font-bold">Số Dư</td>
								<td className="py-2 px-4 text-center font-bold">Trạng Thái</td>
								<td className="py-2 px-4 text-center font-bold">Hành Động</td>
							</tr>
						</thead>
						<tbody>
							{users.map((user, index) => {
								return (
									<tr className="hover:bg-light_purple transition-colors group odd:bg-light_purple hover:cursor-pointer">
										<td className="font-medium text-center text-gray p-3">
											<span>{index + 1}</span>
										</td>
										<td className="font-medium text-center text-gray">
											<span>{user.name}</span>
										</td>
										<td className="font-medium text-center text-gray">
											<span>{user.age}</span>
										</td>
										<td className="font-medium text-center text-gray">
											<span>{user.dateRegister}</span>
										</td>
										<td className="font-medium text-center text-gray">
											<span>{user.rating}</span>
										</td>
										<td className="font-medium text-center text-gray">
											<span>{user.budget}</span>
										</td>
										<td>
											<span>
												<TableRow status={user.status} />
											</span>
										</td>
										<td className="">
											<div className="flex items-center justify-center">
												<button className="flex items-center justify-end py-3 pr-2 text-xl">
													<BiEdit className="text-green" />
												</button>
												<button className="flex items-center justify-start py-3 pl-2 text-xl">
													<BiTrash className="text-red" />
												</button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>

					<div className="flex gap-x-2 justify-center pt-8">
						<button className="flex justify-center items-center w-8 h-8">
							<BiChevronLeft className="w-6 h-6 hover:text-primary" />
						</button>
						{/* Thử  UI 1 nút */}
						<button className="w-8 h-8 font-medium rounded-full bg-primary text-white ">
							1
						</button>
						{pages.map((index, page) => {
							return (
								<button className="flex items-center justify-center w-8 h-8 font-medium rounded-full hover:text-primary">
									{/* bg-gray bg-opacity-25 */}
									{page + 2}
								</button>
							);
						})}
						<button className="flex justify-center items-center w-8 h-8">
							<BiChevronRight className="w-6 h-6 hover:text-primary" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
