import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import courseService from './courseService';

export const getAllCourse = createAsyncThunk(
	'courses/getAllCourse',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await courseService.getAllCourse(token);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const createCourse = createAsyncThunk(
	'courses/createCourse',
	async (courseData, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await courseService.createCourse(token, courseData);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const updateCourse = createAsyncThunk(
	'courses/updateCourse',
	async ({ courseData, id }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await courseService.updateCourse(token, courseData, id);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const deleteCourse = createAsyncThunk(
	'courses/deleteCourse',
	async (id, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await courseService.deleteCourse(token, id);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const getCourseById = createAsyncThunk(
	'courses/getLessonsByCourse',
	async (courseId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await courseService.getCourseById(token, courseId);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const getLessonsByCourse = createAsyncThunk(
	'courses/getLessonsByCourse',
	async (courseId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await courseService.getLessonsByCourse(token, courseId);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			return thunkAPI.rejectWithValue(message);
		}
	}
);

const initialState = {
	courses: [],
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
};

export const courseSlice = createSlice({
	name: 'courses',
	initialState,
	reducers: {
		reset: (state) => {
			state.isError = false;
			state.isLoading = false;
			state.isSuccess = false;
			state.message = '';
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAllCourse.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllCourse.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.courses = action.payload;
			})
			.addCase(getAllCourse.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.courses = null;
			})
			.addCase(createCourse.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createCourse.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.courses.push(action.payload);
			})
			.addCase(createCourse.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(deleteCourse.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteCourse.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.courses = state.courses.filter(
					(course) => String(course._id) !== String(action.payload)
				);
			})
			.addCase(deleteCourse.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(updateCourse.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateCourse.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.courses[
					state.courses.findIndex((course) => course._id == action.payload._id)
				] = action.payload;
			})
			.addCase(updateCourse.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getCourseById.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getCourseById.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.courses = action.payload;
			})
			.addCase(getCourseById.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.courses = [];
			})
			.addCase(getLessonsByCourse.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getLessonsByCourse.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.courses = action.payload;
			})
			.addCase(getLessonsByCourse.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.courses = [];
			});
	},
});

export const { reset } = courseSlice.actions;
export default courseSlice.reducer;
