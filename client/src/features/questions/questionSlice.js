import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import questionService from './questionService';

export const getAllQuestions = createAsyncThunk(
	'questions/getAllQuestions',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await questionService.getAllQuestions(token);
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

export const getQuestion = createAsyncThunk(
	'questions/getQuestion',
	async (questionId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await questionService.getQuestion(token, questionId);
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

export const createQuestions = createAsyncThunk(
	'questions/createQuestions',
	async (questionData, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await questionService.createQuestions(token, questionData);
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

export const updateQuestion = createAsyncThunk(
	'questions/updateQuestion',
	async ({ questionData, id }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await questionService.updateQuestion(token, questionData, id);
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

export const deleteQuestion = createAsyncThunk(
	'exams/deleteQuestion',
	async (id, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await questionService.deleteQuestion(token, id);
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
	questions: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
};

export const questionSlice = createSlice({
	name: 'questions',
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
			.addCase(getAllQuestions.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllQuestions.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.questions = action.payload;
			})
			.addCase(getAllQuestions.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.questions = null;
			})
			.addCase(getQuestion.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getQuestion.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(getQuestion.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.questions = null;
			})
			.addCase(createQuestions.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createQuestions.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(createQuestions.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(updateQuestion.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateQuestion.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				// state.questions[
				// 	state.questions.findIndex(
				// 		(question) => question._id == action.payload._id
				// 	)
				// ] = action.payload;
			})
			.addCase(updateQuestion.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(deleteQuestion.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteQuestion.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.questions = state.questions.filter(
					(question) => String(question._id) !== String(action.payload)
				);
			})
			.addCase(deleteQuestion.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});

export const { reset } = questionSlice.actions;
export default questionSlice.reducer;
