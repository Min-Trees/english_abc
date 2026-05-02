import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - global error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle 429 - Too Many Requests (Rate Limit)
    if (error.response?.status === 429) {
      console.warn('Quá nhiều yêu cầu. Vui lòng thử lại sau.');
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      console.error('Lỗi kết nối. Vui lòng kiểm tra internet.');
      return Promise.reject(error);
    }

    // Handle other errors
    const message = error.response?.data?.message || 'Đã xảy ra lỗi';
    if (error.response?.status >= 500) {
      console.error('Lỗi server. Vui lòng thử lại sau.');
    }

    return Promise.reject(error);
  }
);

// Retry logic for failed requests
const retryRequest = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((r) => setTimeout(r, delay * Math.pow(2, i)));
    }
  }
};

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: (token) => api.post('/auth/refresh', { refreshToken: token }),
  socialLogin: (provider, token) => api.post(`/auth/social/${provider}`, { token }),
};

// ─── User API ─────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.post('/user/change-password', data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ─── Course API ───────────────────────────────────────────────────────────────
export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  getChapters: (courseId) => api.get(`/courses/${courseId}/chapters`),
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll`),
  getProgress: (courseId) => api.get(`/courses/${courseId}/progress`),
  getMyCourses: () => api.get('/courses/my'),
  search: (query) => api.get('/courses/search', { params: { q: query } }),
};

// ─── Lesson API ───────────────────────────────────────────────────────────────
export const lessonAPI = {
  getById: (id) => api.get(`/lessons/${id}`),
  start: (lessonId) => api.post(`/lessons/${lessonId}/start`),
  complete: (lessonId) => api.post(`/lessons/${lessonId}/complete`),
  updateProgress: (lessonId, progress) => api.put(`/lessons/${lessonId}/progress`, { progress }),
};

// ─── Vocabulary API ───────────────────────────────────────────────────────────
export const vocabularyAPI = {
  getWords: (params) => api.get('/vocabulary/words', { params }),
  search: (query) => api.get('/vocabulary/search', { params: { q: query } }),
  getFlashcards: (params) => api.get('/vocabulary/flashcards', { params }),
  review: (data) => api.post('/vocabulary/review', data),
  addToLearning: (wordId) => api.post(`/vocabulary/learn/${wordId}`),
  quiz: (data) => api.post('/vocabulary/quiz', data),
  getStats: () => api.get('/vocabulary/stats'),
};

// ─── Exercise API ─────────────────────────────────────────────────────────────
export const exerciseAPI = {
  getById: (id) => api.get(`/exercises/${id}`),
  submit: (exerciseId, answers) => api.post(`/exercises/${exerciseId}/submit`, { answers }),
  getResults: () => api.get('/exercises/results'),
};

// ─── Forum API ─────────────────────────────────────────────────────────────────
export const forumAPI = {
  getPosts: (params) => api.get('/forum/posts', { params }),
  getPostById: (id) => api.get(`/forum/posts/${id}`),
  createPost: (data) => api.post('/forum/posts', data),
  updatePost: (id, data) => api.put(`/forum/posts/${id}`, data),
  deletePost: (id) => api.delete(`/forum/posts/${id}`),
  likePost: (id) => api.post(`/forum/posts/${id}/like`),
  getComments: (postId) => api.get(`/forum/posts/${postId}/comments`),
  addComment: (postId, data) => api.post(`/forum/posts/${postId}/comments`, data),
};

// ─── Gamification API ─────────────────────────────────────────────────────────
export const gamificationAPI = {
  getStats: () => api.get('/gamification/stats'),
  getBadges: () => api.get('/gamification/badges'),
  getMyBadges: () => api.get('/gamification/my-badges'),
  getLeaderboard: (limit) => api.get('/gamification/leaderboard', { params: { limit } }),
  getStreak: () => api.get('/gamification/streak'),
};

// ─── Notification API ──────────────────────────────────────────────────────────
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// ─── Mentor API ────────────────────────────────────────────────────────────────
export const mentorAPI = {
  getStudents: () => api.get('/mentor/students'),
  getMentor: () => api.get('/mentor/my-mentor'),
  requestMentor: () => api.post('/mentor/request'),
  getMessages: (assignmentId) => api.get(`/mentor/messages/${assignmentId}`),
  sendMessage: (assignmentId, content) => api.post(`/mentor/messages/${assignmentId}`, { content }),
};

// ─── Placement Test API ────────────────────────────────────────────────────────
export const placementAPI = {
  start: (level) => api.post('/placement/start', {}, { params: { level } }),
  submit: (data) => api.post('/placement/submit', data),
  getResult: () => api.get('/placement/result'),
};

// ─── Learning Path API ─────────────────────────────────────────────────────────
export const learningPathAPI = {
  get: () => api.get('/learning-path'),
  generate: () => api.post('/learning-path/generate'),
  startItem: (itemId) => api.post(`/learning-path/item/${itemId}/start`),
  completeItem: (itemId) => api.post(`/learning-path/item/${itemId}/complete`),
};

// ─── Daily Challenge API ──────────────────────────────────────────────────────
export const dailyAPI = {
  getToday: () => api.get('/daily'),
  getWeek: () => api.get('/daily/week'),
  complete: (data) => api.post('/daily/complete', data),
};

// ─── Certificate API ───────────────────────────────────────────────────────────
export const certificateAPI = {
  getMy: () => api.get('/certificate/my'),
  get: (courseId) => api.get(`/certificate/${courseId}`),
  generate: (courseId) => api.post(`/certificate/${courseId}/generate`),
  download: (courseId) => api.get(`/certificate/${courseId}/download`),
};

// ─── Analytics API ─────────────────────────────────────────────────────────────
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics'),
  getStats: () => api.get('/analytics/stats'),
  getProgress: (days) => api.get('/analytics/progress', { params: { days } }),
  getSkills: () => api.get('/analytics/skills'),
  getVocabAnalytics: () => api.get('/analytics/vocabulary'),
  getActivity: (params) => api.get('/analytics/activity', { params }),
  getLeaderboard: (limit) => api.get('/analytics/leaderboard', { params: { limit } }),
};

// ─── AI Writing API ────────────────────────────────────────────────────────────
export const writingAPI = {
  check: (text) => api.post('/ai/writing-check', { text }),
};

// ─── Agent API ─────────────────────────────────────────────────────────────────
export const agentAPI = {
  scoreAnswer: (data) => api.post('/agent/score', data),
  generateExercises: (data) => api.post('/agent/generate-exercises', data),
  chat: (data) => api.post('/agent/chat', data),
  getGuidance: (userId) => api.get(`/agent/guidance/${userId}`),
};

// ─── Placement Test API ─────────────────────────────────────────────────────────
export const placementTestAPI = {
  start: (level) => api.post('/placement/start', {}, { params: { level } }),
  submit: (data) => api.post('/placement/submit', data),
  getResult: () => api.get('/placement/result'),
};

// ─── Result API ────────────────────────────────────────────────────────────────
export const resultAPI = {
  getMyResults: () => api.get('/exercises/results'),
};

// ─── Admin API ─────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getReports: () => api.get('/admin/reports'),
};

// ─── Chat API ─────────────────────────────────────────────────────────────────
export const chatAPI = {
  send: (receiverId, content) => api.post('/chat/send', { receiverId, content }),
  getConversation: (otherUserId, page, size) =>
    api.get(`/chat/conversation/${otherUserId}`, { params: { page, size } }),
  markAsSeen: (senderId) => api.post(`/chat/conversation/${senderId}/seen`),
  getUnreadCount: () => api.get('/chat/unread-count'),
  getRecentChats: () => api.get('/chat/recent'),
};

// ─── Recommendation API ────────────────────────────────────────────────────────
export const recommendationAPI = {
  get: () => api.get('/recommendations'),
  getWeeklyPlan: () => api.get('/recommendations/weekly-plan'),
};

// ─── Password Reset API ────────────────────────────────────────────────────────
export const passwordResetAPI = {
  request: (email) => api.post('/auth/forgot-password', { email }),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  reset: (email, otp, newPassword) => api.post('/auth/reset-password', { email, otp, newPassword }),
};

// Export retry wrapper
export { retryRequest };

export default api;
