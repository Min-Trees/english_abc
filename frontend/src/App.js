import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
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
        <Link to="/ai-tutor">AI Tutor</Link>
        {user ? (
          <>
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

// ============== HOME PAGE ==============
function HomePage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/courses`).then(res => setCourses(res.data)).catch(() => {});
    axios.get(`${API_URL}/courses/featured`).then(res => setFeatured(res.data)).catch(() => {});
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Master English with AI</h1>
          <p>Learn English online with AI-powered tutoring, interactive courses, and vocabulary building tools.</p>
          {user ? (
            <Link to="/courses" className="btn btn-primary btn-lg">Continue Learning</Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-lg">Start Free Today</Link>
          )}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="featured-section">
          <h2>Featured Courses</h2>
          <div className="course-grid">
            {featured.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-thumb">{course.title.charAt(0)}</div>
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description?.substring(0, 80)}...</p>
                  <div className="course-meta">
                    <span>Level: {course.level}</span>
                    <span>{course.totalLessons} Lessons</span>
                    <span>Rating: {course.rating}/5</span>
                  </div>
                  <Link to={`/courses/${course.id}`} className="btn btn-outline btn-sm">View Course</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="features-section">
        <h2>Why Learn with ABC English?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">AI</div>
            <h3>AI-Powered Tutor</h3>
            <p>Get instant help from our AI tutor available 24/7. Ask questions and get personalized explanations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">C</div>
            <h3>Structured Courses</h3>
            <p>Learn from beginner to advanced with carefully designed courses for all levels.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">V</div>
            <h3>Vocabulary Building</h3>
            <p>Expand your vocabulary with our curated word lists and spaced repetition system.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============== COURSES PAGE ==============
function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = filter === 'ALL' ? `${API_URL}/courses` : `${API_URL}/courses/level/${filter}`;
    axios.get(url).then(res => setCourses(res.data)).finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>All Courses</h1>
        <div className="filter-tabs">
          {['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
            <button
              key={lvl}
              className={`filter-tab ${filter === lvl ? 'active' : ''}`}
              onClick={() => setFilter(lvl)}
            >
              {lvl === 'ALL' ? 'All Levels' : `Level ${lvl}`}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : (
        <div className="course-grid">
          {courses.length === 0 ? (
            <p className="empty-state">No courses found for this level.</p>
          ) : (
            courses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-thumb">{course.title.charAt(0)}</div>
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description?.substring(0, 100)}...</p>
                  <div className="course-meta">
                    <span>Level: {course.level}</span>
                    <span>{course.totalLessons} Lessons</span>
                    <span>Rating: {course.rating}/5</span>
                  </div>
                  <Link to={`/courses/${course.id}`} className="btn btn-primary btn-sm">Start Learning</Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ============== COURSE DETAIL PAGE ==============
function CourseDetailPage() {
  const { id } = React.useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/courses/${id}`).then(res => setCourse(res.data)).catch(() => {});
    axios.get(`${API_URL}/courses/${id}/lessons`).then(res => setLessons(res.data)).catch(() => {});
  }, [id]);

  if (!course) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="course-detail">
        <div className="course-detail-header">
          <div className="course-detail-thumb">{course.title.charAt(0)}</div>
          <div>
            <h1>{course.title}</h1>
            <p className="course-detail-desc">{course.description}</p>
            <div className="course-meta">
              <span>Instructor: {course.instructor}</span>
              <span>Level: {course.level}</span>
              <span>{course.totalLessons} Lessons</span>
              <span>Rating: {course.rating}/5</span>
              <span>{course.enrolledCount} Students</span>
            </div>
            <button className="btn btn-primary btn-lg" style={{ marginTop: '1rem' }}>
              Enroll Now
            </button>
          </div>
        </div>

        <div className="lessons-list">
          <h2>Course Lessons</h2>
          {lessons.length === 0 ? (
            <p className="empty-state">No lessons available yet.</p>
          ) : (
            lessons.map((lesson, index) => (
              <div key={lesson.id} className="lesson-item">
                <span className="lesson-number">{index + 1}</span>
                <div className="lesson-info">
                  <h4>{lesson.title}</h4>
                  <span>{lesson.durationMinutes} min</span>
                </div>
                <button className="btn btn-outline btn-sm">Start</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ============== VOCABULARY PAGE ==============
function VocabularyPage() {
  const [vocab, setVocab] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = filter === 'ALL' ? `${API_URL}/vocabulary` : `${API_URL}/vocabulary?level=${filter}`;
    axios.get(url).then(res => setVocab(res.data)).finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Vocabulary</h1>
        <div className="filter-tabs">
          {['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
            <button
              key={lvl}
              className={`filter-tab ${filter === lvl ? 'active' : ''}`}
              onClick={() => setFilter(lvl)}
            >
              {lvl === 'ALL' ? 'All Levels' : `Level ${lvl}`}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="loading">Loading vocabulary...</div>
      ) : (
        <div className="vocab-grid">
          {vocab.length === 0 ? (
            <p className="empty-state">No vocabulary found.</p>
          ) : (
            vocab.map(word => (
              <div key={word.id} className="vocab-card">
                <div className="vocab-word">{word.word}</div>
                <div className="vocab-pronunciation">{word.pronunciation}</div>
                <div className="vocab-translation">{word.translation}</div>
                <div className="vocab-definition">{word.definition}</div>
                {word.example && (
                  <div className="vocab-example">
                    <em>"{word.example}"</em>
                    <small>{word.exampleTranslation}</small>
                  </div>
                )}
                <div className="vocab-meta">
                  <span className="badge">{word.level}</span>
                  <span className="badge badge-secondary">{word.category}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ============== AI TUTOR PAGE ==============
function AITutorPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      axios.get(`${API_URL}/ai/history`, { params: { userId: user.userId } })
        .then(res => setMessages(res.data.map(h => ({
          role: 'assistant',
          content: h.aiResponse,
          isHistory: true
        }))).catch(() => {});
    }
  }, [user]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/ai/chat`, {
        message: userMsg,
        conversationContext: ''
      }, { params: { userId: user?.userId } });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="auth-required">
          <h2>AI Tutor</h2>
          <p>Please login to chat with the AI tutor.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="ai-tutor-container">
        <div className="page-header">
          <h1>AI English Tutor</h1>
          <p>Ask me anything about English learning!</p>
        </div>
        <div className="chat-window">
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-welcome">
                <p>Hello! I'm your AI English tutor. How can I help you today?</p>
                <p>You can ask me about:</p>
                <ul>
                  <li>Grammar explanations</li>
                  <li>Vocabulary meaning and usage</li>
                  <li>Conversation practice</li>
                  <li>Translation help</li>
                </ul>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                <div className="chat-bubble">
                  {msg.role === 'assistant' ? 'Tutor: ' : 'You: '}{msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message assistant">
                <div className="chat-bubble typing">Thinking...</div>
              </div>
            )}
          </div>
          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask me about English..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="btn btn-primary" disabled={loading}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== LOGIN PAGE ==============
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <div className="demo-accounts">
          <p><strong>Demo accounts:</strong></p>
          <p>admin / admin123</p>
          <p>teacher / teacher123</p>
          <p>student / student123</p>
        </div>
      </div>
    </div>
  );
}

// ============== REGISTER PAGE ==============
function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await register(form.username, form.email, form.password, form.fullName);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
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
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
              <Route path="/ai-tutor" element={<AITutorPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
