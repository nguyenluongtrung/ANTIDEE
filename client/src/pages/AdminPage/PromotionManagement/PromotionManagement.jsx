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
import { calculateTotalPages, getPageItems, nextPage, previousPage } from '../../../utils/pagination';
import Pagination from '../../../components/Pagination/Pagination';
import DeletePopup from '../../../components/DeletePopup/DeletePopup';

export const PromotionManagement = () => {
    const [isOpenCreatePromotion, setIsOpenCreatePromotion] = useState(false);
    const [isOpenUpdatePromotion, setIsOpenUpdatePromotion] = useState(false);
    const [isOpenDetailPromotion, setIsOpenDetailPromotion] = useState(false);
    const { isLoading } = useSelector((state) => state.promotions);
    const [promotions, setPromotions] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [selectedIdDelete, setSelectedIdDelete] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    async function initiatePromotions() {
        let output = await dispatch(getAllPromotions());
        setPromotions(output.payload);
    }

    useEffect(() => {
        initiatePromotions();
    }, []);

    useEffect(() => {
        dispatch(getAllPromotions());
    }, []);

    const openDeletePopup = (promotionId) => {
        setSelectedIdDelete(promotionId);
        setIsDeletePopupOpen(true);
    };

    const closeDeletePopup = () => {
        setIsDeletePopupOpen(false);
        setSelectedIdDelete('');
    };

    const handleDeletePromotion = async () => {
        const result = await dispatch(deletePromotion(selectedIdDelete));
        if (result.type.endsWith('fulfilled')) {
            toast.success('Xoá mã giảm giá thành công', successStyle);
            setPromotions((prevPromotions) => prevPromotions.filter(promo => promo._id !== selectedIdDelete));
        } else {
            toast.error(result?.payload, errorStyle);
        }
        closeDeletePopup();
    };

    const handleGetAllPromotions = async () => {
        await dispatch(getAllPromotions());
    };

    const handleOpenDetailPromotion = (promotionId) => {
        navigate(`/admin-promotion/detail/${promotionId}`);
        setIsOpenDetailPromotion(true);
    };

    const handleOpenUpdatePromotion = (promotionId) => {
        navigate(`/admin-promotion/update/${promotionId}`);
        setIsOpenUpdatePromotion(true);
    };
    const handleOpenCreatePromotion = () => {
        navigate('/admin-promotion/create');
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1);
    };

    const filteredPromotions = promotions.filter((promotion) => {
        const currentDate = new Date();
        const endDate = new Date(promotion.endDate);
        const isExpired = endDate < currentDate;
        if (filterStatus === 'active') return !isExpired;
        if (filterStatus === 'expired') return isExpired;
        return true;
    });

    const totalPages = calculateTotalPages(filteredPromotions.length, rowsPerPage);
    const selectedPromotions = getPageItems(filteredPromotions, currentPage, rowsPerPage);

    const handleNextPage = () => {
        setCurrentPage(nextPage(currentPage, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage(previousPage(currentPage));
    };

    if (isLoading) {
        return <Spinner/>;
    }

    return (
        <div className="w-full min-h-screen bg-white flex">
            <AdminSidebar />
            <div className="flex-1 px-10 pt-5">
                <Toaster />

                <DeletePopup
                    open={isDeletePopupOpen}
                    onClose={closeDeletePopup}
                    deleteAction={handleDeletePromotion}
                    itemName="khuyến mãi"
                />

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
                    <div className="flex items-center">
                        <span>Hiển thị </span>
                        <select
                            className="rounded-md p-1 mx-1 hover:cursor-pointer bg-light_purple"
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                        >
                            <option>10</option>
                            <option>20</option>
                            <option>30</option>
                        </select>
                        <span> hàng</span>
                    </div>
                    <div>
                        <label htmlFor="status-filter">Lọc theo trạng thái: </label>
                        <select
                            id="status-filter"
                            className="rounded-md p-1 mx-1 hover:cursor-pointer bg-light_purple"
                            value={filterStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="all">Tất cả</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="expired">Đã hết hạn</option>
                        </select>
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
                        <tr className="text-sm font-medium text-gray border-b">
                            <td className="py-2 px-1 text-center font-bold">STT</td>
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
                        {selectedPromotions.map((promotion, index) => {
                            const currentDate = new Date();
                            const endDate = new Date(promotion?.endDate);
                            const isExpired = endDate < currentDate;
                            const statusText = isExpired ? 'Đã hết hạn' : 'Đang hoạt động';
                            const statusClass = isExpired ? 'text-red font-bold bg-red bg-opacity-15 border-red border-2' : 'text-green font-bold bg-green bg-opacity-15 border-green border-2';

                            return (
                                <tr key={promotion?._id} className="hover:bg-light_purple transition-colors group odd:bg-light_purple hover:cursor-pointer">
                                    <td className="font-medium text-center text-gray p-3">{index + 1}</td>
                                    <td className="font-medium text-center text-gray">{promotion?.promotionName}</td>
                                    <td className="font-medium text-center text-gray">{formatDate(promotion?.startDate)}</td>
                                    <td className="font-medium text-center text-gray">{formatDate(promotion?.endDate)}</td>
                                    <td className="font-medium text-center text-gray">{promotion?.promotionValue * 100} %</td>
                                    <td className="font-medium text-center text-gray">{promotion?.promotionCode}</td>
                                    <td className="font-medium text-center text-gray">{promotion?.promotionQuantity}</td>
                                    <td>
                                        <p className={`font-medium text-center rounded-full p-1 ${statusClass}`}>{statusText}</p>
                                    </td>
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
                                                <BiEdit className="text-green hover:text-primary" />
                                            </button>
                                            <button
                                                className="flex items-center justify-start py-3 pl-2 text-xl"
                                            >
                                                <BiTrash
                                                    className="text-red hover:text-primary"
                                                    onClick={() => openDeletePopup(promotion._id)}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="flex items-center justify-between border-t border-gray bg-white px-4 py-3 sm:px-6">
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray">
                                Hiển thị <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> đến{' '}
                                <span className="font-medium">
                                    {Math.min(currentPage * rowsPerPage, filteredPromotions.length)}
                                </span>{' '}
                                trong <span className="font-medium">{filteredPromotions.length}</span> kết quả
                            </p>
                        </div>
                        <div>
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                onPageChange={(page) => setCurrentPage(page)}
                                onNextPage={handleNextPage}
                                onPreviousPage={handlePreviousPage}
                                rowsPerPage={rowsPerPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
