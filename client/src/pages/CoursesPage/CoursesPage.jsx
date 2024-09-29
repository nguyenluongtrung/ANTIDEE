import React, { useState } from "react";
import { FaStar } from "react-icons/fa"; // Icons từ react-icons
import { Link } from "react-router-dom";

const courses = [
  {
    title: "E-Learning and Digital Cultures",
    rating: 8.7,
    date: "Feb 4, 2020 - Feb 22, 2020",
    status: "current",
    completed: true,
    img: "https://via.placeholder.com/100/4A90E2/FFFFFF?text=E-Learning",
  },
  {
    title: "Machine Learning: Regression",
    rating: 8.6,
    date: "Feb 8, 2020 - Feb 18, 2020",
    status: "archived",
    completed: false,
    img: "https://via.placeholder.com/100/E94E77/FFFFFF?text=ML",
  },
  {
    title: "Principles of Computing (Part 1)",
    rating: null,
    status: "current",
    completed: true,
    img: "https://via.placeholder.com/100/50E3C2/FFFFFF?text=Computing",
  },
  {
    title: "Design Principles: an Introduction",
    rating: null,
    status: "upcoming",
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
              My Courses
            </h2>

            {/* Tab Navigation */}
            <div className="mb-6">
              <nav className="flex space-x-4">
                {["all", "current", "archived", "upcoming", "watchlist"].map(
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
                      {course.completed ? "Completed" : "View Course"}
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
                  Yosef Dowling
                </h4>
                <p className="text-gray-500">Software Engineer</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h5 className="text-2xl font-semibold text-gray-800">16</h5>
                <p className="text-sm text-gray-600">Courses Completed</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h5 className="text-2xl font-semibold text-gray-800">14</h5>
                <p className="text-sm text-gray-600">Certificates Earned</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h5 className="text-2xl font-semibold text-gray-800">8</h5>
                <p className="text-sm text-gray-600">Courses In Progress</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h5 className="text-2xl font-semibold text-gray-800">26</h5>
                <p className="text-sm text-gray-600">Forum Discussions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
