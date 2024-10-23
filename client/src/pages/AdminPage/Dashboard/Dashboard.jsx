import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import {
	getAllReports,
	getDomesticHelpersRanking,
} from "../../../features/auth/authSlice";
import { FaMoneyBillWave } from "react-icons/fa";
import {
	MdOutlineCleaningServices,
	MdOutlineSupervisorAccount,
	MdWork,
} from "react-icons/md";
import ColumnChart from "./components/ColumnChart/ColumnChart";
import DonutChart from "./components/PieChart/PieChart";
import AreaChart from "./components/AreaChart/AreaChart";
import { getRevenueByCurrentMonth } from "../../../features/jobPosts/jobPostsSlice";

export const Dashboard = () => {
	const [numOfServices, setNumOfServices] = useState();
	const [numOfAccounts, setNumOfAccounts] = useState();
	const [numOfJobPosts, setNumOfJobPosts] = useState();
	const [ranking, setRanking] = useState([]);
	const [revenueByCurrentMonth, setRevenueByCurrentMonth] = useState();
	const dispatch = useDispatch();

	useEffect(() => {
		const initiateAllReports = async () => {
			const response = await dispatch(getAllReports());
			setNumOfServices(response.payload.numOfServices);
			setNumOfAccounts(response.payload.numOfAccounts);
			setNumOfJobPosts(response.payload.numOfJobPosts);
		};
		initiateAllReports();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			const result = await dispatch(getDomesticHelpersRanking());
			setRanking(result.payload);
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			const result = await dispatch(getRevenueByCurrentMonth());
			setRevenueByCurrentMonth(result.payload);
		};
		fetchData();
	}, []);

	return (
		<>
			<div className="w-full min-h-screen bg-white flex flex-row">
				<AdminSidebar />
				<div className="flex-1 pl-10 pr-20 pb-10 pt-5">
					<h1 className="text-3xl font-bold mb-5" style={{ color: "#514e83" }}>
						Dashboard
					</h1>
					<div
						className="rounded-lg px-16 py-8 mb-10"
						style={{ backgroundColor: "#faf6fb" }}
					>
						<p className="font-bold mb-5">Tổng quan về hoạt động</p>
						<div className="flex justify-between">
							<div
								className="rounded-lg p-5 mb-3 w-48"
								style={{ backgroundColor: "#ffe2e6" }}
							>
								<div
									className="rounded-full p-2.5 w-10 mb-3"
									style={{ borderRadius: "50%", backgroundColor: "#fa5a7e" }}
								>
									<FaMoneyBillWave color="white" size={20} />
								</div>
								<p className="font-bold text-xl mb-2">
									{revenueByCurrentMonth} VND
								</p>
								<p>Doanh thu</p>
							</div>
							<div
								className="rounded-lg p-5 mb-3 w-48"
								style={{ backgroundColor: "#fff4de" }}
							>
								<div
									className="rounded-full p-2.5 w-10 mb-3"
									style={{ borderRadius: "50%", backgroundColor: "#ff947a" }}
								>
									<MdWork color="white" size={20} />
								</div>
								<p className="font-bold text-xl mb-2">{numOfJobPosts}</p>
								<p>Công việc được đăng</p>
							</div>
							<div
								className="rounded-lg p-5 mb-3 w-48"
								style={{ backgroundColor: "#dcfce7" }}
							>
								<div
									className="rounded-full bg-green p-3 w-10 mb-3"
									style={{ borderRadius: "50%" }}
								>
									<MdOutlineCleaningServices color="white" />
								</div>
								<p className="font-bold text-xl mb-2">{numOfServices}</p>
								<p>Dịch vụ</p>
							</div>
							<div
								className="rounded-lg p-5 mb-3 w-48"
								style={{ backgroundColor: "#f4e8ff" }}
							>
								<div
									className="rounded-full bg-purple p-2.5 w-10 mb-3"
									style={{ borderRadius: "50%" }}
								>
									<MdOutlineSupervisorAccount color="white" size={20} />
								</div>
								<p className="font-bold text-xl mb-2">{numOfAccounts}</p>
								<p>Tài khoản</p>
							</div>
						</div>
					</div>
					<div className="flex justify-between mb-10">
						<div
							className="rounded-lg p-10 gap-5 w-[35vw]"
							style={{ backgroundColor: "#faf6fb" }}
						>
							<DonutChart />
						</div>
						<div
							className="rounded-lg p-10 gap-5 w-[35vw]"
							style={{ backgroundColor: "#faf6fb" }}
						>
							<AreaChart />
						</div>
					</div>
					<div className="flex justify-between mb-10">
						<div
							className="rounded-lg p-10 gap-5 w-[35vw]"
							style={{ backgroundColor: "#faf6fb" }}
						>
							<ColumnChart isCustomerMode={false} />
						</div>
						<div
							className="rounded-lg p-10 gap-5 w-[35vw]"
							style={{ backgroundColor: "#faf6fb" }}
						>
							<ColumnChart isCustomerMode={true} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
