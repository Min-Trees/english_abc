# Phân Tích Chi Tiết Dự Án ABC English

## 1. **AI Integration** 🤖

### Cách Tích Hợp AI:
- **Groq LLM API** được sử dụng (không phải OpenAI)
- Model: **llama-3.1-8b-instant** (mô hình nhẹ, nhanh, chi phí thấp)
- **WebClient** (Spring WebFlux) để gọi REST API

### AIService ([service/AIService.java](../backend/src/main/java/com/abcenglish/service/AIService.java)):
- **chat()** method: Gửi tin nhắn người dùng đến Groq API
- **System Prompt**: "Bạn là một tutor tiếng Anh AI. Giúp người dùng học tiếng Anh bằng cách giải thích ngữ pháp, từ vựng, và hội thoại. Thân thiện, kiên nhẫn, và khuyến khích."
- **Lưu trữ lịch sử chat**: Giữ lại 4 tin nhắn gần nhất trong context
- **Xử lý lỗi**: Kiểm tra API key, xử lý lỗi HTTP (401, 400, etc.)

### AIController ([controller/AIController.java](../backend/src/main/java/com/abcenglish/controller/AIController.java)):
- **POST /api/ai/chat**: Chat với AI tutor
- **GET /api/ai/history**: Lấy lịch sử chat của user
- Endpoints công khai (CORS: *)

### Cấu Hình API:
```properties
# application.properties
groq.api.key=${GROQ_API_KEY:your_groq_api_key_here}
groq.api.model=llama-3.1-8b-instant
```

---

## 2. **Main Features** ✨

Dự án có **6 tính năng chính**, được triển khai qua các Controller sau:

### A. **AI Tutor** (AIController)
- Chat trực tiếp với AI để luyện tập tiếng Anh
- Giải thích ngữ pháp, từ vựng, hội thoại
- Lưu lịch sử cuộc trò chuyện

### B. **Courses** (CourseController) - Lộ trình học có cấu trúc
- `GET /api/courses`: Lấy tất cả khóa học
- `GET /api/courses/featured`: Khóa học nổi bật
- `GET /api/courses/level/{level}`: Khóa học theo cấp độ (A1, A2, B1, B2, C1, C2)
- `GET /api/courses/{id}`: Chi tiết khóa học
- `GET /api/courses/{courseId}/lessons`: Danh sách bài học
- `GET /api/courses/{courseId}/progress`: Tiến độ học tập

### C. **Exercises** (ExerciseController) - Bài tập luyện kỹ năng
- `GET /api/exercises`: Lấy bài tập (filter by type, level)
- `POST /api/exercises/{id}/submit`: Nộp bài tập và nhận điểm
- `GET /api/exercises/results`: Lịch sử kết quả bài tập
- `POST /api/exercises/generate`: Tạo bài tập AI (VOCAB_QUIZ, LISTENING, SPEAKING, etc.)
- Tính XP: `score * 10`
- Feedback: Xuất sắc (8+), Tốt (6-8), Khá (4-6), Cần cố gắng (<4)

### D. **Vocabulary** (VocabularyController) - Xây dựng vốn từ vựng
- `GET /api/vocabulary`: Tất cả từ vựng
- `GET /api/vocabulary?level={level}`: Từ theo cấp độ
- `GET /api/vocabulary?category={category}`: Từ theo chủ đề
- `POST /api/vocabulary`: Thêm từ mới
- `PUT /api/vocabulary/{id}`: Cập nhật từ
- `DELETE /api/vocabulary/{id}`: Xóa từ

### E. **Daily Challenges** (DailyChallengeController) - Thử thách hàng ngày
- `GET /api/daily`: Lấy challenge hôm nay
- `GET /api/daily/week`: Tiến độ hàng tuần
- `POST /api/daily/complete`: Hoàn thành challenge
- `GET /api/daily/generate-week`: Tạo challenges cho tuần
- **Kiếm XP** và **duy trì streak** hàng ngày

### F. **Gamification** (GamificationController) - Hệ thống gamification
- `GET /api/gamification/stats`: Điểm số, level hiện tại, streak
- `GET /api/gamification/badges`: Tất cả huy hiệu
- `GET /api/gamification/my-badges`: Huy hiệu của user
- `GET /api/gamification/leaderboard`: Bảng xếp hạng (top N)
- `GET /api/gamification/streak`: Thống kê streak

### Thêm 7 Features Khác:
- **Test** (TestController): Bài kiểm tra
- **Ranking** (RankingController): Bảng xếp hạng
- **User** (UserController): Quản lý tài khoản
- **Auth** (AuthController): Đăng nhập/Đăng ký
- **Admin** (AdminController): Quản trị hệ thống
- **Agent** (AgentController): Gì đó liên quan đến agent
- **Health** (HealthController): Health check

---

## 3. **Backend Architecture** 🏗️

### Spring Boot Stack:
- **Spring Boot 3.2.5** (Java 17)
- **Spring Web**: REST API
- **Spring Data JPA**: Database ORM
- **Spring Security**: Authentication & Authorization
- **Spring WebFlux**: Async HTTP client (cho Groq API)
- **Spring Actuator**: Monitoring & metrics
- **Spring Mail**: Email service
- **Spring WebSocket**: Real-time communication

### Mô Hình Kiến Trúc: **Controller → Service → Repository → Entity**

```
User Request
    ↓
@RestController (13 controllers)
    ↓
@Service (11 services) - Business Logic
    ↓
Repository (JPA) - Data Access
    ↓
PostgreSQL Database
```

### 13 Controllers:
1. `AIController` - AI Tutor
2. `CourseController` - Khóa học
3. `ExerciseController` - Bài tập
4. `VocabularyController` - Từ vựng
5. `DailyChallengeController` - Thử thách hàng ngày
6. `GamificationController` - Huy hiệu, điểm, leaderboard
7. `TestController` - Bài kiểm tra
8. `RankingController` - Xếp hạng
9. `UserController` - Profile, settings
10. `AuthController` - Login/Register
11. `AdminController` - Admin functions
12. `AgentController` - Agent management
13. `HealthController` - Health check

### 11 Services:
1. `AIService` - Gọi Groq API
2. `CourseService` - Course logic
3. `ExerciseService` - Exercise generation & scoring
4. `VocabularyService` - Vocabulary management
5. `DailyChallengeService` - Daily challenge logic
6. `GamificationService` - Points, badges, leaderboard
7. `TestService` - Test management
8. `RankingService` - Ranking logic
9. `UserService` - User management
10. `AuthService` - Authentication
11. `JwtService` - JWT token handling

---

## 4. **Database & Entities** 🗄️

### Database: **PostgreSQL** (không phải MySQL)
- Host: `${DB_URL:jdbc:postgresql://localhost:5432/abcenglish}`
- Driver: `org.postgresql.Driver`
- JPA Dialect: `PostgreSQLDialect`
- DDL Auto: `update` (tự động update schema)

### 15 Entities (JPA):

| Entity | Mục đích |
|--------|---------|
| `User` | Người dùng (username, email, password, role, level) |
| `Course` | Khóa học (title, level, instructor, lessons, rating) |
| `Lesson` | Bài học trong khóa |
| `Exercise` | Bài tập luyện (type, level, questions) |
| `ExerciseQuestion` | Câu hỏi trong bài tập |
| `QuizResult` | Kết quả làm bài (score, correctAnswers, totalQuestions) |
| `VocabularyWord` | Từ vựng (word, definition, example, level, category) |
| `DailyChallenge` | Thử thách hàng ngày |
| `UserChallenge` | Tiến độ user với challenge |
| `AIChatHistory` | Lịch sử chat AI |
| `Test` | Bài kiểm tra |
| `TestResult` | Kết quả kiểm tra |
| `TestSession` | Phiên làm bài |
| `UserProgress` | Tiến độ học tập của user |
| `UserBadge` | Huy hiệu user nhận được |

### Schema Tự Động Tạo:
```
users (id, username, email, password, role, level, fullName, ageGroup, avatarUrl, enabled, createdAt, updatedAt)
courses (id, title, description, level, instructor, totalLessons, rating, ...)
lessons (id, courseId, title, content, ...)
exercises (id, title, level, type, questions, ...)
quiz_results (id, userId, exerciseId, score, correctAnswers, ...)
vocabulary_words (id, word, definition, example, level, category, ...)
daily_challenges (id, title, description, xpReward, ...)
ai_chat_histories (id, userId, userMessage, aiResponse, createdAt)
user_badges (id, userId, badgeId, acquiredAt)
...
```

---

## 5. **Frontend Technologies** 💻

### Framework & Libraries:
- **React 18.2.0** - UI Library
- **React Router DOM 6.22.0** - Routing
- **@tanstack/react-query 5.100.8** - Data fetching & caching (thay thế Redux)
- **axios 1.6.7** - HTTP client
- **recharts 3.8.1** - Charts & data visualization
- **react-toastify 11.1.0** - Toast notifications
- **lucide-react 1.14.0** - Icon library

### Cấu Trúc Frontend:
```
frontend/src/
├── api/
│   └── api.js - API calls (axios)
├── components/
│   ├── InteractiveSubtitle.jsx
│   ├── Navbar.js
│   ├── NotificationBell.js
│   └── Sidebar.js
├── context/
│   └── AuthContext.js - Auth state
├── hooks/
│   ├── useApiError.jsx - Error handling
│   └── useReactQuery.jsx - Custom React Query hooks
├── pages/ (20 pages)
│   ├── DashboardPage.js
│   ├── CoursesPage.js
│   ├── ExercisesPage.js
│   ├── VocabularyPage.js
│   ├── DailyChallengeP age.jsx
│   ├── ListeningPage.js
│   ├── SpeakingPage.js
│   ├── GamificationPage.js
│   ├── ForumPage.js
│   ├── LearningAnalyticsPage.js
│   ├── LearningPathPage.js
│   ├── PlacementTestPage.js
│   ├── CourseDetailPage.js
│   ├── CertificatesPage.js
│   ├── ExamResultsPage.js
│   ├── MentorPage.js
│   ├── RecommendationPage.js
│   ├── ProgressPage.js
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── ForgotPasswordPage.js
│   ├── AdminDashboardPage.js
│   ├── TeacherDashboardPage.js
│   └── AgentPage.js
├── App.js
├── index.js
├── App.css
└── index.css
```

### 20+ Pages:
- **Authentication**: Login, Register, ForgotPassword
- **Learning**: Dashboard, Courses, Exercises, Vocabulary, DailyChallenge, LearningPath
- **Skills**: Listening, Speaking
- **Progress**: ExamResults, Progress, LearningAnalytics
- **Social**: Forum, Mentor
- **Gamification**: Gamification (badges, streaks, leaderboard)
- **Admin**: AdminDashboard, TeacherDashboard
- **Other**: Recommendations, Certificates, CourseDetail, PlacementTest, Agent

### React Query Usage:
- Data fetching & caching
- Automatic refetching
- Optimistic updates
- Error handling via `useApiError` hook

### Styling:
- CSS modules (App.css, index.css)
- Lucide React icons
- Responsive design

---

## 6. **Security & Authentication** 🔐

### JWT Token-Based Authentication:
- **Library**: `jjwt 0.12.5` (io.jsonwebtoken)
- **Components**: 
  - `jjwt-api` - JWT API
  - `jjwt-impl` - Implementation
  - `jjwt-jackson` - JSON support

### JwtService ([service/JwtService.java](../backend/src/main/java/com/abcenglish/service/JwtService.java)):
- `generateToken()` - Tạo JWT
- `extractUsername()` - Lấy username từ token
- `extractUserId()` - Lấy user ID từ token
- `isTokenValid()` - Kiểm tra token còn hạn
- Token expiration: **86400000ms (24 giờ)**

### Spring Security:
- **BCryptPasswordEncoder** - Mã hóa mật khẩu
- **UserDetailsService** - Load user details
- **JwtAuthenticationFilter** - Filter JWT token
- **SecurityFilterChain** - Security configuration

### JwtAuthenticationFilter ([security/JwtAuthenticationFilter.java](../backend/src/main/java/com/abcenglish/security/JwtAuthenticationFilter.java)):
- Kiểm tra header `Authorization: Bearer {token}`
- Validate token và extract username
- Set Spring Security context

### Configuration ([config/ApplicationConfig.java](../backend/src/main/java/com/abcenglish/config/ApplicationConfig.java)):
- **CORS**: Cho phép localhost:3000, localhost:3001
- **CSRF**: Disable (vì sử dụng JWT)
- **Endpoints**: Tất cả allow (xác thực qua JWT)
- Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
- Headers: Authorization, Content-Type, Accept, Origin, etc.

### Credentials Qua Environment Variables:
```env
JWT_SECRET=abcEnglishSecretKey2024VeryLongAndSecureKeyForJWTSigning
GROQ_API_KEY=your_groq_api_key_here
DB_USERNAME=postgres
DB_PASSWORD=password
MAIL_USERNAME=noreply@example.com
MAIL_PASSWORD=your_app_password
```

### User Roles & Permissions:
```java
public enum Role { STUDENT, TEACHER, ADMIN }
public enum Level { A1, A2, B1, B2, C1, C2 }
public enum AgeGroup { KID, TEEN, ADULT }
```

---

## 7. **Deployment** 🚀

### Docker & Docker Compose Setup:

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    container_name: abc-english-frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://localhost:8080/api
    networks:
      - abc-network

  backend:
    build: ./backend
    container_name: abc-english-backend
    ports:
      - "8080:8080"
    env_file:
      - backend/.env
    networks:
      - abc-network

networks:
  abc-network:
    driver: bridge
```

### Dockerfile (Frontend):
- **Base Image**: Node/nginx
- **Build**: `npm install && npm run build`
- **Serve**: nginx.conf trên port 80
- **Port**: 3000:80

### Dockerfile (Backend):
- **Base Image**: Java 17
- **Build**: `mvn clean package`
- **Run**: Spring Boot jar
- **Port**: 8080:8080

### URLs Sau Deploy:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080/api`
- **Health Check**: `http://localhost:8080/api/health`

### Environment Setup:
1. Backend `.env` file:
   ```
   DB_URL=jdbc:postgresql://postgres:5432/abcenglish
   DB_USERNAME=postgres
   DB_PASSWORD=password
   GROQ_API_KEY=your_groq_api_key_here
   JWT_SECRET=your_jwt_secret_key
   MAIL_HOST=smtp.gmail.com
   ```

2. Frontend `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:8080/api
   ```

### Quick Start:
```powershell
# Using PowerShell script
./run.ps1 setup      # First time setup
./run.ps1 start      # Start the app

# Or manual
cd frontend && npm install && npm start
cd backend && mvn spring-boot:run
```

---

## Summary Table 📊

| Aspect | Technology/Details |
|--------|------------------|
| **Frontend** | React 18.2 + React Query + Axios |
| **Backend** | Spring Boot 3.2.5 (Java 17) |
| **Database** | PostgreSQL |
| **AI** | Groq LLM (llama-3.1-8b-instant) |
| **Auth** | JWT (jjwt 0.12.5) + Spring Security |
| **Architecture** | MVC (Controller-Service-Repository) |
| **Deployment** | Docker + Docker Compose |
| **Controllers** | 13 (AI, Course, Exercise, Vocabulary, DailyChallenge, Gamification, Test, Ranking, User, Auth, Admin, Agent, Health) |
| **Services** | 11 (AI, Course, Exercise, Vocabulary, DailyChallenge, Gamification, Test, Ranking, User, Auth, Jwt) |
| **Entities** | 15 (User, Course, Lesson, Exercise, VocabularyWord, DailyChallenge, etc.) |
| **Pages** | 20+ (Dashboard, Courses, Exercises, Vocabulary, Forum, Gamification, etc.) |

---

## Key Features Recap 🎯

✅ **AI English Tutor** - Chat với AI để học tiếng Anh  
✅ **Structured Courses** - Khóa học theo cấp độ (A1-C2)  
✅ **Exercises** - Bài tập luyện kỹ năng  
✅ **Vocabulary Builder** - Học từ vựng với flashcards  
✅ **Daily Challenges** - Thử thách hàng ngày để duy trì streak  
✅ **Gamification** - Badges, points, leaderboard  
✅ **Progress Tracking** - Theo dõi tiến độ học tập  
✅ **Forum/Community** - Diễn đàn giao lưu (ForumPage)  
✅ **Learning Analytics** - Phân tích hiệu suất học  
✅ **Multiple Skills** - Listening, Speaking, Reading, Writing  
✅ **Recommendations** - Gợi ý bài học theo năng lực  
✅ **Certificates** - Cấp chứng chỉ hoàn thành  

