import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import examService from './examService';

export const getAllExams = createAsyncThunk(
	'exams/getAllExams',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await examService.getAllExams(token);
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

export const createExam = createAsyncThunk(
	'exams/createExam',
	async (examData, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await examService.createExam(token, examData);
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

export const deleteExam = createAsyncThunk(
	'exams/deleteExam',
	async (id, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await examService.deleteExam(token, id);
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
	exams: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
};

export const examSlice = createSlice({
	name: 'exams',
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
			.addCase(getAllExams.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllExams.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.exams = action.payload;
			})
			.addCase(getAllExams.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.exams = null;
			})
			.addCase(createExam.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createExam.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.exams.push(action.payload);
			})
			.addCase(createExam.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(deleteExam.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteExam.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.exams = state.exams.filter(
					(exam) => String(exam._id) !== String(action.payload)
				);
			})
			.addCase(deleteExam.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});

export const { reset } = examSlice.actions;
export default examSlice.reducer;
