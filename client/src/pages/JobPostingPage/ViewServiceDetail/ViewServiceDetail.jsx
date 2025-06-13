import { StepBar } from '../components/StepBar/StepBar';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAllServices } from '../../../features/services/serviceSlice';
import { Spinner } from '../../../components';
export const ViewServiceDetail = () => {
	const { serviceId } = useParams();
	const {services, isLoading: serviceLoading} = useSelector((state) => state.services);
	const [chosenService, setChosenService] = useState(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleNextStep = () => {
		navigate(`/job-posting/working-location/${serviceId}`);
	};

	useEffect(() => {
		const asyncFn = async () => {
			const result = await dispatch(getAllServices());
			const chosenService = result.payload.find(
				(service) => String(service._id) === String(serviceId)
			);
			setChosenService(chosenService);
		};
		asyncFn();
	}, [serviceId]);

	if(serviceLoading){
		return <Spinner />
	}

	return (
		<div className="w-full px-4 md:px-6 lg:px-20">
			<StepBar serviceId={serviceId} />

			<div className="max-w-screen-lg mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-4 sm:px-8">
				<div>
					<img
						src={chosenService?.image}
						alt={chosenService?.name}
						className="w-full max-w-md mx-auto rounded-2xl"
					/>
				</div>
				<div className="text-center lg:text-left">
					<h2 className="text-primary text-xl font-bold mb-4">{chosenService?.name}</h2>
					<p className="text-gray-700 text-justify">{chosenService?.description}</p>
				</div>
			</div>

			<div className="flex items-center justify-center mt-12 mb-10">
				<button
					onClick={handleNextStep}
					className="w-60 sm:w-72 md:w-96 py-3 bg-primary rounded-full text-white font-semibold hover:opacity-80 transition"
				>
					Tiếp theo
				</button>
			</div>
		</div>
	);
};
