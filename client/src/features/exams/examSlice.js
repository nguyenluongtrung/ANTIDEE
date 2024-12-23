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
export const getExam = createAsyncThunk(
	'exams/getExam',
	async (examId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await examService.getExam(token, examId);
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

export const updateExam = createAsyncThunk(
	'exams/updateExam',
	async ({ examData, id }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await examService.updateExam(token, examData, id);
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

export const saveExamResult = createAsyncThunk(
	'exams/saveExamResult',
	async ({ examResult, examId }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const updatedExamData = {
				...examResult,
				accountId: storedAccount?.data?.account?._id,
			};
			const token = storedAccount.data.token;
			return await examService.saveExamResult(token, updatedExamData, examId);
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

export const getMyExamResults = createAsyncThunk(
	'exams/getMyExamResults',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await examService.getMyExamResults(token);
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
	exams: [],
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
			.addCase(getExam.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getExam.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(getExam.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.exams = null;
			})
			.addCase(getMyExamResults.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getMyExamResults.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(getMyExamResults.rejected, (state, action) => {
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
			})
			.addCase(updateExam.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateExam.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.exams[
					state.exams.findIndex((exam) => exam._id == action.payload._id)
				] = action.payload;
			})
			.addCase(updateExam.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(saveExamResult.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(saveExamResult.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.exams[
					state.exams.findIndex((exam) => exam._id == action.payload._id)
				] = action.payload;
			})
			.addCase(saveExamResult.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});

export const { reset } = examSlice.actions;
export default examSlice.reducer;
