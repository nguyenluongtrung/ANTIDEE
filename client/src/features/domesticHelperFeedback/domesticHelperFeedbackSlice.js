import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import domesticHelperFeedbackService from './domesticHelperFeedbackService';

export const getAllFeedbacks = createAsyncThunk(
	'domesticHelperFeedbacks/getAllFeedbacks',
	async (_, thunkAPI) => {
		try {
			return await domesticHelperFeedbackService.getAllFeedbacks();
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

export const getFeedbackDetail = createAsyncThunk(
	'domesticHelperFeedbacks/getFeedbackDetail',
	async ({ jobPostId }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await domesticHelperFeedbackService.getFeedbackDetail(
				token,
				jobPostId
			);
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

export const createFeedback = createAsyncThunk(
	'domesticHelperFeedbacks/createFeedback',
	async (feedbackData, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await domesticHelperFeedbackService.createFeedback(
				token,
				feedbackData
			);
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

export const replyFeedback = createAsyncThunk(
	'domesticHelperFeedbacks/replyFeedback',
	async ({ replyData, feedbackId }, thunkAPI) => {
		try {
			const storedUser = JSON.parse(localStorage.getItem('account'));
			const token = storedUser.data.token;
			return await domesticHelperFeedbackService.replyFeedback(
				replyData,
				feedbackId,
				token
			);
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

export const deleteReply = createAsyncThunk(
	'domesticHelperFeedbacks/deleteReply',
	async ({ feedbackId, replyId }, thunkAPI) => {
		try {
			const storedUser = JSON.parse(localStorage.getItem('account'));
			const token = storedUser.data.token;
			return await domesticHelperFeedbackService.deleteReply(
				feedbackId,
				replyId,
				token
			);
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

export const updateReply = createAsyncThunk(
	'domesticHelperFeedbacks/updateReply',
	async ({ feedbackId, replyId, content }, thunkAPI) => {
		try {
			console.log(feedbackId, replyId, content);
			const storedUser = JSON.parse(localStorage.getItem('account'));
			const token = storedUser.data.token;
			return await domesticHelperFeedbackService.updateReply(
				feedbackId,
				replyId,
				content,
				token
			);
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
	domesticHelperFeedbacks: [],
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
};

export const domesticHelperFeedbackSlice = createSlice({
	name: 'domesticHelperFeedbacks',
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
			.addCase(getAllFeedbacks.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllFeedbacks.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.domesticHelperFeedbacks = action.payload;
			})
			.addCase(getAllFeedbacks.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.domesticHelperFeedbacks = null;
			})
			.addCase(getFeedbackDetail.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getFeedbackDetail.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(getFeedbackDetail.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(createFeedback.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createFeedback.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.domesticHelperFeedbacks.push(action.payload);
			})
			.addCase(createFeedback.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})

			.addCase(replyFeedback.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(replyFeedback.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				const feedbackIndex = state.domesticHelperFeedbacks.findIndex(
					(feedback) => feedback._id === action.payload._id
				);
				if (feedbackIndex !== -1) {
					state.domesticHelperFeedbacks[feedbackIndex] = action.payload;
				}
			})
			.addCase(replyFeedback.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})

			.addCase(deleteReply.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteReply.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				const feedbackIndex = state.domesticHelperFeedbacks.findIndex(
					(feedback) => feedback._id === action.payload._id
				);
				if (feedbackIndex !== -1) {
					state.domesticHelperFeedbacks[feedbackIndex] = action.payload;
				}
			})
			.addCase(deleteReply.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(updateReply.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateReply.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				const feedbackIndex = state.domesticHelperFeedbacks.findIndex(
					(feedback) => feedback._id === action.payload._id
				);
				if (feedbackIndex !== -1) {
					state.domesticHelperFeedbacks[feedbackIndex] = action.payload;
				}
			})
			.addCase(updateReply.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});
export const { reset } = domesticHelperFeedbackSlice.actions;
export default domesticHelperFeedbackSlice.reducer;
