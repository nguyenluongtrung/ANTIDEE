import { configureStore } from '@reduxjs/toolkit';
import authReducer from './../features/auth/authSlice';
import examReducer from './../features/exams/examSlice';
import serviceReducer from './../features/services/serviceSlice';
import questionReducer from './../features/questions/questionSlice';
import voucherReducer from './../features/vouchers/voucherSlice';
import qualificationReducer from './../features/qualifications/qualificationSlice';
import jobPostsReducer from './../features/jobPosts/jobPostsSlice';
import domesticHelperFeedbackReducer from './../features/domesticHelperFeedback/domesticHelperFeedbackSlice';
import promotionReducer from './../features/promotions/promotionSlice';
import videoReducer from './../features/videos/videoSlice';
import appFeedbackReducer from './../features/appFeedbacks/appFeedbackSlice';
import chatReducer from './../features/chatting/chattingSlice';
import messageReducer from './../features/message/messageSlice';
import forumPostReducer from './../features/forumPost/forumPostSlice';
import topicReducer from './../features/topics/topicSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		exams: examReducer,
		services: serviceReducer,
		questions: questionReducer,
		vouchers: voucherReducer,
		qualifications: qualificationReducer,
		jobPosts: jobPostsReducer,
		domesticHelperFeedbacks: domesticHelperFeedbackReducer,
		promotions: promotionReducer,
		videos: videoReducer,
		appFeedbacks: appFeedbackReducer,
		chatting: chatReducer,
		messages: messageReducer,
		forumPosts:forumPostReducer,
		topics:topicReducer,
	},
});