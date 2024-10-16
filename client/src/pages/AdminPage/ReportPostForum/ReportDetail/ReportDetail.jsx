import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllForumPosts } from "../../../../features/forumPost/forumPostSlice";

export const ReportDetail = ({ setIsOpenDetailReport }) => {
    const { reportId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [listPost, setListPost] = useState([]);
    const [chosenReport, setChosenReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');

    const openModal = (image) => {
        setCurrentImage(image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentImage('');
    };

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


    useEffect(() => {
        if (listPost.length > 0 && reportId) {
            const report = listPost.find((report) => String(report._id) === String(reportId));
            setChosenReport(report || null);
        }
    }, [reportId, listPost]);

    return (
        <div className="popup active w-[100%]">
            <div className="overlay" onClick={() => {
                navigate('/admin-report-forum');
                setIsOpenDetailReport(false);
            }}></div>
            <form className="content rounded-md p-5 max-h-[55%] w-[95%] ">
                <AiOutlineClose
                    className="absolute text-sm hover:cursor-pointer"
                    onClick={() => {
                        navigate('/admin-report-forum');
                        setIsOpenDetailReport(false);
                    }}
                />
                <p className="grid ml-4 text-green font-bold text-xl justify-center">
                    XEM CHI TIẾT BÁO CÁO
                </p>
                <table className="w-full h-full border-b border-gray mt-3">
                    <thead>
                        <tr className="text-sm font-medium text-gray border-b border-gray border-opacity-50">
                            <td className="py-2 px-4 text-center font-bold">Người đăng</td>
                            <td className="py-2 px-4 text-center font-bold">Nội dung</td>
                            <td className="py-2 px-4 text-center font-bold">Hình ảnh</td>
                            <td className="py-2 px-4 text-center font-bold">Lý do</td>
                        </tr>
                    </thead>
                    <tbody>
                        {chosenReport ? (
                            <tr className="hover:bg-primary hover:bg-opacity-25 transition-colors odd:bg-light_pink hover:cursor-pointer">
                                <td className="font-medium text-center text-gray">
                                    <span>{chosenReport.author?.name}</span>
                                </td>
                                <td className="font-medium text-center text-gray">
                                    <span>{chosenReport.content}</span>
                                </td>


                                <td className="font-medium text-center text-gray">
                                    <div className="flex justify-center items-center">
                                        <img
                                            className="w-20 h-20 lg:w-36 lg:h-36 md:w-36 md:h-36 block mx-auto cursor-pointer"
                                            src={chosenReport?.images}
                                            alt="Bài viết bị báo cáo không có hình ảnh đi kèm"
                                            onClick={() => openModal(chosenReport?.images)}
                                        />
                                    </div>
                                </td>


                                <td className="font-medium text-center text-gray">
                                    <ul>
                                        {chosenReport.hiddenDetails.reasons.map((reason, index) => (
                                            <li key={index}>{reason?.content}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">
                                    No report found for this ID.
                                </td>
                            </tr>
                        )}
                    </tbody>


                    {isModalOpen && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                            onClick={() => {
                                setIsModalOpen(false);
                            }}
                        >
                            <div
                                className="relative bg-white p-4 rounded shadow-lg"
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                            >
                                <AiOutlineClose
                                    className="absolute top-2 right-2 text-2xl hover:cursor-pointer text-gray-600 hover:text-black"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                    }}
                                />
                                <img
                                    src={currentImage}
                                    alt="Full Size"
                                    className="max-w-full max-h-[80vh] object-contain"
                                />
                                <button
                                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}




                </table>
            </form>
        </div>
    );
};
