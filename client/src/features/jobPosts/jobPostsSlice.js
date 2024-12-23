import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import jobPostsService from './jobPostsService';

export const getAllJobPosts = createAsyncThunk(
	'jobPosts/getAllJobPosts',
	async (_, thunkAPI) => {
		try {
			return await jobPostsService.getAllJobPosts();
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

export const getMyJobPostingHistory = createAsyncThunk(
	'jobPosts/getMyJobPostingHistory',
	async ({ option }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await jobPostsService.getMyJobPostingHistory(option, token);
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

export const getMyReceivedJobs = createAsyncThunk(
	'jobPosts/getMyReceivedJobs',
	async ({ option }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await jobPostsService.getMyReceivedJobs(option, token);
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

export const filterJobPostsByService = createAsyncThunk(
	'jobPosts/filterJobPostsByService',
	async ({ serviceIds, isInMyLocation }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await jobPostsService.filterJobPostsByService(
				serviceIds,
				isInMyLocation,
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

export const countNumberOfJobsByAccountId = createAsyncThunk(
	'jobPosts/countNumberOfJobsByAccountId',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await jobPostsService.countNumberOfJobsByAccountId(token);
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

export const createJobPost = createAsyncThunk(
	'jobPosts/createJobPost',
	async (jobPostData, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await jobPostsService.createJobPost(token, jobPostData);
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

export const updateJobPost = createAsyncThunk(
	'jobPosts/updateJobPost',
	async ({ jobPostData, id }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			console.log(token, jobPostData, id);
			return await jobPostsService.updateJobPost(token, jobPostData, id);
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

export const cancelJobPost = createAsyncThunk(
	'jobPosts/cancelJobPost',
	async ({ reason, jobPostId }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await jobPostsService.cancelJobPost(token, reason, jobPostId);
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

export const cancelAJobDomesticHelper = createAsyncThunk(
	'jobPosts/cancelAJobDomesticHelper',
	async ({ reason, jobPostId }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await jobPostsService.cancelAJobDomesticHelper(
				token,
				reason,
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

export const deleteJobPost = createAsyncThunk(
	'jobPosts/deleteJobPost',
	async (id, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await jobPostsService.deleteJobPost(token, id);
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

export const getAJob = createAsyncThunk(
	'jobPosts/getAJob',
	async (jobPostId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await jobPostsService.getAJob(token, jobPostId);
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

export const getJobPost = createAsyncThunk(
	'jobPosts/getJobPost',
	async (jobPostId, thunkAPI) => {
		try {
			return await jobPostsService.getJobPost(jobPostId);
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

export const applyAJob = createAsyncThunk(
	'jobPosts/applyAJob',
	async ({ jobPostId, accountId }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			console.log(token);
			return await jobPostsService.applyAJob(token, jobPostId, accountId);
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

export const selectATasker = createAsyncThunk(
	'jobPosts/selectATasker',
	async ({ jobPostId, taskerId }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await jobPostsService.selectATasker(token, jobPostId, taskerId);
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

export const getRevenueByCurrentMonth = createAsyncThunk(
	'jobPosts/getRevenueByCurrentMonth',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await jobPostsService.getRevenueByCurrentMonth(token);
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

export const getRevenueByMonths = createAsyncThunk(
	'jobPosts/getRevenueByMonths',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await jobPostsService.getRevenueByMonths(token);
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
	jobPosts: [],
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
};

export const jobPostSlice = createSlice({
	name: 'jobPosts',
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
			.addCase(getAllJobPosts.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllJobPosts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.jobPosts = action.payload;
			})
			.addCase(getAllJobPosts.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.jobPosts = null;
			})
			.addCase(getMyJobPostingHistory.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getMyJobPostingHistory.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.jobPosts = action.payload;
			})
			.addCase(getMyJobPostingHistory.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.jobPosts = null;
			})
			.addCase(getMyReceivedJobs.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getMyReceivedJobs.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.jobPosts = action.payload;
			})
			.addCase(getMyReceivedJobs.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.jobPosts = null;
			})
			.addCase(filterJobPostsByService.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(filterJobPostsByService.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.jobPosts = action.payload;
			})
			.addCase(filterJobPostsByService.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.jobPosts = null;
			})
			.addCase(getJobPost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getJobPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(getJobPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(countNumberOfJobsByAccountId.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(countNumberOfJobsByAccountId.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(countNumberOfJobsByAccountId.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(createJobPost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createJobPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.jobPosts.push(action.payload);
			})
			.addCase(createJobPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(updateJobPost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateJobPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.jobPosts[
					state.jobPosts.findIndex(
						(jobPost) => jobPost._id == action.payload._id
					)
				] = action.payload;
			})
			.addCase(updateJobPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(deleteJobPost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteJobPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.jobPosts = state.jobPosts.filter(
					(jobPost) => String(jobPost._id) !== String(action.payload)
				);
			})
			.addCase(deleteJobPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getAJob.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAJob.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.jobPosts[
					state.jobPosts.findIndex(
						(jobPost) => jobPost._id == action.payload._id
					)
				] = action.payload;
			})
			.addCase(getAJob.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(applyAJob.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(applyAJob.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.jobPosts[
					state.jobPosts.findIndex(
						(jobPost) => jobPost._id == action.payload._id
					)
				] = action.payload;
			})
			.addCase(applyAJob.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(selectATasker.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(selectATasker.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.jobPosts[
					state.jobPosts.findIndex(
						(jobPost) => jobPost._id == action.payload._id
					)
				] = action.payload;
			})
			.addCase(selectATasker.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(cancelJobPost.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(cancelJobPost.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.jobPosts[
					state.jobPosts.findIndex(
						(jobPost) => jobPost._id == action.payload.jobPost._id
					)
				] = action.payload.jobPost;
			})
			.addCase(cancelJobPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(cancelAJobDomesticHelper.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(cancelAJobDomesticHelper.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.jobPosts[
					state.jobPosts.findIndex(
						(jobPost) => jobPost._id == action.payload.jobPost._id
					)
				] = action.payload.jobPost;
			})
			.addCase(cancelAJobDomesticHelper.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getRevenueByCurrentMonth.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getRevenueByCurrentMonth.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(getRevenueByCurrentMonth.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getRevenueByMonths.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getRevenueByMonths.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(getRevenueByMonths.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});

export const { reset } = jobPostSlice.actions;
export default jobPostSlice.reducer;
