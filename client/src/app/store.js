import { configureStore } from '@reduxjs/toolkit';
import authReducer from './../features/auth/authSlice';
import examReducer from './../features/exams/examSlice';
import serviceReducer from './../features/services/serviceSlice';
import voucherReducer from './../features/vouchers/voucherSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		exams: examReducer,
		services: serviceReducer,
		vouchers: voucherReducer,
	},
});
