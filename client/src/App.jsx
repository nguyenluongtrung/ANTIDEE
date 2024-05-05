import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import { CongratsPage } from './pages/CongratsPage';
import { QuestionManagement } from './pages/AdminPage/QuestionManagement/QuestionManagement';

const App = () => {
	return (
		<div>
			<Router>
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
						<Route path="/congrats" element={<CongratsPage/>}/>
					</Route>
					<Route path="/admin" element={<AdminPage />} />
					<Route path="/admin-exam" element={<ExamManagement />} />
					<Route path="/admin-question" element={<QuestionManagement />} />
				</Routes>
			</Router>
		</div>
	);
};

export default App;
