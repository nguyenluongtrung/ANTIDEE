import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch } from 'react-redux';
import { rankingServices } from '../../../features/services/serviceSlice';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';

export const Dashboard = () => {
	const [serviceData, setServiceData] = useState();
	const [serviceCategories, setServiceCategories] = useState();
	const dispatch = useDispatch();
	const series = [
		{
			data: serviceData,
		},
	];
	const options = {
		chart: {
			type: 'bar',
			height: 200,
		},
		plotOptions: {
			bar: {
				borderRadius: 4,
				borderRadiusApplication: 'end',
				horizontal: true,
			},
		},
		xaxis: {
			categories: serviceCategories,
		},
	};

	useEffect(() => {
		const getRankingServices = async () => {
			const response = await dispatch(rankingServices());
			setServiceCategories(response.payload.categories);
			setServiceData(response.payload.data);
		};

		getRankingServices();
	}, []);

	return (
		<>
			<div className="w-full min-h-screen bg-white flex flex-row">
				<AdminSidebar />
				<div className="flex-1 px-10 pt-5">
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<div id="chart">
						<ReactApexChart
							options={options}
							series={series}
							type="bar"
							height={300}
							className="w-[30vw]"
						/>
					</div>
				</div>
			</div>
		</>
	);
};
