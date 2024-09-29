import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export const CourseDetail = () => {
  const [openLessons, setOpenLessons] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);

  const lessons = [
    {
      id: 1,
      title: "Khái niệm kỹ thuật cần biết",
      duration: "23:09",
      contents: [
        { id: "1.1", type: "video", title: "Giới thiệu về kỹ thuật", duration: "5:00", url: "https://via.placeholder.com/1920x1080.png?text=Video+1" },
        { id: "1.2", type: "quiz", title: "Bài kiểm tra kỹ thuật", duration: "10:00" },
      ],
    },
    {
      id: 2,
      title: "Mô hình Client - Server là gì?",
      duration: "11:35",
      contents: [
        { id: "2.1", type: "video", title: "Định nghĩa mô hình Client-Server", duration: "3:00", url: "https://via.placeholder.com/1920x1080.png?text=Video+2" },
        { id: "2.2", type: "quiz", title: "Kiểm tra mô hình Client-Server", duration: "4:00" },
      ],
    },
  ];

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
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 mt-14">
      <div className="bg-white shadow-lg p-6 top-0 z-10">
        <h1 className="text-3xl font-bold text-gray-900">Khóa học: Kiến thức nhập môn IT</h1>
      </div>

      <div className="flex flex-grow">
        <div className="flex-[7] bg-white flex flex-col justify-center items-center p-8">
          <div className="relative w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg overflow-hidden flex items-center justify-center">
            {selectedContent && selectedContent.type === "video" ? (
              <img
                src={selectedContent.url}
                alt={selectedContent.title}
                className="object-cover w-full h-full"
              />
            ) : selectedContent ? (
              <div className="text-white text-xl">Nội dung bài kiểm tra: {selectedContent.title}</div>
            ) : (
              <div className="text-white text-xl">Chưa chọn nội dung nào</div>
            )}
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


