import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getDomesticHelpersRanking } from '../../features/auth/authSlice';
import { IoIosArrowDown } from 'react-icons/io';
import './RankingPage.css';
import { IoSearchOutline } from 'react-icons/io5';

export const RankingPage = () => {
	const [ranking, setRanking] = useState([]);
	const [searchName, setSearchName] = useState('');
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			const result = await dispatch(getDomesticHelpersRanking());
			setRanking(result.payload);
		};
		fetchData();
	}, []);

	return (
		<div className="px-32 flex flex-col pt-20" style={{ minHeight: '100vh' }}>
			<div className="font-bold text-green text-2xl text-center mb-6">
				BẢNG XẾP HẠNG
			</div>
			<div className="flex mb-2">
				<div className="flex-1 pt-2">
					<div className="flex items-center">
						<span>Hiển thị </span>
						<select
							className="rounded-md p-1 mx-1 hover:cursor-pointer"
							style={{ backgroundColor: '#E0E0E0' }}
						>
							<option>10</option>
							<option>20</option>
							<option>30</option>
						</select>
						<span> hàng</span>
						<div className="relative w-56">
							<IoSearchOutline className="absolute top-2 left-7 search-icon" />
							<input
								placeholder="Nhập tên bạn muốn tìm"
								className="custom-input-border rounded-lg py-1 px-8 ml-5 text-sm focus:outline-none"
								onChange={(e) => setSearchName(e.target.value)}
							/>
						</div>
					</div>
				</div>
				<button
					className="bg-pink text-white rounded-md block mx-auto"
					style={{ width: '200px' }}
				>
					<div className="flex items-center">
						<IoIosArrowDown className="size-6 pl-2 mr-2" />
						<span className="text-sm pr-2">Xếp hạng theo tháng</span>
					</div>
				</button>
			</div>
			{ranking.length == 0 ||
			ranking?.filter((domesticHelper) =>
				domesticHelper.name.toUpperCase().includes(searchName.toUpperCase())
			).length == 0 ? (
				<div className="mx-auto mt-10">
					<img src="image/sad-icon.png" className="block m-auto w-52" />
					<p className="text-gray text-center">
						Rất tiếc, không tìm thấy giúp việc phù hợp!
					</p>
				</div>
			) : (
				<table>
					<thead>
						<th className="py-3">Thứ hạng</th>
						<th>Tên</th>
						<th>Số giờ làm việc</th>
						<th>Điểm phục vụ</th>
						<th>Thu nhập</th>
						<th>Cấp độ hiện tại</th>
						<th>Điểm xếp hạng</th>
					</thead>
					<tbody>
						{ranking
							?.filter((domesticHelper) =>
								domesticHelper.name
									.toUpperCase()
									.includes(searchName.toUpperCase())
							)
							.map((domesticHelper, index) => {
								return (
									<tr
										key={domesticHelper._id}
										className={`${index == 0 && 'bg-primary'} ${
											index == 1 && 'bg-another_primary'
										} ${index == 2 && 'bg-yellow'} ${
											index > 2 && 'odd:bg-super_light_purple'
										} text-center `}
									>
										<td className="py-5">
											<span>#{index + 1}</span>
										</td>
										<td>
											<span>{domesticHelper.name}</span>
										</td>
										<td>
											<span>{domesticHelper?.totalWorkingHours} giờ</span>
										</td>
										<td>
											<span>
												{Math.round(domesticHelper.rating?.domesticHelperRating || 0)}
											</span>
										</td>
										<td>
											<span>{domesticHelper.accountBalance} VND</span>
										</td>
										<td>
											<span className="bg-light_green text-green rounded-2xl px-7 py-2">
												{domesticHelper.accountLevel.domesticHelperLevel.name}
											</span>
										</td>
										<td>
											<span
												className={`${
													index <= 2 ? 'text-white' : 'text-anotherRed'
												} `}
											>
												{domesticHelper.domesticHelperRankingCriteria}
											</span>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			)}
		</div>
	);
};
