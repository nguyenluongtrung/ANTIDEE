import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import './PromotionManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import { deletePromotion, getAllPromotions } from '../../../features/promotions/promotionSlice';
import { Spinner } from '../../../components';
import toast, { Toaster } from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { CreatePromotion } from './CreatePromotion/CreatePromotion';
import { UpdatePromotion } from './UpdatePromotion/UpdatePromotion';
import { PromotionDetail } from './PromotionDetail/PromotionDetail';
import { formatDate } from '../../../utils/format';
import { useLocation, useNavigate } from 'react-router-dom';

export const PromotionManagement = () => {
    const [isOpenCreatePromotion, setIsOpenCreatePromotion] = useState(false);
    const [isOpenUpdatePromotion, setIsOpenUpdatePromotion] = useState(false);
    const [isOpenDetailPromotion, setIsOpenDetailPromotion] = useState(false);
    const { promotions, isLoading } = useSelector((state) => state.promotions);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllPromotions());
    }, []);

    const handleDeletePromotion = async (id) => {
        const result = await dispatch(deletePromotion(id));
        if (result.type.endsWith('fulfilled')) {
            toast.success('Xoá mã giảm giá thành công', successStyle);
        } else {
            toast.error(result?.payload, errorStyle);
        }
    };

    const handleGetAllPromotions = async () => {
        await dispatch(getAllPromotions());
    };

    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("/detail-promotion/")) {
            setIsOpenDetailPromotion(true);
            setIsOpenUpdatePromotion(false);

        } else if (location.pathname.includes("/update-promotion")) {
            setIsOpenDetailPromotion(false);
            setIsOpenUpdatePromotion(true);

        }
    }, [location.pathname]);


    const handleOpenCreatePromotion = () => {
        setIsOpenCreatePromotion(true);
    };

    const handleOpenDetailPromotion = (promotionId) => {
        navigate(`/admin-promotion/detail-promotion/${promotionId}`);
    };

    const handleOpenUpdatePromotion = (promotionId) => {
        navigate(`/admin-promotion/update-promotion/${promotionId}`);
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="w-full min-h-screen bg-white flex">
            <AdminSidebar />
            <div className="flex-1 px-10 pt-5">
                <Toaster />

                {isOpenCreatePromotion && (
                    <CreatePromotion
                        setIsOpenCreatePromotion={setIsOpenCreatePromotion}
                        handleGetAllPromotions={handleGetAllPromotions}
                    />
                )}
                {isOpenUpdatePromotion && (
                    <UpdatePromotion
                        setIsOpenUpdatePromotion={setIsOpenUpdatePromotion}
                    />
                )}
                {isOpenDetailPromotion && (
                    <PromotionDetail
                        setIsOpenDetailPromotion={setIsOpenDetailPromotion}
                    />
                )}

                <div className="flex justify-between items-center">
                    <div className="flex-1 pt-2">
                        <span>Hiển thị </span>
                        <select className="rounded-md p-1 mx-1 hover:cursor-pointer bg-gray-200">
                            <option>10</option>
                            <option>20</option>
                            <option>30</option>
                        </select>
                        <span> hàng</span>
                    </div>
                    <button
                        className="bg-pink text-white py-2 rounded-md"
                        style={{ width: '120px' }}
                        onClick={handleOpenCreatePromotion}
                    >
                        Thêm ưu đãi
                    </button>
                </div>

                <table className="w-full border-b border-gray mt-3">
                    <thead>
                        <tr className="text-sm font-medium text-gray-700 border-b">
                            <td className="py-2 px-1 text-center font-bold">Tên mã giảm giá</td>
                            <td className="py-2 px-1 text-center font-bold">Thời gian bắt đầu</td>
                            <td className="py-2 px-1 text-center font-bold">Thời gian kết thúc</td>
                            <td className="py-2 px-1 text-center font-bold">Giá trị ưu đãi</td>
                            <td className="py-2 px-1 text-center font-bold">Mã giảm giá</td>
                            <td className="py-2 px-1 text-center font-bold">Số lượng mã</td>
                            <td className="py-2 px-1 text-center font-bold">Trạng thái</td>
                            <td className="py-2 px-1 text-center font-bold">Chi tiết</td>
                            <td className="py-2 px-1 text-center font-bold">Hành động</td>
                        </tr>
                    </thead>
                    <tbody>
                        {promotions?.map((promotion) => {
                            const currentDate = new Date();
                            const endDate = new Date(promotion?.endDate);
                            const isExpired = endDate < currentDate;
                            const statusText = isExpired ? 'Đã hết hạn' : 'Đang hoạt động';
                            const statusClass = isExpired ? 'text-red font-bold bg-red bg-opacity-15 border-red border-2' : 'text-green font-bold bg-green bg-opacity-15 border-green border-2';


                            return (
                                <tr key={promotion?._id} className="hover:bg-light_purple transition-colors group odd:bg-light_purple hover:cursor-pointer bg-opacity- ">
                                    <td className="font-medium text-center text-gray p-3">{promotion?.promotionName}</td>
                                    <td className="font-medium text-center text-gray">{formatDate(promotion?.startDate)}</td>
                                    <td className="font-medium text-center text-gray">{formatDate(promotion?.endDate)}</td>
                                    <td className="font-medium text-center text-gray">{promotion?.promotionValue * 100} %</td>
                                    <td className="font-medium text-center text-gray">{promotion?.promotionCode}</td>
                                    <td className="font-medium text-center text-gray">{promotion?.promotionQuantity}</td>
                                    <td> <p className={`font-medium text-center rounded-full p-1 ${statusClass}`}>{statusText}</p></td>
                                    <td className="font-medium text-center text-gray">
                                        <button
                                            className="hover:cursor-pointer text-xl pt-1.5"
                                            onClick={() => handleOpenDetailPromotion(promotion?._id)}
                                        >
                                            <MdOutlineRemoveRedEye className="block mx-auto" />
                                        </button>
                                    </td>
                                    <td className="">
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="flex items-center justify-end py-3 pr-2 text-xl"
                                                onClick={() => handleOpenUpdatePromotion(promotion?._id)}
                                            >
                                                <BiEdit className="text-green" />
                                            </button>
                                            <button
                                                className="flex items-center justify-start py-3 pl-2 text-xl"
                                                onClick={() => handleDeletePromotion(promotion._id)}
                                            >
                                                <BiTrash className="text-red" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>
        </div>
    );
};
