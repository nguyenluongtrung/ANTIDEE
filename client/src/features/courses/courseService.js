import axios from 'axios';

const API_URL = '/antidee/api/course/';

const getAllCourse = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL, config);
	return response.data.data.courses;
};

const deleteCourse = async (token, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.delete(API_URL + `${id}`, config);
	return response.data.data.id;
};

const getLessonsByCourse = async (courseId) => {
	const course = await Course.findById(courseId).populate('lessons');
  
	if (!course) {
	  throw new Error("Không tìm thấy khóa học");
	}
  
	return course.lessons;
  };

const courseService = {
	getAllCourse,
	deleteCourse,
	getLessonsByCourse,
};

export default courseService;