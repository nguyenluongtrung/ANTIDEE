import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Layout } from './layout';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App