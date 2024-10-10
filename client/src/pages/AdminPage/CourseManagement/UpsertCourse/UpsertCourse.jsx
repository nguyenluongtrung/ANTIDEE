import React, { useEffect, useRef, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar'
import { useNavigate, useParams } from 'react-router-dom';
import { useFirebaseImageUpload } from '../components/useFirebaseImageUpload';
import { useDispatch, useSelector } from 'react-redux';
import { getAllQualifications } from '../../../../features/qualifications/qualificationSlice';
import LessonComponent from '../components/LessonComponent';
import { createCourse } from '../../../../features/courses/courseSlice';
import toast, { Toaster } from 'react-hot-toast';

export const UpsertCourse = () => {
    const params = useParams();

    const { qualifications, isLoading } = useSelector(
        (state) => state.qualifications
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllQualifications());
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: 60, //Default
        qualificationId: '6631dea2694c0fc5f17c5c9d', //Default là chứng chỉ trông trẻ
        lessons: [
            {
                title: '',
                content: [],
            },
        ],
    })

    //Update
    useEffect(() => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzFlMzJhN2JkNjhiNGEwMWIyZjM2MyIsImlhdCI6MTcyODUwMjU0NSwiZXhwIjoxNzMxMDk0NTQ1fQ._eCMxgkgQpLKt3pyHMxzqpJiFhqC0m5_P4oJCChyIl0" // Lấy token từ localStorage (hoặc thay thế bằng cách bạn lưu token)

        if (!token) {
            console.error('No token found!');
            return;
        }

        fetch(`http://localhost:5173/antidee/api/course/${params.courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {

                if (data.status === 'success') {
                    const course = data.data.course;



                    setFormData({
                        name: course.name,
                        description: course.description,
                        duration: course.duration,
                        qualificationId: course.qualificationId,
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching course:", error);
            });


        fetch(`http://localhost:5173/antidee/api/course/${params.courseId}/lessons`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setFormData(prevState => ({
                        ...prevState,
                        lessons: data.data.lessons
                    }));
                }


            })
            .catch((error) => {
                console.error("Error fetching lessons:", error);
            });

    }, [params.courseId]);



    const handleFormChange = (field, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: value
        }))
        const error = validateField(field, value)
        setErrors({ ...errors, [field]: error })
    }

    const { setFile, filePerc, fileUploadError, imageUrl } = useFirebaseImageUpload();
    const fileRef = useRef(null);

    const addLesson = () => {
        setFormData(prevState => ({
            ...prevState,
            lessons: [
                ...prevState.lessons,
                { title: '', content: [] },
            ],
        }));
    };

    const handleRemoveLesson = (lessonIndex) => {
        const updatedLessons = formData.lessons.filter((_, index) => index !== lessonIndex);
        setFormData(prevState => ({
            ...prevState,
            lessons: updatedLessons
        }));
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();




        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin.');
            return;
        }

        const courseData = { ...formData, img: imageUrl }

        const resultCreateCourse = await dispatch(createCourse(courseData));


        if (resultCreateCourse.type.endsWith('fulfilled')) {
            navigate("/admin-course");
            toast.success('Thêm bài kiểm tra thành công');
        } else if (resultCreateCourse?.error?.message === 'Rejected') {

            toast.error(resultCreateCourse?.payload);
        }
    }




    const [errors, setErrors] = useState({
        name: '',
        description: '',
        lessons: []
    });

    const validateField = (field, value) => {
        let error = '';

        if (!value.trim()) {
            error = 'Trường này không được để trống.';
        } else if (value.length > 255) {
            error = 'Không được vượt quá 255 ký tự.';
        } else if (/\s{2,}/.test(value)) {
            error = 'Không được có hơn 2 khoảng trống liên tiếp.';
        }

        return error;
    }


    const validateForm = () => {
        const newErrors = {
            name: validateField('name', formData.name),
            description: validateField('description', formData.description),
            lessons: formData.lessons.map(lesson => ({
                title: validateField('title', lesson.title)
            }))
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => {
            if (Array.isArray(error)) {
                return error.some(e => Object.values(e).some(value => value !== ""));
            }
            return error !== "";
        });

        return !hasErrors;
    }


    return (
        <div className='w-full min-h-screen bg-white flex flex-row'>
            <div>
                <AdminSidebar />
            </div>
            <Toaster />

            <div className='w-full p-10'>

                <div className='flex items-center mb-10 text-2xl font-bold'>Đang <p className='text-primary text-2xl px-2'>{params.courseId ? 'Cập nhật' : 'Tạo mới'}</p>  Khoá học </div>
                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-x-10 '>

                    <div className="flex flex-col w-full col-span-1 lg:col-span-4">
                        <div className="text-gray mb-2">Nhập tên khoá học</div>
                        <input
                            className="shadow appearance-none border py-3 px-3 rounded"
                            value={formData.name}
                            onChange={e => handleFormChange('name', e.target.value)} // Thay đổi key 'name'
                        />
                        <div className='h-4 mb-6'>

                            {errors.name && (
                                <div className="text-red mt-2 text-sm px-2">
                                    {errors.name}
                                </div>
                            )}
                        </div>
                    </div>


                    <div className='w-full col-span-1 lg:col-span-4'>
                        <div className="text-gray mb-2">Chứng chỉ khoá học</div>
                        <select
                            className="shadow  border py-3 px-3 rounded mb-10"
                            style={{ width: '100%' }}
                            onChange={e => handleFormChange('qualificationId', e.target.value)}
                            value={formData.qualificationId}
                        >
                            {qualifications?.map((qualification, index) => <option key={index} value={qualification._id}>{qualification.name}</option>)}
                        </select>
                    </div>


                    <div className="flex flex-col w-full col-span-1 lg:col-span-4">
                        <div className="text-gray mb-2">Thời gian ước tính hoàn thành</div>
                        <input
                            className="shadow appearance-none border py-3 px-3 rounded"
                            value={formData.duration}
                            onChange={e => handleFormChange('duration', e.target.value)} // Thay đổi key 'name'
                        />
                        <div className='h-4 mb-6'>

                            {errors.duration && (
                                <div className="text-red mt-2 text-sm px-2">
                                    {errors.duration}
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="flex flex-col w-full col-span-1 lg:col-span-8">
                        <div className="text-gray mb-2">Nhập mô tả khoá học</div>
                        <textarea
                            className="shadow appearance-none border py-3 px-3 rounded h-32"
                            value={formData.description}
                            onChange={e => handleFormChange('description', e.target.value)}
                        />
                        <div className='h-4 mb-6'>
                            {errors.description && (
                                <div className="text-red mt-2 text-sm px-2">
                                    {errors.description}
                                </div>
                            )}
                        </div>
                    </div>



                    <div className='w-full col-span-1 lg:col-span-4'>
                        <div className="text-gray mb-2">Upload hình ảnh khoá học</div>
                        <button
                            onClick={() => fileRef.current.click()}
                            className="bg-blue-500 text-white p-2 rounded bg-green"
                        >
                            Chọn ảnh
                        </button>
                        <input
                            type="file"
                            ref={fileRef}
                            hidden
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        {imageUrl && <img src={imageUrl} alt="Course Image" className="rounded h-48 w-auto mt-2 mx-auto" />}
                        {filePerc > 0 && filePerc < 100 && <p className="text-blue text-center mt-4">{`Đang tải lên: ${filePerc}%`}</p>}
                        {fileUploadError && <p className="text-red text-center mt-4">Tải ảnh thất bại</p>}
                        {filePerc === 100 && <p className="text-green text-center mt-4">Tải ảnh thành công!</p>}
                    </div>
                </div>

                <div className=''>

                    <button onClick={addLesson} className='bg-primary p-2 rounded text-white font-bold w-[200px] mb-4'>Thêm bài học</button>


                    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-10 mb-4'>
                        {formData.lessons?.map((lesson, index) => (
                            <div key={index} className="flex flex-col w-full col-span-1 lg:col-span-4">
                                <LessonComponent
                                    key={index}
                                    lesson={lesson}
                                    lessonIndex={index}
                                    handleRemoveLesson={handleRemoveLesson}
                                    setFormData={setFormData}
                                    formData={formData}
                                />
                                {errors.lessons && errors.lessons[index]?.title && (
                                    <div className="text-red mt-2 text-sm px-2">
                                        {errors.lessons[index].title}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>


                    <button onClick={handleCreateCourse} className='bg-primary p-2 rounded text-white font-bold w-[200px] mb-4'>Lưu khóa học</button>
                </div>
            </div>
        </div>
    )

}