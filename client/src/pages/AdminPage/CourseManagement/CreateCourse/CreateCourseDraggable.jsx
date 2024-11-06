import '../CreateCourse/CreateCourse.css';
import React, { useState, useEffect } from 'react';
import { closestCorners, DndContext } from "@dnd-kit/core";
import { arrayMove } from '@dnd-kit/sortable';
import { PopupChangeLesson } from '../components/PopUpChangeLesson/PopUpChangeLesson';

export const CreateCourseDraggable = ({listLessons, formData, setFormData, open, setShowPopup,}) => {
    const [lessons, setLessons] = useState(listLessons);

    const handleDragEnd = event => {
        const { active, over } = event;

        if (active.id === over.id) return;

        setLessons(lessons => {
            const originalIndex = active.data.current.sortable.index;
            const newIndex = over.data.current.sortable.index;

            return arrayMove(lessons, originalIndex, newIndex);
        });
    };

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            lessons: lessons
        }))
        console.log("Danh sách đã được thay đổi:", lessons);
    }, [lessons]);

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='popup-animation bg-white p-6 rounded-lg shadow-lg'>
                <div className='flex items-center mb-2 text-2xl font-bold'>
                    Đang <p className='text-primary text-2xl px-2'>Chỉnh sửa</p> thứ tự bài học
                </div>
                <p className='text-center text-base'>Kéo thả để chỉnh sửa</p>
                <div>
                    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                        <PopupChangeLesson lessons={lessons} />
                    </DndContext>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        onClick={() => setShowPopup(false)}
                        className="px-4 py-2 font-semibold bg-gray opacity-60 text-white rounded hover:opacity-100"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};


// import '../CreateCourse/CreateCourse.css';
// import React, { useState, useEffect, useRef } from 'react';
// import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
// import { Toaster } from 'react-hot-toast';
// import { closestCorners, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor } from "@dnd-kit/core"
// import { PopupChangeLesson } from '../components/PopUpChangeLesson/PopUpChangeLesson';
// import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

// export const CreateCourseDraggable = () => {
//     const [lessons, setLessons] = useState([
//         {
//             id: 1,
//             title: 'Bài 1',
//             content: [
//                 { contentType: 'Exam', examId: null, videoId: null }
//             ],
//         },
//         {
//             id: 2,
//             title: 'Bài 2',
//             content: [
//                 { contentType: 'Exam', examId: null, videoId: null }
//             ],
//         },
//         {
//             id: 3,
//             title: 'Bài 3',
//             content: [
//                 { contentType: 'Exam', examId: null, videoId: null }
//             ],
//         }
//     ])

//     const getLessonPos = id => lessons.findIndex(lesson => lesson.id === id)

//     const handleDragEnd = event => {
//         const { active, over } = event

//         if (active.id === over.id) return

//         setLessons(lessons => {
//             const originalPos = getLessonPos(active.id)
//             const newPos = getLessonPos(over.id)

//             return arrayMove(lessons, originalPos, newPos)
//         })
//     }

//     // const sensors = useSensor(
//     //     useSensor(PointerSensor),
//     //     useSensor(TouchSensor),
//     //     useSensor(KeyboardSensor, {
//     //         coordinateGetter: sortableKeyboardCoordinates,
//     //     })
//     // )

//     useEffect(() => {
//         console.log("Danh sách đã được thay đổi:", lessons)
//     }, [lessons])

//     return (
//         <div className='w-full min-h-screen bg-white flex flex-row'>
//             <AdminSidebar />
//             <Toaster />
//             <div className='w-full p-10'>
//                 <div className='flex items-center mb-10 text-2xl font-bold'>
//                     Đang <p className='text-primary text-2xl px-2'>Demo</p>  Khoá học
//                 </div>
//                 <div className=''>
//                     <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}
//                     >
//                         <PopupChangeLesson lessons={lessons} />
//                     </DndContext>
//                 </div>
//                 <button className='bg-primary p-2 rounded text-white font-bold w-[200px] mb-4'>Lưu khóa học</button>
//             </div>
//         </div>
//     );
// };
