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
	}, []);

	if(serviceLoading){
		return <Spinner />
	}

	return (
		<div className="w-full px-20">
			<StepBar serviceId={serviceId}/>

			<div className="flex relative gap-x-10 mt-10 mx-40">
				<div className="">
					<img
						className="rounded-2xl"
						style={{width: '400px'}}
						src={chosenService?.image}
					/>
				</div>
				<div className="flex-1">
					<div className="mb-6 font-bold text-primary text-lg">
						{chosenService?.name}
					</div>
					<div className='text-justify'>
						{chosenService?.description}
					</div>
				</div>
			</div>

			<div className="flex items-center justify-center">
				<button
					className="mt-10 w-[500px] py-3 bg-primary rounded-full text-white hover:opacity-70"
					onClick={handleNextStep}
				>
					Tiếp theo
				</button>
			</div>
		</div>
	);
};
