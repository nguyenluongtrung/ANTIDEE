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
import { QualificationManagement } from './pages/AdminPage/QualificationManagement/QualificationManagement';
import { CongratsPage } from './pages/CongratsPage';
import { QuestionManagement } from './pages/AdminPage/QuestionManagement/QuestionManagement';
import { WeatherForecastPage } from './pages/WeatherForecastPage';
import { VoucherManagement } from './pages/AdminPage/VoucherManagement/VoucherManagement';
import { AppFeedbackManagement } from './pages/AdminPage/AppFeedbackManagement/AppFeedbackManagement';
import { ServiceManagement } from './pages/AdminPage/ServiceManagement/ServiceManagement';
import { Sidebar } from './components';
import { UpdateProfileForDW } from './pages/UpdateProfileForDW/UpdateProfileForDW';
import { QualificationPage } from './pages/QualificationPage';
import { JobPostListPage } from './pages/JobPostListPage/JobPostListPage';
import { VoucherHistory } from './pages/HistoryVoucher/VoucherHistory';
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
import { DemoViewVideoYoutube } from './pages/DemoViewVideoYoutube';
import { VideoManagement } from './pages/AdminPage/VideoManagement/VideoManagement';
import { JourneyPage } from './pages/JourneyPage';
import { ChatForm } from './pages/Chatting/ChatForm';
import { PromotionManagement } from './pages/AdminPage/PromotionManagement/PromotionManagement';
import { RankingPage } from './pages/RankingPage/RankingPage';
import { Dashboard } from './pages/AdminPage/Dashboard/Dashboard';
import { AccumulatePoint } from './pages/MyAccount/AccumulatePoint/AccumulatePoint'
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
		<div className="app-container select-none">
			{!isAdminPage && (
				<div className="sidebar-container z-50">
					<Sidebar />
				</div>
			)}
			<ChatForm />
			<div className="content-container select-none">
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route path="/" element={<HomePage />} />
						<Route path="/home" element={<HomePage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/my-account" element={<MyAccount />} />
						<Route path="/entry-exam" element={<EntryExamPage />} />
						<Route path="/invite-friend" element={<InviteFriendPage />} />
						<Route path="/become-helper" element={<WannaBecomeHelperPage />} />
						<Route path="/congrats" element={<CongratsPage />} />
						<Route path="/weather-forecast" element={<WeatherForecastPage />} />
						<Route path="/update-dw" element={<UpdateProfileForDW />} />
						<Route path="/qualifications" element={<QualificationPage />} />
						<Route
							path="/job-posting-history"
							element={<JobPostingHistory />}
						/>
						<Route path="/my-jobs" element={<MyJobs />} />
						<Route
							path="/exam-result-history"
							element={<ExamResultHistory />}
						/>
						<Route path="/job-posts" element={<JobPostListPage />} />
						<Route path="/reply-feedback" element={<ReplyFeedback />} />
						<Route path="/black-list" element={<BlackList />} />
						<Route path="/favorite-list" element={<FavoriteList />} />
						<Route path="/apoints" element={<AccumulatePoint />} />
						<Route path="/demo-video" element={<DemoViewVideoYoutube />} />
						<Route
							path="/domestic-helper-feedback"
							element={<DomesticHelper />}
						/>
						<Route path="/voucher-history" element={<VoucherHistory />} />
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
						<Route path="/vouchers" element={<VoucherList />} />
						<Route path="/sign-up" element={<SignUpPage />} />
						<Route path="/forgot-password" element={<ForgotPasswordPage />} />
						<Route path="/journey" element={<JourneyPage />} />
						<Route path="/ranking" element={<RankingPage />} />
					</Route>
					{isAdminPage && (
						<>
							<Route path="/admin" element={<AdminPage />} />
							<Route path="/admin-dashboard" element={<Dashboard />} />
							<Route path="/admin-exam" element={<ExamManagement />} />
							<Route path="/admin-question" element={<QuestionManagement />} />
							<Route path="/admin-voucher" element={<VoucherManagement />} />
							<Route
								path="/admin-promotion"
								element={<PromotionManagement />}
							/>
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
						</>
					)}
				</Routes>
			</div>
		</div>
	);
};

export default App;
