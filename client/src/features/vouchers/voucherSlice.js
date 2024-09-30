import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import voucherService from './voucherService';

export const getAllVouchers = createAsyncThunk(
	'vouchers/getAllVouchers',
	async (_, thunkAPI) => {
		try {
			return await voucherService.getAllVouchers();
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

export const getAllAccountVouchers = createAsyncThunk(
	'vouchers/getAllAccountVouchers',
	async (accountId, thunkAPI) => {
		try {
			return await voucherService.getAllAccountVouchers(accountId);
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

export const getVoucherById = createAsyncThunk(
	'vouchers/getVouchetById',
	async ({voucherId, accountId}, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount?.data?.token;
			return await voucherService.getVoucherById(token, voucherId, accountId);

		} catch (error) {
			const message =
				(error.response && error.response.data && error.response.data.message) ||
				error.message ||
				error.toString();

			return thunkAPI.rejectWithValue(message);

		}
	}
)

export const createVoucher = createAsyncThunk(
	'vouchers/createVoucher',
	async (voucherData, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await voucherService.createVoucher(token, voucherData);
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

export const updateVoucher = createAsyncThunk(
	'vouchers/updateVoucher',
	async ({ voucherData, id }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await voucherService.updateVoucher(token, voucherData, id);
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

export const deleteVoucher = createAsyncThunk(
	'vouchers/deleteVoucher',
	async (id, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await voucherService.deleteVoucher(token, id);
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

export const redeemVoucher = createAsyncThunk(
	'vouchers/redeemVoucher',
	async ({accountId, voucherId}, thunkAPI)=>{
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await voucherService.redeemVoucher(token, accountId, voucherId);
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
)
export const getRedeemedVouchers = createAsyncThunk(
	'vouchers/getRedeemedVouchers',
	async (accountId, thunkAPI) => {
		
	try {
		const storedAccount = JSON.parse(localStorage.getItem('account'));
		const token = storedAccount?.data?.token;
		return await voucherService.getRedeemedVouchers(token, accountId);
		
	} catch (error) {
		const message =
		(error.response && error.response.data && error.response.data.message) ||
		error.message ||
		error.toString();
		
		return thunkAPI.rejectWithValue(message);
	}
	}
  );

const initialState = {
	vouchers: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
};

export const voucherSlice = createSlice({
	name: 'vouchers',
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
			.addCase(getAllVouchers.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllVouchers.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.vouchers = action.payload;
			})
			.addCase(getAllVouchers.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.vouchers = null;
			})
			.addCase(getAllAccountVouchers.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllAccountVouchers.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.vouchers = action.payload;
			})
			.addCase(getAllAccountVouchers.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.vouchers = null;
			})

			.addCase(deleteVoucher.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteVoucher.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.vouchers = state.vouchers.filter(
					(voucher) => String(voucher._id) !== String(action.payload)
				);
			})
			.addCase(deleteVoucher.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})

			.addCase(createVoucher.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createVoucher.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.vouchers.push(action.payload);
			})
			.addCase(createVoucher.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})

			.addCase(updateVoucher.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateVoucher.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.vouchers[
					state.vouchers.findIndex((voucher) => voucher._id == action.payload._id)
				] = action.payload;
			})
			.addCase(updateVoucher.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(redeemVoucher.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(redeemVoucher.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.vouchers[
					state.vouchers.findIndex((voucher) => voucher._id == action.payload._id)
				] = action.payload;
			})
			.addCase(redeemVoucher.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.vouchers = null;
			})
			.addCase(getRedeemedVouchers.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getRedeemedVouchers.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				if (Array.isArray(action.payload)) { // Kiểm tra xem action.payload có phải là một mảng không
					state.vouchers = action.payload; // Gán action.payload vào state.vouchers nếu nó là một mảng
				} else {
					console.error('Received payload is not an array:', action.payload); // Log lỗi nếu action.payload không phải là một mảng
				}
			})
			.addCase(getRedeemedVouchers.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.vouchers = [];
			})
			.addCase(getVoucherById.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getVoucherById.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.vouchers = action.payload;
			})
			.addCase(getVoucherById.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.vouchers = []
			});

	},
});

export const { reset } = voucherSlice.actions;
export default voucherSlice.reducer;