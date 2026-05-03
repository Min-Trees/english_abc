# ABC English - English Learning Platform

An English learning platform built with React (frontend) and Spring Boot (backend), featuring AI-powered tutoring, vocabulary building, daily challenges, and gamification.

## Features

- **AI Tutor** - Chat with AI to practice English
- **Vocabulary** - Build your vocabulary with flashcards and quizzes
- **Daily Challenges** - Earn XP and maintain streaks
- **Courses** - Structured learning paths for all levels
- **Gamification** - Earn badges, climb leaderboards
- **Dashboard** - Track your progress and learning analytics

## Prerequisites

Before running this project, make sure you have:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Java** 17+ ([Download](https://adoptium.net/))
- **Maven** 3.8+ ([Download](https://maven.apache.org/))

## Quick Start

### Option 1: Using the setup script (Recommended)

```powershell
# Run the project
.\run.ps1 start

# Or first setup environment and install dependencies
.\run.ps1 setup
```

### Option 2: Manual Setup

#### 1. Clone and Install Frontend Dependencies

```bash
cd frontend
npm install
```

#### 2. Start Backend

```bash
cd backend
mvn spring-boot:run
```

#### 3. Start Frontend (in another terminal)

```bash
cd frontend
npm start
```

## Access the Application

After starting, open your browser:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/api/health

## Project Structure

```
abc-english/
├── frontend/              # React application
│   ├── src/
│   │   ├── api/          # API calls
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context (Auth)
│   │   ├── hooks/        # Custom hooks
│   │   └── pages/        # Page components
│   └── package.json
│
├── backend/               # Spring Boot application
│   ├── src/main/java/
│   │   └── com/abcenglish/
│   │       ├── config/   # Configuration classes
│   │       ├── controller/# REST controllers
│   │       ├── dto/      # Data transfer objects
│   │       ├── entity/   # JPA entities
│   │       ├── repository/# Data repositories
│   │       └── service/  # Business logic
│   └── pom.xml
│
├── docker-compose.yml     # Docker configuration
└── run.ps1               # Quick start script
```

## Environment Variables

The project uses environment variables for sensitive configuration. Create your own `.env` files based on the examples.

### Frontend (.env)

Create `frontend/.env` (already created if you ran setup):

```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WS_URL=http://localhost:8080
```

### Backend (.env)

Create `backend/.env` (already created if you ran setup):

```
# Groq API Key (get from https://console.groq.com)
GROQ_API_KEY=your_groq_api_key_here

# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/abcenglish
DB_USERNAME=postgres
DB_PASSWORD=your_password_here

# JWT Secret
JWT_SECRET=your_secure_jwt_secret
```

> Note: The `.env` files are ignored by git and will not be pushed to GitHub.

## Docker Deployment

### Build and Run with Docker Compose

```bash
docker-compose up --build
```

This will start:
- Frontend on port 3000 (nginx)
- Backend on port 8080

## Troubleshooting

### CORS Errors

If you see CORS errors, make sure:
1. Backend is running on port 8080
2. Frontend is configured to connect to `http://localhost:8080`
3. CORS is enabled in `ApplicationConfig.java`

### Port Already in Use

```powershell
# Find and kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <pid> /F

# Find and kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <pid> /F
```

### Backend Won't Start

1. Check Java version: `java -version` (needs 17+)
2. Check Maven: `mvn --version`
3. Verify database connection in application.properties

### Frontend Won't Start

1. Delete `node_modules` and reinstall:
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   ```

## Default Test Accounts

The system creates sample users on startup:
- Admin: admin@abc.com / admin123
- Teacher: teacher@abc.com / teacher123
- Student: student@abc.com / student123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get course details
- `GET /api/courses/{id}/lessons` - Get course lessons

### Vocabulary
- `GET /api/vocabulary` - Get vocabulary words
- `GET /api/vocabulary?level=BEGINNER` - Filter by level

### Daily Challenge
- `GET /api/daily` - Get today's challenge
- `GET /api/daily/week` - Get weekly progress
- `POST /api/daily/complete` - Complete challenge

### Exercises
- `GET /api/exercises` - Get all exercises
- `GET /api/exercises/{id}` - Get exercise details
- `POST /api/exercises/{id}/submit` - Submit answers
- `GET /api/exercises/results` - Get user's results

### AI Agent
- `POST /api/agent/chat` - Chat with AI
- `POST /api/agent/score` - Score an answer
- `GET /api/agent/guidance/{userId}` - Get AI guidance

### Gamification
- `GET /api/gamification/stats` - Get user stats
- `GET /api/gamification/badges` - Get all badges
- `GET /api/gamification/leaderboard` - Get leaderboard

### Admin
- `GET /api/admin/stats` - Get system stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}/role` - Update user role

## License

MIT License
