import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVideos } from '../../../../features/videos/videoSlice';
import { getAllExams } from '../../../../features/exams/examSlice';
import { MdDeleteOutline } from 'react-icons/md';

const ContentComponent = ({ content, lessonIndex, contentIndex, setFormData, formData }) => {

    const { videos, isLoading } = useSelector((state) => state.videos);
    const { exams } = useSelector((state) => state.exams);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllVideos());
        dispatch(getAllExams());
    }, []);


    const handleContentChange = (field, value) => {
        const updatedLessons = [...formData.lessons];
        updatedLessons[lessonIndex].content[contentIndex] = {
            ...updatedLessons[lessonIndex].content[contentIndex],
            [field]: value
        };
        setFormData(prevState => ({
            ...prevState,
            lessons: updatedLessons
        }));
    };


    const handleRemoveContent = () => {
        const updatedLessons = [...formData.lessons];
        updatedLessons[lessonIndex].content.splice(contentIndex, 1);
        setFormData(prevState => ({
            ...prevState,
            lessons: updatedLessons
        }));
    };

    return (
        <div className="rounded mt-2">

            <div className='flex gap-x-2'>
                <div className=''>
                    <select
                        value={content.contentType}
                        onChange={e => handleContentChange('contentType', e.target.value)}
                        className="border rounded "
                    >

                        <option value="Exam">Exam</option>
                        <option value="Video">Video</option>
                    </select>
                </div>

                {content.contentType === 'Exam' && (
                    <div className="flex flex-col w-full">
                        <select
                            value={content.examId ? content.examId._id : ''}
                            onChange={e => handleContentChange('examId', e.target.value)}
                            className="border rounded"
                        >
                            <option value="">Chọn câu hỏi</option>

                            {exams?.filter(exam =>
                                exam.category === "Kiểm tra training" &&
                                String(exam.qualificationId._id) === String(formData.qualificationId)
                            ).map(exam => (
                                <option key={exam._id} value={exam._id}>
                                    {exam.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {content.contentType === 'Video' && (
                    <div className="flex flex-col w-full">
                        <select
                            value={content.videoId ? content.videoId._id : ''}
                            onChange={e => handleContentChange('videoId', e.target.value)}
                            className="border rounded"
                        >
                            <option value="">Chọn URL Video</option>

                            {videos?.map(videoUrl => (
                                <option key={videoUrl._id} value={videoUrl._id}>
                                    {videoUrl.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div>
                    <button
                        onClick={handleRemoveContent}
                        className="hover:text-red text-black rounded"
                    >
                        <MdDeleteOutline size={18} />
                    </button>
                </div>
            </div>
        </div>

    );
};

export default ContentComponent;
