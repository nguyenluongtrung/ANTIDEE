import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCourse, getAllCourse } from '../../../features/courses/courseSlice';
import { Spinner } from '../../../components';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../utils/toast-customize';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { IoAddOutline } from 'react-icons/io5';
import { CoursesDetail } from './CourseDetail/CourseDetail';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { calculateTotalPages, getPageItems, nextPage, previousPage } from '../../../utils/pagination';
import Pagination from '../../../components/Pagination/Pagination';
import DeletePopup from '../../../components/DeletePopup/DeletePopup';

export const CourseManagement = () => {
    const [isOpenDetailCourse, setIsOpenDetailCourse] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [selectedCourseIdDelete, setSelectedCourseIdDelete] = useState('');
    const [courses, setCourses] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const handleGetAllCourse = async () => {
        const response = await dispatch(getAllCourse())
        setCourses(response.payload)
    };

    useEffect(() => {
        handleGetAllCourse();
    }, []);

    const openDeletePopup = (courseId) => {
        setSelectedCourseIdDelete(courseId);
        setIsDeletePopupOpen(true);
    };

    const closeDeletePopup = () => {
        setIsDeletePopupOpen(false);
        setSelectedCourseIdDelete('');
    };

    const handleDeleteCourse = async () => {
        const result = await dispatch(deleteCourse(selectedCourseIdDelete));
        if (result.type.endsWith('fulfilled')) {
            toast.success('Xoá khóa học thành công', successStyle);
        } else if (result?.error?.message === 'Rejected') {
            toast.error(result?.payload, errorStyle);
        }
        handleGetAllCourse()
        closeDeletePopup();
    };


    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const totalPages = calculateTotalPages(courses.length, rowsPerPage);
    const selectedCourses = getPageItems(courses, currentPage, rowsPerPage);

    const handleNextPage = () => {
        setCurrentPage(nextPage(currentPage, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage(previousPage(currentPage));
    };


    if (!Array.isArray(courses)) {
        return <Spinner />;
    }

    return (
        <div className="w-full min-h-screen bg-white flex flex-row">
            <AdminSidebar />
            <div className="flex-1 px-10 pt-5">
                <Toaster>
                    {(t) => (
                        <ToastBar
                            toast={t}
                            style={{
                                ...t.style,
                                animation: t.visible
                                    ? 'custom-enter 1s ease'
                                    : 'custom-exit 1s ease',
                            }}
                        />
                    )}
                </Toaster>

                <DeletePopup
                    open={isDeletePopupOpen}
                    onClose={closeDeletePopup}
                    deleteAction={handleDeleteCourse}
                    itemName="khóa học"
                />

                {isOpenDetailCourse && (
                    <CoursesDetail
                        setIsOpenDetailCourse={setIsOpenDetailCourse}
                        handleGetAllCourse={handleGetAllCourse}
                        courses={courses}
                    />
                )}

                <div className="flex">
                    <div className="flex-1 pt-2">
                        <span>Hiển thị </span>
                        <select
                            className="rounded-md p-1 mx-1 hover:cursor-pointer"
                            style={{ backgroundColor: '#E0E0E0' }}
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}>
                            <option>10</option>
                            <option>20</option>
                            <option>30</option>
                        </select>
                        <span> hàng</span>
                    </div>
                    <Link to="/admin-course/create">
                        <button
                            className="bg-pink text-white rounded-md block mx-auto"
                            style={{ width: '170px' }}
                        >
                            <div className="flex items-center">
                                <IoAddOutline className="size-10 pl-2 mr-2" />
                                <span className="text-sm pr-1">Thêm khóa học</span>
                            </div>
                        </button>
                    </Link>
                </div>
                <table className="w-full border-b border-gray mt-3">
                    <thead>
                        <tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
                            <td className="py-2 px-4 text-center font-bold">STT</td>
                            <td className="py-2 px-4 text-center font-bold">Tên</td>
                            <td className="py-2 px-4 text-center font-bold">Chứng chỉ</td>
                            <td className="py-2 px-4 text-center font-bold">Thời gian</td>
                            <td className="py-2 px-4 text-center font-bold">Số lượng bài học</td>
                            <td className="py-2 px-4 text-center font-bold">Chi tiết</td>
                            <td className="py-2 px-4 text-center font-bold">Hành Động</td>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedCourses?.map((course, index) => {
                            return (
                                <tr className="hover:bg-light_purple transition-colors group odd:bg-light_purple hover:cursor-pointer">
                                    <td className="font-medium text-center text-gray p-3">
                                        <span>{index + 1}</span>
                                    </td>
                                    <td className="font-medium text-center text-gray">
                                        <span>{course?.name}</span>
                                    </td>
                                    <td className="font-medium text-center text-gray">
                                        <span>
                                            {course?.qualificationId?.name}
                                        </span>
                                    </td>
                                    <td className="font-medium text-center text-gray">
                                        <span>{course.duration} phút</span>
                                    </td>
                                    <td className="font-medium text-center text-gray">
                                        <span>{course.lessons ? course.lessons.length : 0}</span>
                                    </td>
                                    <td className="font-medium text-center text-gray">
                                        <button
                                            className="hover:cursor-pointer text-xl pt-1.5"
                                            onClick={() => {
                                                setIsOpenDetailCourse(true);
                                                navigate(`/admin-course/detail/${course._id}`);
                                            }}
                                        >
                                            <MdOutlineRemoveRedEye className="block mx-auto hover:text-primary" />
                                        </button>
                                    </td>
                                    <td className="">
                                        <div className="flex items-center justify-center">
                                            <Link to={`/admin-course/update/${course._id}`}>
                                                <button
                                                    className="flex items-center justify-end py-3 pr-2 text-xl"
                                                >
                                                    <BiEdit className="text-green hover:text-primary" />
                                                </button>
                                            </Link>
                                            <div>
                                                <button className="flex items-center  py-3 pl-2 text-xl">
                                                    <BiTrash
                                                        className="text-red hover:text-primary"
                                                        onClick={() => openDeletePopup(course._id)}
                                                    />
                                                </button>
                                            </div>
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
                                    {Math.min(currentPage * rowsPerPage, courses.length)}
                                </span>{' '}
                                trong <span className="font-medium">{courses.length}</span> kết quả
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
