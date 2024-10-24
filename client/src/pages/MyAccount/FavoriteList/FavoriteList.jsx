import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDomesticHelperFromFavoriteList, getAccountInformation } from "../../../features/auth/authSlice";
import { Spinner } from "../../../components";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { BiTrash } from "react-icons/bi";
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import toast from "react-hot-toast";
import { calculateTotalPages, getPageItems, nextPage, previousPage } from "../../../utils/pagination";

export const FavoriteList = () => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);
    const [accounts, setAccounts] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    async function initiateAccountInformation() {
        let output = await dispatch(getAccountInformation());

        setAccounts(output.payload);
    }

    useEffect(() => {
        initiateAccountInformation();
    }, []);
    useEffect(() => {
        dispatch(getAccountInformation());
    }, [dispatch]);

    const handleDeleteDomesticHelper = async (id) => {
        const result = await dispatch(deleteDomesticHelperFromFavoriteList(id));
        if (result.type.endsWith('fulfilled')) {
            toast.success('Xoá thành công', successStyle);
        } else if (result?.error?.message === 'Rejected') {
            toast.error(result?.payload, errorStyle);
        }
        dispatch(getAccountInformation());
    }

    const totalPages = calculateTotalPages(accounts.favoriteList?.length || 0, rowsPerPage);
    const currentItems = getPageItems(accounts.favoriteList, currentPage, rowsPerPage);

    const handleNextPage = () => setCurrentPage(nextPage(currentPage, totalPages));
    const handlePreviousPage = () => setCurrentPage(previousPage(currentPage));



    if (isLoading) {
        return <Spinner />;
    }
    return (
        <div className="flex px-16 pt-20">
            <div className="left-container pr-24 pt-3 w-1/3">
                <Sidebar account={accounts} />
            </div>
            <div>

                {accounts.favoriteList && accounts.favoriteList.length > 0 ? (
                    <table className="w-full border-b border-gray mt-3">
                        <thead>
                            <tr className="text-sm font-medium text-gray border-b border-gray border-opacity-50">
                                <td className="py-2 px-4 text-center font-bold">STT</td>
                                <td className="py-2 px-4 text-center font-bold">Tên</td>
                                <td className="py-2 px-4 text-center font-bold">Địa Chỉ</td>
                                <td className="py-2 px-4 text-center font-bold">Email</td>
                                <td className="py-2 px-4 text-center font-bold">Option</td>

                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr className="hover:bg-light_purple transition-colors
                                 group odd:bg-light_purple hover:cursor-pointer">
                                    <td className="font-medium text-center text-gray p-3">
                                        <span>{index + 1}</span>
                                    </td>
                                    <td className="font-medium text-center text-gray pl-2 pr-2">
                                        <span>{item?.domesticHelperId?.name}</span>
                                    </td>
                                    <td className="font-medium text-center text-gray pl-2 pr-2">
                                        <span>{item?.domesticHelperId?.address}</span>
                                    </td>
                                    <td className="font-medium text-center text-gray pl-2 pr-2">
                                        <span>{item?.domesticHelperId?.email}</span>
                                    </td>
                                    <td className="pl-2 pr-2">
                                        <div className="flex items-center justify-center">

                                            <button className="flex items-center justify-start py-3 pl-2 text-xl">
                                                <BiTrash
                                                    className="text-red"
                                                    onClick={() => handleDeleteDomesticHelper(item?.domesticHelperId?._id)}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                ) : (
                    <span className="text-lg">
                        Không có người giúp việc nào trong danh sách yêu thích
                    </span>
                )}
                <div className="flex justify-center items-center mt-4 space-x-2">
                    <button
                        className="bg-light_gray hover:bg-gray hover:text-white w-fit px-4 py-2 rounded disabled:opacity-50"
                        disabled={currentPage === 1}
                        onClick={handlePreviousPage}
                    >
                        &#9664;
                    </button>
                    <span className="text-xs md:text-sm font-semibold">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="bg-light_gray hover:bg-gray hover:text-white w-fit px-4 py-2 rounded disabled:opacity-50"
                        disabled={currentPage === totalPages}
                        onClick={handleNextPage}
                    >
                        &#9654;
                    </button>
                </div>
            </div>
        </div>
    );
};
