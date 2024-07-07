import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import { AiOutlineClose } from 'react-icons/ai';
import { useEffect, useState } from 'react';

export const ImageDetail = ({ chosenAccountId, setIsOpenImageDetail, accounts }) => {
	const [chosenAccount, setChosenAccount] = useState(
		accounts[accounts.findIndex((account) => String(account._id) == String(chosenAccountId))]
	);


	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form className="content rounded-md p-5" style={{ width: '45vw' }}>
    <AiOutlineClose
        className="absolute text-sm hover:cursor-pointer"
        onClick={ () => {setIsOpenImageDetail(false)}}
    />
    <p className="grid text-green font-bold text-xl justify-center">
        XEM CHI TIẾT CÁC ẢNH
    </p>
    <div className="grid grid-cols-2 gap-4 mt-3">
        <div>
            <span className='font-bold'>Ảnh mặt trước CCCD</span>
            <div className="justify-center" style={{ width: '100%' }}>
                <img className="mx-auto"
                    src={chosenAccount?.resume[0]?.frontIdCard}
                />
            </div>
        </div>
        <div>
            <span className='font-bold'>Ảnh mặt sau CCCD</span>
            <div className="justify-center" style={{ width: '100%' }}>
                <img className="mx-auto"
                    src={chosenAccount?.resume[0]?.backIdCard}
                />
            </div>
        </div>
        <div>
            <span className='font-bold'>Ảnh mặt trước CCCD</span>
            <div className="justify-center" style={{ width: '100%' }}>
                <img className="mx-auto"
                    src={chosenAccount?.resume[0]?.curriculumVitae}
 
                />
            </div>
        </div>
        <div>
            <span className='font-bold'>Ảnh mặt trước CCCD</span>
            <div className="justify-center" style={{ width: '100%' }}>
                <img className="mx-auto"
                    src={chosenAccount?.resume[0]?.certificateOfResidence}

                />
            </div>
        </div>
    </div>
</form>
		</div>
	);
};
