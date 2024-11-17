import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import chattingService from './chattingService';

export const createChat = createAsyncThunk(
	'chatting/createChat',
	async (chatData, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await chattingService.createChat(token, chatData);
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

export const getChatById = createAsyncThunk(
	'chatting/getChatById',
	async (chatId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount?.data?.token;
			return await chattingService.getChatById(token, chatId);
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

export const getAllChats = createAsyncThunk(
	'chatting/getAllChats',
	async (_, thunkAPI) => {
		try {
			return await chattingService.getAllChats();
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
	chatting: [],
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
};

export const chattingSlice = createSlice({
	name: 'chatting',
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
			.addCase(getAllChats.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllChats.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.chatting = action.payload;
			})
			.addCase(getAllChats.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(createChat.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createChat.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.chatting.push(action.payload);
			})
			.addCase(createChat.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getChatById.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getChatById.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.chatting = action.payload;
			})
			.addCase(getChatById.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.chatting = [];
			});
	},
});
export const { reset } = chattingSlice.actions;
export default chattingSlice.reducer;
