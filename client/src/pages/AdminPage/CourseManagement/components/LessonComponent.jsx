import React, { useEffect, useState } from 'react';
import ContentComponent from './ContentComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getAllExams } from '../../../../features/exams/examSlice';

const LessonComponent = ({ lesson, lessonIndex, handleRemoveLesson, setFormData, formData }) => {

    // const { exams } = useSelector((state) => state.exams);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchExam = async () => {
            const resultFetchExam = await dispatch(getAllExams())
            console.log("F5 có list này không", resultFetchExam.payload)
            setListExams(resultFetchExam.payload)
        }
        fetchExam()
    }, [dispatch]);

    const handleLessonChange = (field, value) => {
        const updatedLessons = [...formData.lessons];
        updatedLessons[lessonIndex] = {
            ...updatedLessons[lessonIndex],
            [field]: value
        };
        setFormData(prevState => ({
            ...prevState,
            lessons: updatedLessons
        }));
    };

    const handleAddContent = () => {
        const updatedLessons = [...formData.lessons];
        updatedLessons[lessonIndex].content.push({ contentType: 'Exam', examId: null, videoId: null });
        setFormData(prevState => ({
            ...prevState,
            lessons: updatedLessons
        }));
    };

    const [listExams, setListExams] = useState([])

    //BB Vấn đề còn tồn đọng là việc xoá mẹ data rồi thì value mô ra
    const filterListExams = () => {
        const selectedExams = formData.lessons.flatMap(lesson => 
            lesson.content.filter(content => content.contentType === 'Exam').map(content => content.examId)
        );
        return listExams.filter(exam => !selectedExams.includes(exam._id));
    };

    return (
        <div className="w-full border rounded p-4">
            <div className="flex flex-col mb-4">
                <div className="text-gray mb-2">Nhập tiêu đề bài học {lessonIndex + 1}</div>
                <input
                    className="shadow appearance-none border py-3 px-3 rounded"
                    value={lesson?.title}
                    onChange={e => handleLessonChange('title', e.target.value)}
                />
            </div>
            {/* Hiển thị các nội dung trong bài học */}
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Nội dung bài học</h3>
                {lesson?.content?.map((content, contentIndex) => (
                    <ContentComponent
                        key={contentIndex}
                        content={content}
                        lessonIndex={lessonIndex}
                        contentIndex={contentIndex}
                        setFormData={setFormData}
                        formData={formData}
                        listExams={listExams}
                        // listExams={filterListExams()}
                    />
                ))}


                <button
                    onClick={handleAddContent}
                    className="bg-blue text-white p-2 rounded mt-4"
                >
                    Thêm nội dung
                </button>
            </div>

            {/* Xóa bài học */}
            <button
                onClick={() => handleRemoveLesson(lessonIndex)}
                className="bg-red text-white p-2 rounded mt-2"
            >
                Xóa bài học
            </button>

        </div>
    );
};

export default LessonComponent;
