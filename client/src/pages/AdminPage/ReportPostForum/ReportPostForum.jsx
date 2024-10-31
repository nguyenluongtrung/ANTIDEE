import toast, { ToastBar, Toaster } from "react-hot-toast";
import { BiEdit, BiTrash } from "react-icons/bi";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import { IoAddOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    getAllForumPosts,
    updateHiddenDetails,
} from "../../../features/forumPost/forumPostSlice";
import { successStyle } from "../../../utils/toast-customize";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ReportDetail } from "./ReportDetail/ReportDetail";
import { calculateTotalPages, getPageItems, nextPage, previousPage } from "../../../utils/pagination";
import Pagination from "../../../components/Pagination/Pagination";

export const ReportPostForum = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [listPost, setListPost] = useState([]);
    const [isOpenDetailReport, setIsOpenDetailReport] = useState(false);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    async function initialListPost() {
        let output = await dispatch(getAllForumPosts());
        const postsWithReasons = output.payload.filter(
            (post) =>
                post.hiddenDetails &&
                post.hiddenDetails.reasons &&
                post.hiddenDetails.reasons.length > 0
        );
        setListPost(postsWithReasons);
    }

    useEffect(() => {
        initialListPost();
    }, []);

    const handleStatusChange = async (newStatus, postId) => {
        const updatedStatus = newStatus === "true" ? true : false;

        const result = await dispatch(
            updateHiddenDetails({ postId, status: updatedStatus })
        );

        if (result.type.endsWith("fulfilled")) {
            toast.success("Status đã được thay đổi !", successStyle);
            setListPost((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? {
                            ...post,
                            hiddenDetails: { ...post.hiddenDetails, status: updatedStatus },
                        }
                        : post
                )
            );
        } else {
            toast.error("Có lỗi xảy ra khi thay đổi status !", errorStyle);
        }
    };

    const handleBulkStatusChange = async (newStatus) => {
        const updatedStatus = newStatus === "true" ? true : false;

        try {
            await Promise.all(
                listPost.map((post) =>
                    dispatch(
                        updateHiddenDetails({ postId: post._id, status: updatedStatus })
                    )
                )
            );

            setListPost((prevPosts) =>
                prevPosts.map((post) => ({
                    ...post,
                    hiddenDetails: {
                        ...post.hiddenDetails,
                        status: updatedStatus,
                    },
                }))
            );

            toast.success(
                `Tất cả bài viết đã được cập nhật thành ${updatedStatus ? "Ẩn" : "Hiển thị"
                }!`,
                successStyle
            );
        } catch (error) {
            toast.error(
                "Có lỗi xảy ra khi cập nhật trạng thái hàng loạt!",
                errorStyle
            );
        }
    };

    const handleOpenDetailReport = (reportId) => {
        navigate(`/admin-report-forum/report-detail/${reportId}`);
    };

    useEffect(() => {
        if (location.pathname.includes("/report-detail/")) {
            setIsOpenDetailReport(true);
        }
    }, [location.pathname]);

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };


    const totalPages = calculateTotalPages(listPost.length, rowsPerPage);
    const selectedListPost = getPageItems(listPost, currentPage, rowsPerPage);

    const handleNextPage = () => {
        setCurrentPage(nextPage(currentPage, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage(previousPage(currentPage));
    };


    return (
        <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row">
            <AdminSidebar className="w-full lg:w-auto" />
            <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 pt-5">
                <Toaster>
                    {(t) => (
                        <ToastBar
                            toast={t}
                            style={{
                                ...t.style,
                                animation: t.visible
                                    ? "custom-enter 1s ease"
                                    : "custom-exit 1s ease",
                            }}
                        />
                    )}
                </Toaster>
                {isOpenDetailReport && (
                    <ReportDetail setIsOpenDetailReport={setIsOpenDetailReport} />
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                    <div className="flex-1 pt-2 text-center sm:text-left">
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
                    <div className="flex justify-center sm:justify-end mt-4 sm:mt-0">
                        <button
                            className="bg-green text-white rounded-md px-4 py-2 mr-2 w-full sm:w-auto"
                            onClick={() => handleBulkStatusChange("false")}
                        >
                            Hiển Thị Tất Cả
                        </button>
                        <button
                            className="bg-red text-white rounded-md px-4 py-2 w-full sm:w-auto"
                            onClick={() => handleBulkStatusChange("true")}
                        >
                            Ẩn Tất Cả
                        </button>
                    </div>
                </div>

                <table className="w-full border-b border-gray-300 mt-3">
                    <thead>
                        <tr className="text-xs md:text-sm font-medium text-gray border-b border-gray border-opacity-50">
                            <td className="py-2 px-2 md:px-4 text-center font-bold">STT</td>
                            <td className="py-2 px-2 md:px-4 text-center font-bold">Người đăng</td>
                            <td className="py-2 px-2 md:px-4 text-center font-bold">Lý do</td>
                            <td className="py-2 px-2 md:px-4 text-center font-bold">Status</td>
                            <td className="py-2 px-2 md:px-4 text-center font-bold">Chi tiết</td>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedListPost?.map((post, index) => {
                            return (
                                <tr
                                    className="hover:bg-primary hover:bg-opacity-25 transition-colors odd:bg-light_pink hover:cursor-pointer"
                                    key={index}
                                >
                                    <td className="font-medium text-center text-gray p-2 md:p-3">
                                        <span>{index + 1}</span>
                                    </td>
                                    <td className="font-medium text-center text-gray">
                                        <span>{post?.author?.name}</span>
                                    </td>
                                    <td className="font-medium text-center text-gray">
                                        <span>
                                            {post?.hiddenDetails?.reasons?.length > 0
                                                ? post.hiddenDetails.reasons[0].content
                                                : "No reason provided"}
                                        </span>
                                    </td>
                                    <td className="font-medium text-center text-gray">
                                        <select
                                            value={post?.hiddenDetails?.status.toString()}
                                            className={`border rounded px-2 py-1 ${post?.hiddenDetails?.status === false
                                                ? "text-green"
                                                : "text-red"
                                                }`}
                                            onChange={(e) =>
                                                handleStatusChange(e.target.value, post._id)
                                            }
                                        >
                                            <option
                                                value="false"
                                                className="text-green font-semibold"
                                            >
                                                Hiển thị
                                            </option>
                                            <option
                                                value="true"
                                                className="text-red font-semibold"
                                            >
                                                Ẩn
                                            </option>
                                        </select>
                                    </td>
                                    <td className="font-medium text-center text-gray">
                                        <button
                                            className="hover:cursor-pointer text-xl pt-1.5"
                                            onClick={() => handleOpenDetailReport(post?._id)}
                                        >
                                            <MdOutlineRemoveRedEye className="block mx-auto" />
                                        </button>
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
                                    {Math.min(currentPage * rowsPerPage, listPost.length)}
                                </span>{' '}
                                trong <span className="font-medium">{listPost.length}</span> kết quả
                            </p>
                        </div>
                        <div>
                            <Pagination totalPages={totalPages}
                                currentPage={currentPage}
                                onPageChange={(page) => setCurrentPage(page)}
                                onNextPage={handleNextPage}
                                onPreviousPage={handlePreviousPage}
                                rowsPerPage={rowsPerPage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};