import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from './authService';

const account = JSON.parse(localStorage.getItem('account'));
console.log(account);

export const login = createAsyncThunk(
	'auth/login',
	async (account, thunkAPI) => {
		try {
			return await authService.login(account);
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

export const loginWithGoogle = createAsyncThunk(
	'auth/loginWithGoogle',
	async (account, thunkAPI) => {
		try {
			return await authService.loginWithGoogle(account);
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

export const logout = createAsyncThunk('auth/logout', async () => {
	await authService.logout();
});

export const register = createAsyncThunk(
	'auth/register',
	async (accountData, thunkAPI) => {
		try {
			return await authService.register(accountData);
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

export const getAllAccounts = createAsyncThunk(
	'auth/getAllAccounts',
	async (_, thunkAPI) => {
		try {
			return await authService.getAllAccounts();
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

export const updateAccountInformation = createAsyncThunk(
	'auth/updateAccountInformation',
	async (account, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await authService.updateAccountInformation(account, token);
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

export const updateIsUsedVoucher = createAsyncThunk(
	'auth/updateIsUsedVoucher',
	async ({ accountId, voucherId, isUsed }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount?.data?.token;
			return await authService.updateIsUsedVoucher(
				accountId,
				voucherId,
				isUsed,
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

export const blockAccountChange = createAsyncThunk(
	'auth/blockAccountChange',
	async (accountId, thunkAPI) => {
		try {
			return await authService.blockAccountChange(accountId);
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

export const updateAccountForgottenPassword = createAsyncThunk(
	'auth/updateAccountForgottenPassword',
	async ({ password, accountId }, thunkAPI) => {
		try {
			return await authService.updateAccountForgottenPassword(
				password,
				accountId
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

export const getAccountForgottenPassword = createAsyncThunk(
	'auth/getAccountForgottenPassword',
	async (phoneNumber2, thunkAPI) => {
		try {
			return await authService.getAccountForgottenPassword(phoneNumber2);
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

export const getAccountInformation = createAsyncThunk(
	'auth/getAccountInformation',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await authService.getAccountInformation(token);
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

//black list
export const addDomesticHelperToBlackList = createAsyncThunk(
	'auth/addDomesticHelperToBlackList',
	async (domesticHelperId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await authService.addDomesticHelperToBlackList(
				domesticHelperId,
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

export const deleteDomesticHelperFromBlackList = createAsyncThunk(
	'auth/deleteDomesticHelperFromBlackList',
	async (domesticHelperId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await authService.deleteDomesticHelperFromBlackList(
				domesticHelperId,
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

//favorite list
export const addDomesticHelperToFavoriteList = createAsyncThunk(
	'auth/addDomesticHelperToFavoriteList',
	async (domesticHelperId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await authService.addDomesticHelperToFavoriteList(
				domesticHelperId,
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

export const deleteDomesticHelperFromFavoriteList = createAsyncThunk(
	'auth/deleteDomesticHelperFromFavoriteList',
	async (domesticHelperId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await authService.deleteDomesticHelperFromFavoriteList(
				domesticHelperId,
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

export const inviteFriend = createAsyncThunk(
	'auth/inviteFriend',
	async ({ invitedEmail, invitationCode, accountName }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await authService.inviteFriend(
				invitedEmail,
				invitationCode,
				accountName,
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

export const updateRatingDomesticHelper = createAsyncThunk(
	'auth/updateRatingDomesticHelper',
	async ({ ratingData, domesticHelperId }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await authService.updateRatingDomesticHelper(
				ratingData,
				domesticHelperId,
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

export const receiveGiftHistory = createAsyncThunk(
	'auth/receiveGiftHistory',
	async ({ domesticHelperId, levelName, levelApoint }, thunkAPI) => {
		try {
			return await authService.receiveGiftHistory(
				domesticHelperId,
				levelName,
				levelApoint
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

export const updateDomesticHelperLevel = createAsyncThunk(
	'auth/updateDomesticHelperLevel',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const domesticHelperId = storedAccount.data.account._id;
			return await authService.updateDomesticHelperLevel(
				domesticHelperId
				// token
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

export const checkInvitationCode = createAsyncThunk(
	'auth/checkInvitationCode',
	async (invitationCode, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await authService.checkInvitationCode(invitationCode, token);
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

export const loadMoneyAfterUsingInvitationCode = createAsyncThunk(
	'auth/loadMoneyAfterUsingInvitationCode',
	async (ownerId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			console.log('id: ', ownerId, 'token: ', token);
			return await authService.loadMoneyAfterUsingInvitationCode(
				ownerId,
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

export const getDomesticHelpersRanking = createAsyncThunk(
	'auth/getDomesticHelpersRanking',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await authService.getDomesticHelpersRanking(token);
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

export const getDomesticHelpersTotalWorkingHours = createAsyncThunk(
	'auth/getDomesticHelpersTotalWorkingHours',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const domesticHelperId = storedAccount.data.account._id;
			console.log('domesticHelperId in Slice', storedAccount.data.account._id);
			return await authService.getDomesticHelpersTotalWorkingHours(
				domesticHelperId
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

export const updateAPoint = createAsyncThunk(
	'auth/updateApoint',
	async ({accountId, aPoints,apoint, serviceId }, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;

			return await authService.updateAPoint(
				accountId,
				aPoints,
				apoint,
				serviceId,
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
export const updateRole = createAsyncThunk(
	'auth/updateAccountRole',
	async (accountId, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await authService.updateRole(accountId, token);
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
export const getAllReports = createAsyncThunk(
	'auth/getAllReports',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await authService.getAllReports(token);
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

export const getTransactionHistory = createAsyncThunk(
	'auth/transactions',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await authService.getTransactionHistory(token);
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

export const getAccountBalance = createAsyncThunk(
	'auth/getAccountBalance',
	async (_, thunkAPI) => {
		try {
			const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await authService.getAccountBalance(token);
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
	account: account || null,
	accounts: [],
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
	accountId: null,
	transactions: [],
};

export const authSlice = createSlice({
	name: 'auth',
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
			.addCase(login.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.account = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.account = null;
			})
			.addCase(loginWithGoogle.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(loginWithGoogle.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.account = action.payload;
			})
			.addCase(loginWithGoogle.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.account = null;
			})
			.addCase(logout.fulfilled, (state) => {
				state.account = null;
			})
			.addCase(updateAccountInformation.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateAccountInformation.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.account = action.payload;
			})
			.addCase(updateAccountInformation.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.account = null;
			})
			.addCase(updateIsUsedVoucher.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateIsUsedVoucher.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.account = action.payload;
			})
			.addCase(blockAccountChange.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(blockAccountChange.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.account = action.payload;
			})
			.addCase(updateIsUsedVoucher.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.account = null;
			})
			.addCase(blockAccountChange.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(updateAccountForgottenPassword.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateAccountForgottenPassword.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.accounts[
					state.accounts.findIndex(
						(account) => account._id == action.payload._id
					)
				] = action.payload;
			})
			.addCase(updateAccountForgottenPassword.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getAccountForgottenPassword.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAccountForgottenPassword.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.accountId = action.payload;
			})
			.addCase(getAccountForgottenPassword.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.accountId = null;
			})
			.addCase(getAccountInformation.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAccountInformation.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.account = action.payload;
			})
			.addCase(getAccountInformation.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.account = null;
			})
			.addCase(register.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getAllAccounts.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllAccounts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.accounts = action.payload;
			})
			.addCase(getAllAccounts.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(addDomesticHelperToBlackList.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(addDomesticHelperToBlackList.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.account = action.payload;
			})
			.addCase(addDomesticHelperToBlackList.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(deleteDomesticHelperFromBlackList.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteDomesticHelperFromBlackList.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.account = action.payload;
			})
			.addCase(deleteDomesticHelperFromBlackList.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(addDomesticHelperToFavoriteList.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(addDomesticHelperToFavoriteList.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.account = action.payload;
			})
			.addCase(addDomesticHelperToFavoriteList.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(deleteDomesticHelperFromFavoriteList.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(
				deleteDomesticHelperFromFavoriteList.fulfilled,
				(state, action) => {
					state.isLoading = false;
					state.isSuccess = true;
					state.account = action.payload;
				}
			)
			.addCase(
				deleteDomesticHelperFromFavoriteList.rejected,
				(state, action) => {
					state.isLoading = false;
					state.isError = true;
					state.message = action.payload;
				}
			)
			.addCase(inviteFriend.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(inviteFriend.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(updateRatingDomesticHelper.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateRatingDomesticHelper.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.account = action.payload;
			})
			.addCase(updateRatingDomesticHelper.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(checkInvitationCode.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(checkInvitationCode.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(checkInvitationCode.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(updateAPoint.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateAPoint.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.account = action.payload;
			})
			.addCase(updateAPoint.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(loadMoneyAfterUsingInvitationCode.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getDomesticHelpersRanking.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getDomesticHelpersRanking.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.accounts = action.payload;
			})
			.addCase(getDomesticHelpersRanking.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getDomesticHelpersTotalWorkingHours.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(
				getDomesticHelpersTotalWorkingHours.fulfilled,
				(state, action) => {
					state.isLoading = false;
					state.isSuccess = true;
					state.accounts = action.payload;
				}
			)
			.addCase(
				getDomesticHelpersTotalWorkingHours.rejected,
				(state, action) => {
					state.isLoading = false;
					state.isError = true;
					state.message = action.payload;
				}
			)
			.addCase(updateDomesticHelperLevel.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateDomesticHelperLevel.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.accounts = action.payload;
			})
			.addCase(updateDomesticHelperLevel.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(updateRole.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateRole.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.accounts[
					state.accounts.findIndex(
						(account) => account._id == action.payload._id
					)
				] = action.payload;
			})
			.addCase(updateRole.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getTransactionHistory.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getTransactionHistory.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.transactions = action.payload;
			})
			.addCase(getTransactionHistory.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getAccountBalance.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAccountBalance.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.account = action.payload;
			})
			.addCase(getAccountBalance.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.account = null;
			});
	},
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
