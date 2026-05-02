# ABC ENGLISH - Hệ thống Học tiếng Anh Trực tuyến

**Phiên bản:** 1.0  
**Ngày cập nhật:** May 3, 2026  
**Trạng thái:** Production Ready

---

## Giới thiệu nhanh

ABC English là nền tảng học tiếng Anh trực tuyến tích hợp công nghệ AI, cung cấp trải nghiệm học tập cá nhân hóa từ cơ bản (A1) đến nâng cao (C2). Hệ thống sử dụng Groq LLM để chấm điểm tự động, sinh bài tập, và hỗ trợ học viên thông qua chatbot AI.

---

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|-----------|----------|
| **Backend** | Spring Boot 3, Spring Security, Spring Data JPA, JWT |
| **Frontend** | React.js, React Query, Material-UI |
| **Database** | MySQL 8.0, Redis |
| **AI/LLM** | Groq API (LLaMA 3) |
| **DevOps** | Docker, Docker Compose, Nginx |
| **Testing** | JUnit 5, Mockito, Jest |

---

## Tính năng chính

### 1. Quản lý khóa học
- Khóa học có cấu trúc (Chapters → Lessons)
- Theo dõi tiến độ học tập
- Cấp chứng chỉ khi hoàn thành
- Tự động cập nhật XP

### 2. Bài tập & Chấm điểm AI
- 6 loại bài tập: Multiple Choice, Fill-in-blank, Writing, Speaking, Reading, Listening
- Tự động chấm điểm bằng Groq LLM với feedback chi tiết
- Lưu trữ kết quả toàn bộ và theo dõi tiến độ

### 3. Gamification
- Hệ thống XP & Level (A1-C2)
- Daily Challenges với 6 loại thử thách
- Streak tracking (chuỗi học liên tục)
- Badge system (huy hiệu thành tựu)
- Leaderboard

### 4. Từ vựng & Spaced Repetition
- 50,000+ từ vựng được phân loại theo level/category
- SM-2 Spaced Repetition Algorithm để tối ưu hóa học tập
- Quizzes tương tác với audio/hình ảnh

### 5. Cộng đồng & Forum
- Forum với các category (Grammar, Vocabulary, Speaking, etc.)
- Mentor support & coaching
- Direct messaging giữa mentor-student
- Accepted answer & pinned posts

### 6. Analytics & Personalization
- Phân tích chi tiết skill scores (Writing, Speaking, Reading, Listening, Grammar, Vocabulary)
- Học liệu được gợi ý dựa trên điểm yếu
- Theo dõi study time & trends

### 7. Xác thực & Bảo mật
- JWT-based authentication
- OAuth (Google, Facebook)
- Placement test để xác định trình độ ban đầu
- Role-based access control (STUDENT, TEACHER, ADMIN, MENTOR)

---

## Cấu trúc dự án

```
abc-english/
├── backend/                   # Spring Boot application
│   ├── src/main/java/com/abcenglish/
│   │   ├── controller/        # REST API endpoints
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Data access layer
│   │   ├── entity/            # JPA entities
│   │   ├── dto/               # Data transfer objects
│   │   ├── config/            # Configuration
│   │   ├── security/          # Security config
│   │   └── util/              # Utilities
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql           # Initial data
│   └── pom.xml
│
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React context
│   │   ├── hooks/             # Custom hooks
│   │   ├── api/               # API client
│   │   └── App.js
│   ├── public/
│   └── package.json
│
├── docs/                      # Documentation
│   ├── DacTa_HeThong.md       # System specification (Vietnamese)
│   ├── ClassDiagram.puml      # UML class diagram
│   ├── EntityDiagram.puml     # ER diagram
│   ├── ActivityDiagram.puml   # Activity diagrams
│   └── SequenceDiagram.puml   # Sequence diagrams
│
├── docker-compose.yml         # Docker services configuration
├── nginx.conf                 # Nginx reverse proxy config
├── run.ps1                    # PowerShell startup script
├── remove_emojis.ps1          # Emoji removal script
├── SETUP_GUIDE.md             # Installation & setup guide
├── README.md                  # This file
└── Dockerfile                 # Docker image definition
```

---

## Bắt đầu nhanh (Quick Start)

### Yêu cầu tối thiểu
- JDK 17+
- Node.js 16+
- Docker & Docker Compose
- MySQL 8.0+ (hoặc dùng Docker)

### Cài đặt & chạy hệ thống

```bash
# 1. Clone repository
cd d:\Job\DNM\abc-english

# 2. Chạy toàn bộ hệ thống qua Docker Compose
docker-compose up -d

# 3. Truy cập hệ thống
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
# Swagger UI: http://localhost:8080/api/swagger-ui.html
# MySQL: localhost:3306 (user: abc_user, password: user_password)
```

**Chi tiết hơn:** Xem [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## API Endpoints

### Authentication (Xác thực)
```
POST   /api/auth/register              - Đăng ký tài khoản
POST   /api/auth/login                 - Đăng nhập
POST   /api/auth/placement-test        - Làm bài kiểm tra phân loại
GET    /api/auth/profile               - Xem hồ sơ cá nhân
```

### Courses (Khóa học)
```
GET    /api/courses                    - Danh sách khóa học
GET    /api/courses/{id}               - Chi tiết khóa học
POST   /api/courses/{id}/enroll        - Đăng ký khóa học
GET    /api/lessons/{id}               - Chi tiết bài học
POST   /api/lessons/{id}/complete      - Hoàn thành bài học
```

### Exercises (Bài tập)
```
GET    /api/exercises                  - Danh sách bài tập
GET    /api/exercises/{id}             - Chi tiết bài tập
POST   /api/exercises/{id}/submit      - Nộp bài tập
GET    /api/exercises/results/my       - Kết quả bài tập của tôi
```

### AI Agent (Trí tuệ nhân tạo)
```
POST   /api/agent/score                - Chấm điểm bài viết/nói
POST   /api/agent/generate             - Sinh bài tập tự động
POST   /api/agent/chat                 - Chat với AI tutor
GET    /api/agent/guidance             - Nhận hướng dẫn học tập
```

### Vocabulary (Từ vựng)
```
GET    /api/vocabulary/words           - Danh sách từ vựng
GET    /api/vocabulary/words-to-review - Từ cần ôn tập
POST   /api/vocabulary/review          - Làm quiz từ vựng
```

### Gamification (Trò chơi)
```
GET    /api/daily-challenges/today     - Thử thách hôm nay
POST   /api/daily-challenges/{id}/progress - Cập nhật tiến độ
POST   /api/daily-challenges/{id}/claim    - Yêu cầu XP
GET    /api/user/stats                 - Thống kê cá nhân
GET    /api/leaderboard                - Bảng xếp hạng
GET    /api/badges                     - Huy hiệu
```

### Forum (Diễn đàn)
```
GET    /api/forum/posts                - Danh sách bài viết
POST   /api/forum/posts                - Tạo bài viết
POST   /api/forum/posts/{id}/comments  - Bình luận
GET    /api/forum/posts/{id}/comments  - Xem bình luận
```

### Admin (Quản trị)
```
GET    /api/admin/users                - Danh sách users
PATCH  /api/admin/users/{id}/role      - Thay đổi role
PATCH  /api/admin/users/{id}/level     - Thay đổi level
GET    /api/admin/analytics            - Thống kê hệ thống
```

---

## Database Schema

22 bảng chính:
- **users** - Thông tin người dùng
- **user_stats** - Thống kê cá nhân
- **courses** - Khóa học
- **lessons** - Bài học
- **exercises** - Bài tập
- **exercise_results** - Kết quả bài tập
- **vocabulary_words** - Từ vựng
- **user_vocabulary_progress** - Tiến độ từ vựng (SM-2)
- **daily_challenges** - Thử thách hàng ngày
- **user_daily_progress** - Tiến độ thử thách
- **badges** - Huy hiệu
- **user_badges** - Huy hiệu của user
- **forum_posts** - Bài viết forum
- **forum_comments** - Bình luận forum
- **chat_messages** - Tin nhắn chat
- **mentor_assignments** - Gán mentor
- **mentor_messages** - Tin nhắn mentor
- **notifications** - Thông báo
- **certificates** - Chứng chỉ
- **placement_tests** - Bài kiểm tra phân loại
- **social_accounts** - Tài khoản OAuth
- v.v.

Xem chi tiết: [EntityDiagram.puml](docs/EntityDiagram.puml)

---

## Kiểm tra hệ thống

### 1. Xác nhận Backend chạy
```bash
curl http://localhost:8080/api/health
```

### 2. Xác nhận Frontend chạy
```bash
# Mở browser: http://localhost:3000
```

### 3. Xác nhận Database
```bash
mysql -h localhost -u abc_user -p abc_english
# password: user_password
SHOW TABLES;
```

### 4. Xem logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

---

## Troubleshooting

### Lỗi: Port already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Lỗi: Docker daemon not running
```bash
# Windows: Mở Docker Desktop
# Linux: sudo systemctl start docker
```

### Lỗi: Database connection refused
```bash
# Kiểm tra MySQL container
docker ps | grep mysql

# Khởi động lại MySQL
docker-compose restart mysql
```

### Lỗi: Groq API key invalid
```bash
# Cập nhật .env file
echo "GROQ_API_KEY=your_new_key" > .env

# Khởi động lại backend
docker-compose restart backend
```

Xem chi tiết: [SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting)

---

## Tài liệu

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Hướng dẫn cài đặt chi tiết
- **[DacTa_HeThong.md](docs/DacTa_HeThong.md)** - Đặc tả hệ thống (tiếng Việt)
- **[ClassDiagram.puml](docs/ClassDiagram.puml)** - Biểu đồ lớp UML
- **[EntityDiagram.puml](docs/EntityDiagram.puml)** - Biểu đồ ER
- **[ActivityDiagram.puml](docs/ActivityDiagram.puml)** - Biểu đồ hoạt động
- **[SequenceDiagram.puml](docs/SequenceDiagram.puml)** - Biểu đồ tuần tự

---

## Các use case chính

| # | Tên chức năng | Actor | Mô tả |
|---|--|--|--|
| UC01 | Đăng ký tài khoản | Guest | Đăng ký với username, email, password |
| UC02 | Đăng nhập | Guest | Đăng nhập bằng username/password |
| UC04 | Xem danh sách khóa học | All | Xem courses theo level |
| UC08 | Đăng ký khóa học | STUDENT | Enroll course, tạo LessonProgress |
| UC16 | Xem bài tập | All | Xem exercises theo filter |
| UC18 | Làm bài tập | STUDENT | Submit exercise, chấm điểm AI |
| UC32 | Xem thử thách hôm nay | STUDENT | Xem DailyChallenge |
| UC33 | Làm thử thách | STUDENT | Hoàn thành challenge, nhận XP |
| UC25 | Học từ vựng | STUDENT | Quiz từ vựng, SM-2 algorithm |
| UC44 | Chat với AI | STUDENT | Hỏi đáp ngữ pháp, từ vựng |
| UC54 | Xem forum | All | Xem ForumPosts theo category |
| UC55 | Tạo bài viết | STUDENT | Tạo ForumPost mới |
| UC71 | Quản trị users | ADMIN | CRUD users, thay đổi role/level |

**Tổng cộng:** 80 use cases, phân theo 13 modules

---

## Hiệu suất & Tối ưu

- **Caching:** Redis cache cho frequently accessed data
- **Database:** Indexing trên key columns (user_id, level, category, etc.)
- **Frontend:** React Query cho caching client-side, lazy loading
- **Backend:** Connection pooling, async processing
- **API:** Pagination, filtering, sorting built-in
- **Media:** Image compression, lazy loading

---

## Bảo mật

- **Authentication:** JWT token với 24h expiration
- **Authorization:** Role-based access control (RBAC)
- **Encryption:** BCrypt password hashing
- **API:** CORS, rate limiting, input validation
- **Database:** Parameterized queries, SQL injection prevention
- **Secrets:** Environment variables cho sensitive keys

---

## Deployment

### Docker Compose (Development/Staging)
```bash
docker-compose up -d
```

### Kubernetes (Production)
```bash
kubectl apply -f k8s/deployment.yaml
```

### Cloud (AWS/Azure/GCP)
```bash
# Build & push images
docker build -t registry/abc-english/backend:latest ./backend
docker push registry/abc-english/backend:latest
```

---

## Support & Liên hệ

- **Email:** support@abc-english.com
- **GitHub Issues:** https://github.com/your-org/abc-english/issues
- **Documentation:** [Full Documentation](docs/)

---

## License

This project is licensed under the MIT License.

---

## Contributors

- **Development Team:** ABC English Dev
- **Last Updated:** May 3, 2026
- **Version:** 1.0.0

---

## Changelog

### v1.0 (May 3, 2026)
- Initial release
- 22 entities, 80 use cases
- Groq LLM integration
- Spaced Repetition algorithm
- Gamification system
- Forum & Mentor support
- Admin dashboard

---

**Trạng thái:** Sẵn sàng cho production / Ready for Production
