import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Layout } from './layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { MyAccount } from './pages/MyAccount';
import {WannaBecomeHelperPage} from './pages/WannaBecomeHelperPage'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/become-helper" element={<WannaBecomeHelperPage/>}/>
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App