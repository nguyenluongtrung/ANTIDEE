import { configureStore } from '@reduxjs/toolkit';
import authReducer from './../features/auth/authSlice';
import examReducer from './../features/exams/examSlice';
import serviceReducer from './../features/services/serviceSlice';
import questionReducer from './../features/questions/questionSlice';
import voucherReducer from './../features/vouchers/voucherSlice';
import qualificationReducer from './../features/qualifications/qualificationSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		exams: examReducer,
		services: serviceReducer,
		questions: questionReducer,
		vouchers: voucherReducer,
		qualifications: qualificationReducer,
	},
});
