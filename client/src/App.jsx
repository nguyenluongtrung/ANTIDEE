import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage/HomePage';
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
         
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App