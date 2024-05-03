import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import serviceService from './serviceService';

export const getAllServices = createAsyncThunk(
	'exams/getAllServices',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await serviceService.getAllServices(token);
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
	services: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
};

export const serviceSlice = createSlice({
	name: 'services',
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
			.addCase(getAllServices.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllServices.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.services = action.payload;
			})
			.addCase(getAllServices.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.services = null;
			});
	},
});

export const { reset } = serviceSlice.actions;
export default serviceSlice.reducer;
