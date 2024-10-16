import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllCourse } from "../../features/courses/courseSlice";
import { useNavigate } from "react-router-dom";

export const MyCourses = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [courses, setCourses] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGetAllCourse = async () => {
    const response = await dispatch(getAllCourse());
    let result = response.payload;
    setCourses(result); 
  };

  useEffect(() => {
    handleGetAllCourse();
  }, []);

  return (
    <div className="min-h-screen p-6 pt-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              CÁC KHÓA HỌC
            </h2>

            <div className="mb-6">
              <nav className="flex space-x-4">
                {["Tất cả", "đang học", "đã hoàn thành"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-primary shadow-lg"
                        : " text-gray hover:bg-primary"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            <ul>
              {courses.map((course, index) => (
                <li
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-transform transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <img
                      className="w-16 h-16 rounded-lg mr-4"
                      src={course.image}
                    />
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {course.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        navigate(`/course/${course._id}`);
                      }}
                      className={`flex justify-center items-center w-32 px-2 py-1 text-sm rounded-lg shadow-md transition-all`}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 h-80">
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
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h5 className="text-2xl font-semibold text-gray-800">16</h5>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h5 className="text-2xl font-semibold text-gray-800">14</h5>
                <p className="text-sm text-gray-600">Chứng chỉ</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
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
