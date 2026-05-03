import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import './index.css';

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
