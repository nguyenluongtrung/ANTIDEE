import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import serviceService from './serviceService';

export const getAllServices = createAsyncThunk(
	'services/getAllServices',
	async (_, thunkAPI) => {
		try {
			return await serviceService.getAllServices();
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

export const createService = createAsyncThunk(
	'services/createService',
	async (serviceData, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			// const removedItem = serviceData.priceOptions.shift();
			console.log('serviceData', serviceData);
			return await serviceService.createService(token, serviceData);
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

export const updateService = createAsyncThunk(
	'services/updateService',
	async ({ serviceData, id }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await serviceService.updateService(token, serviceData, id);
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

export const deleteService = createAsyncThunk(
	'services/deleteService',
	async (id, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await serviceService.deleteService(token, id);
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
			})
			.addCase(createService.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createService.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.services.push(action.payload);
			})
			.addCase(createService.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(deleteService.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteService.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.services = state.services.filter(
					(service) => String(service._id) !== String(action.payload)
				);
			})
			.addCase(deleteService.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(updateService.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateService.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.services[
					state.services.findIndex(
						(service) => service._id == action.payload?._id
					)
				] = action.payload;
			})
			.addCase(updateService.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});

export const { reset } = serviceSlice.actions;
export default serviceSlice.reducer;
