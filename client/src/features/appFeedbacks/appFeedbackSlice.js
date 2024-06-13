import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appFeedbackService from './appFeedbackService';

export const getAllAppFeedbacks = createAsyncThunk(
	'appFeedbacks/getAllAppFeedbacks',
	async (_, thunkAPI) => {
		try {
			return await appFeedbackService.getAllAppFeedbacks();
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

export const createAppFeedback = createAsyncThunk(
	'appFeedbacks/createAppFeedback',
	async (appFeedbackData, thunkAPI) => {
		try {
			return await appFeedbackService.createAppFeedback( appFeedbackData)
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

export const replyAppFeedback = createAsyncThunk(
	'appFeedbacks/replyAppFeedback',
	async ({ replyData, appFeedbackId }, thunkAPI) => {
		try {
			const storedUser = JSON.parse(localStorage.getItem('account'));
			const token = storedUser.data.token;
			return await appFeedbackService.replyFeedback(replyData, appFeedbackId, token);

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
	appFeedbacks: [],
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
};

export const appFeedbackSlice = createSlice({
	name: 'appFeedbacks',
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
			.addCase(getAllAppFeedbacks.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllAppFeedbacks.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.appFeedbacks = action.payload;
			})
			.addCase(getAllAppFeedbacks.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.appFeedbacks = null;
			})

			.addCase(createAppFeedback.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createAppFeedback.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.appFeedbacks.push(action.payload);
			})
			.addCase(createAppFeedback.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})

			.addCase(replyAppFeedback.pending, (state)=> {
				state.isLoading = true;
			})
			.addCase(replyAppFeedback.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				const appFeedbackIndex = state.appFeedbacks.findIndex(
					(feedback) => feedback._id === action.payload._id
				);
				if (appFeedbackIndex !== -1) {
					state.appFeedbacks[appFeedbackIndex] = action.payload;
				}
			})
			.addCase(replyAppFeedback.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
	},
});
export const { reset } = appFeedbackSlice.actions;
export default appFeedbackSlice.reducer;
