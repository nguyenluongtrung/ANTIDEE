import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import forumPostService from './forumPostService';

export const getAllForumPosts = createAsyncThunk(
	'forumPosts/getAllForumPosts',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount?.data?.token;  
			if (!token) {
				throw new Error('No token found');
			}
			return await forumPostService.getAllForumPosts(token);
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

export const getTopDiscussionForumPosts = createAsyncThunk(
	'forumPosts/getTopDiscussionForumPosts',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount?.data?.token;  
			if (!token) {
				throw new Error('No token found');
			}
			return await forumPostService.getTopDiscussionForumPosts(token);
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
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount?.data?.token;
			return await forumPostService.getForumPost(token, postId);
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
export const createForumPost = createAsyncThunk(
	'forumPosts/createForumPost',
	async (forumPostData, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await forumPostService.createForumPost(forumPostData, token);
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
export const hideForumPost = createAsyncThunk(
	'forumPosts/hideForumPost',
	async (forumPostId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await forumPostService.hideForumPost(forumPostId, token);
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

export const unhideForumPost = createAsyncThunk(
	'forumPosts/unhideForumPost',
	async (forumPostId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await forumPostService.unhideForumPost(forumPostId, token);
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

export const reactToForumPost = createAsyncThunk(
	'forumPosts/reactToForumPost',
	async ({ forumPostId, userId }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await forumPostService.reactToForumPost(
				forumPostId,
				userId,
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

export const unReactToForumPost = createAsyncThunk(
	'forumPosts/unReactToForumPost',
	async ({ forumPostId, userId }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await forumPostService.unReactToForumPost(
				forumPostId,
				userId,
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

export const commentForumPost = createAsyncThunk(
	'forumPosts/commentForumPost',
	async ({ commentData, forumPostId }, thunkAPI) => {
		try {
			const storedUser = JSON.parse(localStorage.getItem('account'));
			const token = storedUser.data.token;
			return await forumPostService.commentForumPost(
				commentData,
				forumPostId,
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

export const updateHiddenDetails = createAsyncThunk(
	'forumPosts/updateHiddenDetails',
	async ({ accountId, reasonContent, status, postId }, thunkAPI) => {
		try {
			const storedUser = JSON.parse(localStorage.getItem('account'));
			const token = storedUser.data.token;
			return await forumPostService.updateHiddenDetails(
				accountId,
				reasonContent,
				status,
				postId,
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
			.addCase(getTopDiscussionForumPosts.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getTopDiscussionForumPosts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.forumPosts = action.payload;
			})
			.addCase(getTopDiscussionForumPosts.rejected, (state, action) => {
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
			.addCase(createForumPost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createForumPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.forumPosts.unshift(action.payload);
			})
			.addCase(createForumPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(hideForumPost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(hideForumPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.forumPosts = state.forumPosts.filter(
					(post) => String(post._id) !== String(action.payload)
				);
			})
			.addCase(hideForumPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(reactToForumPost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(reactToForumPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(reactToForumPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(unReactToForumPost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(unReactToForumPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(unReactToForumPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(unhideForumPost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(unhideForumPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.forumPosts.push(action.payload);
			})
			.addCase(unhideForumPost.rejected, (state, action) => {
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
			})

			.addCase(commentForumPost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(commentForumPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.forumPosts = state.forumPosts.filter(
					(post) => String(post._id) !== String(action.payload)
				);
			})
			.addCase(commentForumPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});

export const { reset } = forumPostSlice.actions;
export default forumPostSlice.reducer;
