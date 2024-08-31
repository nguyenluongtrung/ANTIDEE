import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import forumPostService from './forumPostService';

export const getAllForumPosts = createAsyncThunk(
	'forumPosts/getAllForumPosts',
	async (_, thunkAPI) => {
		try {
			return await forumPostService.getAllForumPosts();
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

export const getForumPost = createAsyncThunk(
	'forumPosts/getForumPost',
	async (postId, thunkAPI) => {
		try {
			return await forumPostService.getForumPost(postId);
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

export const deleteForumPost = createAsyncThunk(
	'forumPosts/deleteForumPost',
	async (forumPostId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await forumPostService.deleteForumPost(token, forumPostId);
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

export const saveForumPost = createAsyncThunk(
	'forumPosts/saveForumPost',
	async ({ chosenForumPostId, repositoryName }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await forumPostService.saveForumPost(
				token,
				chosenForumPostId,
				repositoryName
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

export const getForumRepositories = createAsyncThunk(
	'forumPosts/getForumRepositories',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await forumPostService.getForumRepositories(token);
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
	forumPosts: [],
	repositories: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: '',
};

export const forumPostSlice = createSlice({
	name: 'forumPosts',
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
			.addCase(getAllForumPosts.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllForumPosts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.forumPosts = action.payload;
			})
			.addCase(getAllForumPosts.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.forumPosts = null;
			})
			.addCase(getForumPost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getForumPost.fulfilled, (state) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(getForumPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(deleteForumPost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteForumPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.forumPosts = state.forumPosts.filter(
					(post) => String(post._id) !== String(action.payload)
				);
			})
			.addCase(deleteForumPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getForumRepositories.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getForumRepositories.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.repositories = action.payload;
			})
			.addCase(getForumRepositories.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(saveForumPost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(saveForumPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.repositories.push(action.payload);
			})
			.addCase(saveForumPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});

export const { reset } = forumPostSlice.actions;
export default forumPostSlice.reducer;
