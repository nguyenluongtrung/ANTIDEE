import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getLessonsByCourse } from "../../../features/courses/courseSlice";

export const CourseDetail = () => {
  const [openLessons, setOpenLessons] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [lessons, setLessons] = useState([]);
  const dispatch = useDispatch();
  const { courseId } = useParams();

  useEffect(() => {
    const fetchLessons = async () => {
      const response = await dispatch(getLessonsByCourse(courseId)); 
      setLessons(response.payload); 
    };
    fetchLessons();
  }, [courseId, dispatch]); 

  const toggleLesson = (lessonId) => {
    if (openLessons.includes(lessonId)) {
      setOpenLessons(openLessons.filter(id => id !== lessonId));
    } else {
      setOpenLessons([...openLessons, lessonId]);
    }
  };

  const handleContentClick = (lessonId, contentId) => {
    const lesson = lessons.find(lesson => lesson.id === lessonId);
    const content = lesson?.contents.find(content => content.id === contentId);
    setSelectedContent(content);
  };

  useEffect(() => {
    if (lessons.length > 0 && lessons[0].contents.length > 0) {
      setSelectedContent(lessons[0].contents[0]);
      setOpenLessons([lessons[0].id]);
    }
  }, [lessons]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 pt-14 mb-28">
      <div className="bg-white shadow-lg p-6 top-0 z-10">
        <h1 className="text-3xl font-bold text-gray-900">Nội dung khóa học</h1>
      </div>

      <div className="flex flex-grow">
        <div className="flex-[7] bg-white flex flex-col justify-center items-center p-8">
          <div className="relative w-full h-[calc(100vh-10rem)] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg overflow-hidden flex items-center justify-center">
            {selectedContent && selectedContent.type === "video" ? (
              <img
                src={selectedContent.url}
                alt={selectedContent.title}
                className="object-cover w-full h-full"
              />
            ) : selectedContent && selectedContent.type === "quiz" ? (
              <div className="text-white text-xl">Nội dung bài kiểm tra: {selectedContent.title}</div>
            ) : null}
          </div>
          {selectedContent && (
            <h2 className="text-3xl font-bold mt-6 mb-2 text-gray-800">
              {selectedContent.title}
            </h2>
          )}
        </div>

        <div className="flex-[3] bg-gray-50 p-6 border-l border-gray-200 overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Nội dung khóa học</h3>
          <ul className="space-y-4">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <div
                  className={`p-4 bg-white rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-100 transition ${
                    openLessons.includes(lesson.id) ? "bg-indigo-100" : ""
                  }`}
                  onClick={() => toggleLesson(lesson.id)}
                >
                  <span className="text-gray-800 font-medium">{lesson.title}</span>
                  {openLessons.includes(lesson.id) ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </div>
                {openLessons.includes(lesson.id) && (
                  <ul className="mt-2 pl-6 space-y-2">
                    {lesson.contents.map((content) => (
                      <li
                        key={content.id}
                        className={`p-2 bg-white rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-100 transition ${
                          selectedContent && selectedContent.id === content.id ? "bg-gray-300" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContentClick(lesson.id, content.id);
                        }}
                      >
                        <span className="text-gray-800">{content.title}</span>
                        <span className="text-gray-500">{content.duration}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
