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
			});
	},
});

export const { reset } = examSlice.actions;
export default examSlice.reducer;
