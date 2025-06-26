import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardsPage from "./pages/BoardsPage";
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <nav>
          <a href="/login">Login</a> | 
          <a href="/boards">Boards</a>
        </nav>
      <Routes>
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
