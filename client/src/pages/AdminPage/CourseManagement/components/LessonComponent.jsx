import React from 'react';
import ContentComponent from './ContentComponent';

const LessonComponent = ({ lesson, lessonIndex, handleRemoveLesson, setFormData, formData }) => {

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

    return (
        <div className="w-full border rounded p-4">
            <div className="flex flex-col mb-4">
                <div className="text-gray mb-2">Nhập tiêu đề bài học {lessonIndex + 1}</div>
                <input
                    className="shadow appearance-none border py-3 px-3 rounded"
                    value={lesson.title}
                    onChange={e => handleLessonChange('title', e.target.value)}
                />
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Nội dung bài học</h3>
                {lesson.content?.map((content, contentIndex) => (
                    <ContentComponent
                        key={contentIndex}
                        content={content}
                        lessonIndex={lessonIndex}
                        contentIndex={contentIndex}
                        setFormData={setFormData}
                        formData={formData}
                    />
                ))}


                <button
                    onClick={handleAddContent}
                    className="bg-blue text-white p-2 rounded mt-4"
                >
                    Thêm nội dung
                </button>
            </div>


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
