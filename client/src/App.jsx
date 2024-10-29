import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
} from 'react-router-dom';
import 'aos/dist/aos.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Layout } from './layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { MyAccount } from './pages/MyAccount';
import { EntryExamPage } from './pages/EntryExamPage';
import { InviteFriendPage } from './pages/InviteFriendPage';
import { WannaBecomeHelperPage } from './pages/WannaBecomeHelperPage';
import { AdminPage } from './pages/AdminPage';
import { ExamManagement } from './pages/AdminPage/ExamManagement/ExamManagement';
import { CreateExam } from './pages/AdminPage/ExamManagement/CreateExam/CreateExam';
import { QualificationManagement } from './pages/AdminPage/QualificationManagement/QualificationManagement';
import { CongratsPage } from './pages/CongratsPage';
import { QuestionManagement } from './pages/AdminPage/QuestionManagement/QuestionManagement';
import { WeatherForecastPage } from './pages/WeatherForecastPage';
import { AppFeedbackManagement } from './pages/AdminPage/AppFeedbackManagement/AppFeedbackManagement';
import { ServiceManagement } from './pages/AdminPage/ServiceManagement/ServiceManagement';
import { UpdateProfileForDW } from './pages/UpdateProfileForDW/UpdateProfileForDW';
import { QualificationPage } from './pages/QualificationPage';
import { JobPostListPage } from './pages/JobPostListPage/JobPostListPage';
import { VoucherHistory } from './pages/HistoryVoucher/VoucherHistory';
import { DepositPage } from './pages/DepositPage/DepositPage';
import {
	ConfirmPage,
	DetailOptionPage,
	TimeAndContactPage,
	ViewServiceDetail,
	WorkingLocationPage,
} from './pages/JobPostingPage';
import { JobPostingHistory } from './pages/MyAccount/JobPostingHistory/JobPostingHistory';
import { SignUpPage } from './pages/SignUpPage';
import { DomesticHelper } from './pages/MyAccount/JobPostingHistory/DomesticHelperPage/DomesticHelper';
import { ReplyFeedback } from './pages/MyAccount/ReplyFeedback/ReplyFeedback';
import { VoucherList } from './pages/SearchVoucherPage/VoucherList';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ExamResultHistory } from './pages/MyAccount/ExamResultHistory/ExamResultHistory';
import { MyJobs } from './pages/MyAccount/MyJobs/MyJobs';
import { BlackList } from './pages/MyAccount/BlackList/BlackList';
import { FavoriteList } from './pages/MyAccount/FavoriteList/FavoriteList';
import { VideoManagement } from './pages/AdminPage/VideoManagement/VideoManagement';
import { CreateVideo } from './pages/AdminPage/VideoManagement/CreateVideo/CreateVideo';
import {UpdateVideo} from './pages/AdminPage/VideoManagement/UpdateVideo/UpdateVideo'; 
import { JourneyPage } from './pages/JourneyPage';
import { ChatForm } from './pages/Chatting/ChatForm';
import { PromotionManagement } from './pages/AdminPage/PromotionManagement/PromotionManagement';
import { RankingPage } from './pages/RankingPage/RankingPage';
import { Dashboard } from './pages/AdminPage/Dashboard/Dashboard';
import { AccumulatePoint } from './pages/MyAccount/AccumulatePoint/AccumulatePoint';
import { AccountManagement } from './pages/AdminPage/AccountManagement/AccountManagement';
import { UpdateAccountRole } from './pages/AdminPage/UpdateAccountRole/UpdateAccountRole';
import { TransactionHistory } from './pages/TransactionHistory/TransactionHistory';
import { AccountSalary } from './pages/MyAccount/AccountSalary/AccountSalary';
import { ForumLayout } from './pages/ForumPage/layout';
import { ForumDiscussions } from './pages/ForumPage/ForumDiscussions';
import { ForumRepositories } from './pages/ForumPage/ForumRepositories';
import { DetailedRepository } from './pages/ForumPage/DetailedRepository';
import { DetailedForumPost } from './pages/ForumPage/components/DetailedForumPost';
import { JobSchedulePage } from './pages/JobSchedulePage';
import { MyCourses } from './pages/CoursesPage';
import { LessonsPage } from './pages/CoursesPage/LessonsPage/LessonsPage';
import { VoucherDetail } from './pages/HistoryVoucher/VoucherDetail/VoucherDetail';
import { JobPostDetail } from './pages/JobPostListPage/JobPostDetail/JobPostDetail';
import { PromotionDetail } from './pages/AdminPage/PromotionManagement/PromotionDetail/PromotionDetail';
import { UpdatePromotion } from './pages/AdminPage/PromotionManagement/UpdatePromotion/UpdatePromotion';
import { CourseManagement } from './pages/AdminPage/CourseManagement/CourseManagement';
import { VideoDetail } from './pages/VideoDetail/VideoDetail';
import { ReportPostForum } from './pages/AdminPage/ReportPostForum/ReportPostForum';
import { ReportDetail } from './pages/AdminPage/ReportPostForum/ReportDetail/ReportDetail';
import { UpdateCourse } from './pages/AdminPage/CourseManagement/UpdateCourse/UpdateCourse';
import { CreateCourse } from './pages/AdminPage/CourseManagement/CreateCourse/CreateCourse';
import { UpdateExam } from './pages/AdminPage/ExamManagement/UpdateExam/UpdateExam';
import { QuestionDetail } from './pages/AdminPage/QuestionManagement/QuestionDetail/QuestionDetail';
import { CreateQuestion } from './pages/AdminPage/QuestionManagement/CreateQuestion/CreateQuestion';
import { UpdateQuestion } from './pages/AdminPage/QuestionManagement/UpdateQuestion/UpdateQuestion';
import { CoursesDetail } from './pages/AdminPage/CourseManagement/CourseDetail/CourseDetail';

const App = () => {
	return (
		<Router>
			<AppContent />
		</Router>
	);
};

const AppContent = () => {
	const { pathname } = useLocation();

	const isAdminPage = pathname.startsWith('/admin');
	return (
		<div className="app-container select-none bg-white">
			{!isAdminPage && <div className="sidebar-container z-50"></div>}
			<ChatForm />
			<div className="content-container select-none">
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route path="/" element={<HomePage />} />
						<Route path="/home" element={<HomePage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/my-account" element={<MyAccount />} />
						<Route path="/entry-exam/:examId" element={<EntryExamPage />} />
						<Route path="/invite-friend" element={<InviteFriendPage />} />
						<Route path="/become-helper" element={<WannaBecomeHelperPage />} />
						<Route path="/congrats" element={<CongratsPage />} />
						<Route path="/weather-forecast" element={<WeatherForecastPage />} />
						<Route path="/update-dw" element={<UpdateProfileForDW />} />
						<Route path="/qualifications" element={<QualificationPage />} />
						<Route path="/deposit" element={<DepositPage />} />
						<Route path="/courses" element={<MyCourses />} />
						<Route path="/course/:courseId" element={<LessonsPage />} />
						<Route
							path="/transaction-history"
							element={<TransactionHistory />}
						/>
						<Route
							path="/job-posting-history"
							element={<JobPostingHistory />}
						/>
						<Route path="/my-jobs" element={<MyJobs />} />
						<Route path="/account-salary" element={<AccountSalary />} />
						<Route
							path="/exam-result-history"
							element={<ExamResultHistory />}
						/>
						<Route path="/job-posts" element={<JobPostListPage />}>
							<Route path="/job-posts/:jobPostId" element={<JobPostDetail />} />
						</Route>
						<Route path="/reply-feedback" element={<ReplyFeedback />} />
						<Route path="/black-list" element={<BlackList />} />
						<Route path="/favorite-list" element={<FavoriteList />} />
						<Route path="/apoints" element={<AccumulatePoint />} />
						<Route path="/video-detail/:videoId" element={<VideoDetail />} />
						<Route
							path="/domestic-helper-feedback"
							element={<DomesticHelper />}
						/>
						<Route path="/voucher-history" element={<VoucherHistory />}>
							<Route
								path="/voucher-history/voucher-detail/:voucherId"
								element={<VoucherDetail />}
							/>
						</Route>
						<Route path="/job-posting">
							<Route
								path="view-service-detail/:serviceId"
								element={<ViewServiceDetail />}
							/>
							<Route
								path="working-location/:serviceId"
								element={<WorkingLocationPage />}
							/>
							<Route path="details/:serviceId" element={<DetailOptionPage />} />
							<Route
								path="time-contact/:serviceId"
								element={<TimeAndContactPage />}
							/>
							<Route path="confirm/:serviceId" element={<ConfirmPage />} />
						</Route>
						<Route path="/vouchers" element={<VoucherList />}>
							<Route
								path="/vouchers/voucher-detail/:voucherId"
								element={<VoucherDetail />}
							/>
						</Route>

						<Route path="/sign-up" element={<SignUpPage />} />
						<Route path="/forgot-password" element={<ForgotPasswordPage />} />
						<Route path="/journey" element={<JourneyPage />} />
						<Route path="/ranking" element={<RankingPage />} />
						<Route path="/job-schedule" element={<JobSchedulePage />} />
						<Route path="/forum" element={<ForumLayout />}>
							<Route path="discussions" element={<ForumDiscussions />}>
								<Route path="topic/:topicId" element={<ForumDiscussions />} />
							</Route>
							<Route path="repositories" element={<ForumRepositories />} />
							<Route
								path="repositories/:repositoryId"
								element={<DetailedRepository />}
							/>
							<Route
								path="discussions/:postId"
								element={<DetailedForumPost />}
							/>
						</Route>
					</Route>
					{isAdminPage && (
						<>
							<Route path="/admin" element={<AdminPage />} />
							<Route path="/admin-dashboard" element={<Dashboard />} />
							<Route path="/admin-exam" element={<ExamManagement />} />
							<Route path="/admin-exam/create" element={<CreateExam />} />
							<Route path="/admin-exam/update/:examId" element={<UpdateExam />} />
							<Route path="/admin-question" element={<QuestionManagement />} />
							<Route path="/admin-question/create" element={<CreateQuestion />} />
							<Route path="/admin-question/update/:questionId" element={<UpdateQuestion />} />
							<Route
								path="/admin-course"
								element={<CourseManagement />}>
							</Route>
							<Route
								path="/admin-course/create-course"
								element={<CreateCourse />}
							/>
							<Route
								path="/admin-course/update-course/:courseId"
								element={<UpdateCourse />}
							/>
							<Route
								path="/admin-course/detail-course/:courseId"
								element={<CoursesDetail />}
							/>
							<Route path="/admin-promotion" element={<PromotionManagement />}>
								<Route
									path="/admin-promotion/detail-promotion/:promotionId"
									element={<PromotionDetail />}
								/>
								<Route
									path="/admin-promotion/update-promotion/:promotionId"
									element={<UpdatePromotion />}
								/>
							</Route>
							<Route
								path="/admin-appFeedback"
								element={<AppFeedbackManagement />}
							/>
							<Route
								path="/admin-qualification"
								element={<QualificationManagement />}
							/>
							<Route path="/admin-service" element={<ServiceManagement />} />
							<Route path="/admin-video" element={<VideoManagement />} />
							<Route path="/admin-video/create" element={<CreateVideo />} />
							<Route path="/admin-video/update/:videoId" element={<UpdateVideo />} />
							<Route path="/admin-video/video-detail" element={<VideoDetail />} />
							<Route path="/admin-report-forum" element={<ReportPostForum />}>
								<Route
									path="/admin-report-forum/report-detail/:reportId"
									element={<ReportDetail />}
								/>
							</Route>
							<Route path="/admin-account" element={<AccountManagement />} />
							<Route path="/admin-role" element={<UpdateAccountRole />} />
						</>
					)}
				</Routes>
			</div>
		</div>
	);
};

export default App;