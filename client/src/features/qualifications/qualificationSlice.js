import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import qualificationService from './qualificationService';

export const getAllQualifications = createAsyncThunk(
	'qualifications/getAllQualifications',
	async (_, thunkAPI) => {
		try {
			return await qualificationService.getAllQualifications();
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

export const createQualification = createAsyncThunk(
	'qualifications/createQualification',
	async (qualificationData, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await qualificationService.createQualification(
				token,
				qualificationData
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

export const updateQualification = createAsyncThunk(
	'qualifications/updateQualification',
	async ({ qualificationData, id }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await qualificationService.updateQualification(
				token,
				qualificationData,
				id
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

export const deleteQualification = createAsyncThunk(
	'qualifications/deleteQualification',
	async (id, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await qualificationService.deleteQualification(token, id);
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

export const receiveNewQualification = createAsyncThunk(
	'qualifications/receiveNewQualification',
	async (qualificationId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await qualificationService.receiveNewQualification(
				qualificationId,
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

export const checkQualificationReceived = createAsyncThunk(
	'qualifications/checkQualificationReceived',
	async (qualificationId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await qualificationService.checkQualificationReceived(
				qualificationId,
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

export const getAccountQualifications = createAsyncThunk(
	'qualifications/getAccountQualifications',
	async (accountId, thunkAPI) => {
		try {
			return await qualificationService.getAccountQualifications(accountId);
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
	qualifications: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
};

export const qualificationSlice = createSlice({
	name: 'qualifications',
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
			.addCase(getAllQualifications.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllQualifications.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.qualifications = action.payload;
			})
			.addCase(getAllQualifications.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.qualifications = null;
			})
			.addCase(getAccountQualifications.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAccountQualifications.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(getAccountQualifications.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(createQualification.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createQualification.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.qualifications.push(action.payload);
			})
			.addCase(createQualification.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(updateQualification.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateQualification.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.qualifications[
					state.qualifications.findIndex(
						(qualification) => qualification._id == action.payload._id
					)
				] = action.payload;
			})
			.addCase(updateQualification.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(deleteQualification.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteQualification.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.qualifications = state.qualifications.filter(
					(qualification) =>
						String(qualification._id) !== String(action.payload)
				);
			})
			.addCase(deleteQualification.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(checkQualificationReceived.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(checkQualificationReceived.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(checkQualificationReceived.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(receiveNewQualification.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(receiveNewQualification.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(receiveNewQualification.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});

export const { reset } = qualificationSlice.actions;
export default qualificationSlice.reducer;
