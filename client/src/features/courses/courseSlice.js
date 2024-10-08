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

  export const getLessonsByCourse = createAsyncThunk(
	'courses/getLessonsByCourse',
	async (courseId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await courseService.getLessonsByCourse(courseId)
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
			.addCase(getLessonsByCourse.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLessonsByCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.courses.lessons = action.payload;
            })
            .addCase(getLessonsByCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.courses = []
            });
	},
});

export const { reset } = courseSlice.actions;
export default courseSlice.reducer;