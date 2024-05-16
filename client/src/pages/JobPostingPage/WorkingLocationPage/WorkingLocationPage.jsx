import { useNavigate } from 'react-router-dom';
import { StepBar } from '../components/StepBar/StepBar';
import { useState } from 'react';

export const WorkingLocationPage = () => {
	const [houseType, setHouseType] = useState("")
	const navigate = useNavigate();

	const handleNextStep = () => {
		navigate('/job-posting/details');
	};

	return (
		<div className="w-full px-20">
			<StepBar />

			<div className='location-form m-auto' style={{width: '530px'}}>
				<div className=''>
					<p className="font-bold">Loại nhà</p>
					<input type='text' value={"Nhà / nhà phố"} onClick={(e) => setHouseType(e.target.value)} className={`p-2 my-4 border-2 rounded-md hover:outline-none focus:outline-none hover:cursor-pointer ${houseType === 'Nhà / nhà phố' ? 'text-primary border-primary' : 'border-light_gray'}`}/>
					<input type='text' value={"Căn hộ"} onClick={(e) => setHouseType(e.target.value)} className={`p-2 my-4  border-2 rounded-md hover:outline-none focus:outline-none hover:cursor-pointer ${houseType === 'Căn hộ' ? 'text-primary border-primary' : 'border-light_gray'}`}/>
					<input type='text' value={"Biệt thự"} onClick={(e) => setHouseType(e.target.value)} className={`p-2 my-4 border-2 rounded-md hover:outline-none focus:outline-none hover:cursor-pointer ${houseType === 'Biệt thự' ? 'text-primary border-primary' : 'border-light_gray'}`}/>
				</div>
				<div>
					<p className='font-bold'>Số nhà, hẻm (ngõ)</p>
					<input type='text' placeholder='Số nhà 1, hẻm 2' className='p-2 my-4 border-light_gray border-2 rounded-md hover:outline-none focus:outline-none'/>
				</div>
				<p className='italic text-gray'>*Vui lòng chọn loại nhà, số nhà phù hợp để người giúp việc dễ dàng tìm kiếm</p>
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
