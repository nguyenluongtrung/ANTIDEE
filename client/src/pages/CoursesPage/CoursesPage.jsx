import React, { useState } from "react";
import { FaStar } from "react-icons/fa"; // Icons từ react-icons
import { Link } from "react-router-dom";

const courses = [
  {
    title: "Khóa học nấu ăn",
    rating: 4.7,
    status: "đang học",
    completed: true,
    img: "https://via.placeholder.com/100/4A90E2/FFFFFF?text=E-Learning",
  },
  {
    title: "Khóa học nấu ăn",
    rating: 4.6,
    status: "đã hoàn thành",
    completed: false,
    img: "https://via.placeholder.com/100/E94E77/FFFFFF?text=ML",
  },
  {
    title: "Khóa học chăm sóc người già",
    rating: null,
    status: "đang học",
    completed: true,
    img: "https://via.placeholder.com/100/50E3C2/FFFFFF?text=Computing",
  },
  {
    title: "Khóa học chăm sóc trẻ em",
    rating: null,
    status: "sắp tới",
    completed: false,
    img: "https://via.placeholder.com/100/BD10E0/FFFFFF?text=Design",
  },
];

export const MyCourses = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredCourses = courses.filter((course) => {
    if (activeTab === "all") return true;
    return course.status === activeTab;
  });

  return (
    <div className="min-h-screen p-6 pt-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="md:col-span-3">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              CÁC KHÓA HỌC
            </h2>

            {/* Tab Navigation */}
            <div className="mb-6">
              <nav className="flex space-x-4">
                {["Tất cả", "đang học", "đã hoàn thành", "sắp tới", "danh sách theo dõi"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                        activeTab === tab
                          ? "bg-primary shadow-lg"
                          : " text-gray hover:bg-primary"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} Courses
                    </button>
                  )
                )}
              </nav>
            </div>

            {/* Course List */}
            <ul>
              {filteredCourses.map((course, index) => (
                <li
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-transform transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <img
                      className="w-16 h-16 rounded-lg mr-4"
                      src={course.img}
                      alt={course.title}
                    />
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500">{course.date}</p>
                      {course.rating && (
                        <div className="flex items-center mt-2">
                          <FaStar className="text-yellow-500 mr-1" />
                          <span className="text-lg font-semibold">
                            {course.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    <Link
                      to={"/lessons"}
                      className={`flex justify-center items-center w-32 px-2 py-1 text-sm rounded-lg shadow-md transition-all ${
                        course.completed
                          ? "bg-green hover:bg-green"
                          : "bg-gray hover:bg-gray"
                      }`}
                    >
                      {course.completed ? "Hoàn thành" : "Xem chi tiết"}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-6">
              <img
                className="w-16 h-16 rounded-full border-2 border-gray-300 mr-4"
                src="https://via.placeholder.com/150"
                alt="User Avatar"
              />
              <div>
                <h4 className="font-bold text-xl text-gray-800">
                  Thông tin của bạn
                </h4>
                <p className="text-gray-500"></p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h5 className="text-2xl font-semibold text-gray-800">16</h5>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h5 className="text-2xl font-semibold text-gray-800">14</h5>
                <p className="text-sm text-gray-600">Chứng chỉ</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h5 className="text-2xl font-semibold text-gray-800">8</h5>
                <p className="text-sm text-gray-600">Đang học</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
