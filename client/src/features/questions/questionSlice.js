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

export const createQuestion = createAsyncThunk(
	'questions/createQuestion',
	async (questionData, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await questionService.createQuestion(token, questionData);
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
			.addCase(createQuestion.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createQuestion.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.questions.push(action.payload);
			})
			.addCase(createQuestion.rejected, (state, action) => {
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
				state.questions[
					state.questions.findIndex(
						(question) => question._id == action.payload._id
					)
				] = action.payload;
			})
			.addCase(updateQuestion.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});

export const { reset } = questionSlice.actions;
export default questionSlice.reducer;
