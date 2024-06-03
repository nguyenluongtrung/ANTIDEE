import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDomesticHelperFromFavoriteList, getAccountInformation } from "../../../features/auth/authSlice";
import { Spinner } from "../../../components";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { BiTrash } from "react-icons/bi";
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import toast from "react-hot-toast";

export const FavoriteList = () => {
    const dispatch = useDispatch();
    const { account, isLoading } = useSelector((state) => state.auth);

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

    if (isLoading) {
        return <Spinner />;
    }
    return (
        <div className="flex px-16">
            <div className="left-container pr-24 pt-3 w-1/3">
                <Sidebar account={account} />
            </div>
            <div>

                {account.favoriteList && account.favoriteList.length > 0 ? (
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
                            {account.favoriteList.map((item, index) => (
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
            </div>
        </div>
    );
};
