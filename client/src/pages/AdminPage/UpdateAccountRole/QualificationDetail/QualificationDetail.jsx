import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import { AiOutlineClose } from 'react-icons/ai';
import { useEffect, useState } from 'react';

export const QualificationDetail = ({ chosenAccountId, setIsOpenDetailAccount, accounts }) => {
	const qualificationImg =
		'https://cdn-icons-png.freepik.com/512/7238/7238706.png';
	const [chosenAccount, setChosenAccount] = useState(
		accounts[accounts.findIndex((account) => String(account._id) == String(chosenAccountId))]
	);


	return (
		<div className="popup active">
			<div className="overlay"></div>

			<form className="content rounded-md p-5" style={{ width: '35vw' }}>
    <AiOutlineClose
        className="absolute text-sm hover:cursor-pointer"
        onClick={() => { setIsOpenDetailAccount(false) }}
    />
    <p className="grid text-green font-bold text-xl justify-center">
        XEM CHI TIẾT CÁC CHỨNG CHỈ
    </p>
    <div className="flex justify-center mt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:h-80 p-5 overflow-y-auto justify-items-center">
            {chosenAccount?.resume[0]?.qualifications?.map((qualification, index) => (
                <div key={index} className="flex flex-col items-center">
                    
                    <img 
                        src={qualificationImg} 
                        alt={qualification.name} 
                        className="mx-auto" 
                        style={{ width: '210px', height: '210px' }}
                    />
					<span className=" text-center mb-2">{qualification.name}</span>
                </div>
            ))}
        </div>
    </div>
</form>
		</div>
	);
};
