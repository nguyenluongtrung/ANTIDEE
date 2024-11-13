import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import videoService from './videoService';

export const getAllVideos = createAsyncThunk(
	'videos/getAllVideos',
	async (_, thunkAPI) => {
		try {
			return await videoService.getAllVideos();
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
export const getVideo = createAsyncThunk(
	'videos/getVideo',
	async (videoId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await videoService.getVideo(token, videoId);
			
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
export const createVideo = createAsyncThunk(
	'videos/createVideo',
	async (videoData, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await videoService.createVideo(token, videoData);
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

export const updateVideo = createAsyncThunk(
	'videos/updateVideo',
	async ({ videoData, id }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await videoService.updateVideo(token, videoData, id);
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

export const deleteVideo = createAsyncThunk(
	'videos/deleteVideo',
	async (id, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await videoService.deleteVideo(token, id);
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

export const finishVideoByAccount = createAsyncThunk(
	'videos/finishVideoByAccount',
	async (videoId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			return await videoService.finishVideoByAccount(
				storedAccount.data.account._id,
				videoId
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
	videos: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
};

export const videoSlice = createSlice({
	name: 'videos',
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
			.addCase(getAllVideos.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllVideos.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.videos = action.payload;
			})
			.addCase(getAllVideos.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.videos = null;
			})
			.addCase(getVideo.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getVideo.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.videos = action.payload;
			})
			.addCase(getVideo.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.videos = [];
			})
			.addCase(createVideo.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createVideo.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.videos.push(action.payload);
			})
			.addCase(createVideo.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(updateVideo.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateVideo.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				if (Array.isArray(state.videos)) {
					const index = state.videos.findIndex((video) => video._id === action.payload._id);
					if (index !== -1) {
						state.videos[index] = action.payload;  
					}  
				}  
			})
			
			.addCase(updateVideo.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(deleteVideo.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteVideo.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.videos = state.videos.filter(
					(video) => String(video._id) !== String(action.payload)
				);
			})
			.addCase(deleteVideo.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(finishVideoByAccount.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(finishVideoByAccount.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.isLoading = false;
			})
			.addCase(finishVideoByAccount.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});

export const { reset } = videoSlice.actions;
export default videoSlice.reducer;
