import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import promotionService from './promotionService';

export const getAllPromotions = createAsyncThunk(
	'promotions/getAllPromotions',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await promotionService.getAllPromotions(token);
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

export const createPromotion = createAsyncThunk(
	'promotions/createPromotion',
	async (promotionData, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await promotionService.createPromotion(promotionData,token );
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

export const updatePromotion = createAsyncThunk(
	'promotions/updatePromotion',
	async ({ promotionData, id }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await promotionService.updatePromotion(token, promotionData, id);
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

export const deletePromotion = createAsyncThunk(
	'promotions/deletePromotion',
	async (id, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await promotionService.deletePromotion(id,token);
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
	promotions: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
};

export const promotionSlice = createSlice({
	name: 'promotions',
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
			.addCase(getAllPromotions.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllPromotions.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.promotions = action.payload;
			})
			.addCase(getAllPromotions.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.promotions = null;
			})
			.addCase(createPromotion.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createPromotion.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.promotions.push(action.payload);
			})
			.addCase(createPromotion.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(deletePromotion.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deletePromotion.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.promotions = state.promotions.filter(
					(promotion) => String(promotion._id) !== String(action.payload._id)
				);
			})
			.addCase(deletePromotion.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(updatePromotion.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updatePromotion.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.promotions[
					state.promotions.findIndex((promotion) => promotion._id == action.payload._id)
				] = action.payload;
			})
			.addCase(updatePromotion.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});

export const { reset } = promotionSlice.actions;
export default promotionSlice.reducer;
