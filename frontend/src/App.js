import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('abc_user');
    const savedToken = localStorage.getItem('abc_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      if (res.data.success) {
        const data = res.data.data;
        localStorage.setItem('abc_token', data.token);
        localStorage.setItem('abc_user', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (username, email, password, fullName) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { username, email, password, fullName });
      if (res.data.success) {
        const data = res.data.data;
        localStorage.setItem('abc_token', data.token);
        localStorage.setItem('abc_user', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('abc_token');
    localStorage.removeItem('abc_user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

// Import pages from pages folder
import LandingPage from './pages/LandingPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import VocabularyPage from './pages/VocabularyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ExercisesPage from './pages/ExercisesPage';
import ForumPage from './pages/ForumPage';
import GamificationPage from './pages/GamificationPage';
import ListeningPage from './pages/ListeningPage';
import SpeakingPage from './pages/SpeakingPage';
import MentorPage from './pages/MentorPage';
import ProgressPage from './pages/ProgressPage';
import PlacementTestPage from './pages/PlacementTestPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LearningPathPage from './pages/LearningPathPage';
import LearningAnalyticsPage from './pages/LearningAnalyticsPage';
import RecommendationPage from './pages/RecommendationPage';
import DailyChallengePage from './pages/DailyChallengePage';
import AgentPage from './pages/AgentPage';

// ============== NAVBAR ==============
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-logo">ABC English</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/vocabulary">Vocabulary</Link>
        <Link to="/agent">AI Agent</Link>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/daily-challenge">Daily Challenge</Link>
            <span className="user-greeting">Hello, {user.username}</span>
            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

// ============== FOOTER ==============
function Footer() {
  return (
    <footer className="footer">
      <p>ABC English Learning Platform &copy; 2026</p>
      <p>Powered by AI | Built with React & Spring Boot</p>
    </footer>
  );
}

// ============== APP ==============
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<LandingPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/gamification" element={<GamificationPage />} />
              <Route path="/listening" element={<ListeningPage />} />
              <Route path="/speaking" element={<SpeakingPage />} />
              <Route path="/mentor" element={<MentorPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/placement-test" element={<PlacementTestPage />} />
              <Route path="/teacher" element={<TeacherDashboardPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/learning-path" element={<LearningPathPage />} />
              <Route path="/analytics" element={<LearningAnalyticsPage />} />
              <Route path="/recommendations" element={<RecommendationPage />} />
              <Route path="/daily-challenge" element={<DailyChallengePage />} />
              <Route path="/agent" element={<AgentPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
