import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardsPage from "./pages/BoardsPage";
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <nav>
          <a href="/login">Login</a> | 
          <a href="/boards">Boards</a>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      <Routes>
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};


export default App;
