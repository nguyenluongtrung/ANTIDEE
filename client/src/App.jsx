import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
} from 'react-router-dom';
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
import { Sidebar } from './components';
import { UpdateProfileForDW } from './pages/UpdateProfileForDW/UpdateProfileForDW';
import { QualificationPage } from './pages/QualificationPage';

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
		<div className="app-container">
			{!isAdminPage && (
				<div className="sidebar-container">
					<Sidebar />
				</div>
			)}
			<div className="content-container">
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
						<Route path="/update-dw" element={<UpdateProfileForDW/>}/>
						<Route path="/qualifications" element={<QualificationPage />} />
					</Route>
					{isAdminPage && (
						<>
							<Route path="/admin" element={<AdminPage />} />
							<Route path="/admin-exam" element={<ExamManagement />} />
							<Route path="/admin-question" element={<QuestionManagement />} />
							<Route path="/admin-voucher" element={<VoucherManagement />} />
							<Route
								path="/admin-qualification"
								element={<QualificationManagement />}
							/>
						</>
					)}
				</Routes>
			</div>
		</div>
	);
};

export default App;
