# ABC ENGLISH - Hướng dẫn cài đặt hệ thống

## Yêu cầu hệ thống (System Requirements)

### Phần cứng (Hardware)
- **CPU:** Intel Core i5+ hoặc tương đương
- **RAM:** Tối thiểu 8GB (khuyến nghị 16GB)
- **Disk:** Tối thiểu 10GB dung lượng trống
- **OS:** Windows 10+, macOS 10.15+, hoặc Linux Ubuntu 18.04+

### Phần mềm bắt buộc (Required Software)
- **Java Development Kit (JDK):** Phiên bản 17 trở lên
- **Node.js & npm:** Phiên bản 16.0+ trở lên
- **Docker & Docker Compose:** Phiên bản mới nhất
- **Git:** Phiên bản 2.30+ trở lên
- **MySQL:** Phiên bản 8.0+ (hoặc dùng Docker)

---

## Bước 1: Chuẩn bị môi trường (Environment Setup)

### 1.1. Cài đặt Java JDK 17+

**Trên Windows:**
```powershell
# Cách 1: Dùng Chocolatey (nếu có)
choco install openjdk17

# Cách 2: Download manual từ
# https://www.oracle.com/java/technologies/downloads/#java17
# Sau đó add vào PATH
```

**Kiểm tra Java đã cài:**
```bash
java -version
# Kết quả: openjdk version "17.x.x" (hoặc cao hơn)
```

### 1.2. Cài đặt Node.js & npm

**Trên Windows:**
```powershell
# Dùng Chocolatey
choco install nodejs

# Hoặc download từ: https://nodejs.org/en/
```

**Kiểm tra Node.js đã cài:**
```bash
node --version
npm --version
# Kết quả: v16+ hoặc cao hơn
```

### 1.3. Cài đặt Docker & Docker Compose

**Trên Windows:**
```powershell
# Download Docker Desktop từ:
# https://www.docker.com/products/docker-desktop

# Sau cài đặt, kiểm tra:
docker --version
docker-compose --version
```

**Khởi động Docker:**
```bash
# Windows: Mở Docker Desktop từ Start Menu
# macOS/Linux: Khởi động Docker daemon
sudo systemctl start docker  # Linux
```

### 1.4. Cài đặt Git

```bash
# Windows: Download từ https://git-scm.com/

# Kiểm tra:
git --version
```

---

## Bước 2: Clone Repository

```bash
# Clone source code
cd D:\Job\DNM\
git clone https://github.com/your-org/abc-english.git
# hoặc nếu đã có thư mục, chỉ cần:
cd abc-english

# Kiểm tra cấu trúc
ls -la
# backend/
# frontend/
# docker-compose.yml
# run.ps1
# docs/
```

---

## Bước 3: Cài đặt Backend (Spring Boot)

### 3.1. Cấu hình môi trường

**Tệp:** `backend/src/main/resources/application.properties`

```properties
# ============= Server Configuration =============
server.port=8080
server.servlet.context-path=/api

# ============= Database Configuration =============
spring.datasource.url=jdbc:mysql://localhost:3306/abc_english?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ============= JPA Configuration =============
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# ============= JWT Configuration =============
app.jwtSecret=your_secret_key_here_at_least_32_characters_long
app.jwtExpirationMs=86400000

# ============= Groq AI Configuration =============
groq.api.key=your_groq_api_key_here
groq.api.model=llama3-8b-8192

# ============= Email Configuration =============
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# ============= Logging =============
logging.level.root=INFO
logging.level.com.abcenglish=DEBUG
```

### 3.2. Tải dependencies & build Backend

```bash
cd backend

# Tải dependencies Maven
mvn clean install

# Hoặc sử dụng Maven wrapper
./mvnw clean install  # macOS/Linux
mvnw.cmd clean install  # Windows

# Chờ process hoàn thành (có thể mất 5-10 phút)
```

### 3.3. Chạy Backend

```bash
# Cách 1: Chạy trực tiếp
mvn spring-boot:run

# Cách 2: Chạy file JAR đã build
java -jar target/abc-english-1.0.jar

# Cách 3: Chạy trên Docker (sẽ thực hiện ở Bước 5)
```

**Xác nhận Backend chạy:**
```bash
# Mở terminal khác, kiểm tra
curl http://localhost:8080/api/health
# Hoặc truy cập: http://localhost:8080/api/swagger-ui.html
```

---

## Bước 4: Cài đặt Frontend (React)

### 4.1. Cấu hình môi trường

**Tệp:** `frontend/.env.local` (tạo mới)

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WEBSOCKET_URL=ws://localhost:8080/ws
REACT_APP_APP_NAME=ABC English
```

### 4.2. Tải dependencies & cài đặt

```bash
cd frontend

# Tải npm dependencies
npm install

# Chờ hoàn thành (có thể mất 5-10 phút)
```

### 4.3. Chạy Frontend (Development)

```bash
# Chạy development server
npm start

# Frontend sẽ tự động mở tại:
# http://localhost:3000

# Hoặc build production
npm run build
# Output: frontend/build/
```

---

## Bước 5: Cài đặt Database (MySQL)

### 5.1. Chạy MySQL qua Docker (Khuyến nghị)

```bash
# Tạo network Docker
docker network create abc-english-network

# Chạy MySQL container
docker run --name abc-mysql \
  --network abc-english-network \
  -e MYSQL_ROOT_PASSWORD=root_password \
  -e MYSQL_DATABASE=abc_english \
  -e MYSQL_USER=abc_user \
  -e MYSQL_PASSWORD=user_password \
  -p 3306:3306 \
  -v abc-mysql-data:/var/lib/mysql \
  mysql:8.0

# Hoặc dùng docker-compose.yml (xem bước 6)
```

### 5.2. Cài đặt MySQL cục bộ (Alternative)

**Trên Windows:**
```powershell
# Cách 1: Dùng Chocolatey
choco install mysql

# Cách 2: Download installer từ
# https://dev.mysql.com/downloads/mysql/
```

### 5.3. Khởi tạo Database

```bash
# Kết nối MySQL
mysql -u root -p
# Nhập password khi được yêu cầu

# Hoặc dùng MySQL Workbench / DBeaver GUI
```

**SQL Script:**
```sql
-- Tạo database
CREATE DATABASE IF NOT EXISTS abc_english;

-- Tạo user
CREATE USER IF NOT EXISTS 'abc_user'@'localhost' IDENTIFIED BY 'abc_password';

-- Cấp quyền
GRANT ALL PRIVILEGES ON abc_english.* TO 'abc_user'@'localhost';
FLUSH PRIVILEGES;

-- Kiểm tra
SHOW DATABASES;
USE abc_english;
SHOW TABLES;
```

---

## Bước 6: Chạy hệ thống toàn bộ với Docker Compose

### 6.1. Cấu hình docker-compose.yml

**File:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: abc-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: abc_english
      MYSQL_USER: abc_user
      MYSQL_PASSWORD: user_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - abc-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: abc-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/abc_english?useSSL=false&serverTimezone=UTC
      SPRING_DATASOURCE_USERNAME: abc_user
      SPRING_DATASOURCE_PASSWORD: user_password
      GROQ_API_KEY: ${GROQ_API_KEY}
    ports:
      - "8080:8080"
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - abc-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: abc-frontend
    environment:
      REACT_APP_API_URL: http://backend:8080/api
      REACT_APP_WEBSOCKET_URL: ws://backend:8080/ws
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - abc-network

  nginx:
    image: nginx:alpine
    container_name: abc-nginx
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend
    networks:
      - abc-network

volumes:
  mysql_data:

networks:
  abc-network:
    driver: bridge
```

### 6.2. Chạy toàn bộ hệ thống

```bash
# Từ thư mục gốc của project
cd D:\Job\DNM\abc-english

# Chuẩn bị environment variables
# Tạo file .env
echo "GROQ_API_KEY=your_groq_api_key_here" > .env

# Khởi động tất cả services
docker-compose up -d

# Kiểm tra status
docker-compose ps

# Xem logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Dừng hệ thống
docker-compose down

# Dừng và xóa volumes
docker-compose down -v
```

---

## Bước 7: Chạy qua PowerShell Script (Windows)

**File:** `run.ps1`

```powershell
#!/usr/bin/env pwsh

param(
    [string]$command = "up",
    [string]$service = "all"
)

$projectRoot = Get-Location

function Start-System {
    Write-Host "Starting ABC English System..." -ForegroundColor Green
    
    # Kiểm tra Docker
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Host "Docker not found! Please install Docker Desktop." -ForegroundColor Red
        exit 1
    }
    
    # Kiểm tra docker-compose
    docker-compose --version
    
    # Start containers
    docker-compose up -d
    
    Write-Host "System started successfully!" -ForegroundColor Green
    Write-Host "Access at:" -ForegroundColor Cyan
    Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Yellow
    Write-Host "  Backend:  http://localhost:8080/api" -ForegroundColor Yellow
    Write-Host "  MySQL:    localhost:3306" -ForegroundColor Yellow
}

function Stop-System {
    Write-Host "Stopping ABC English System..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "System stopped!" -ForegroundColor Green
}

function View-Logs {
    param([string]$svc = "all")
    
    if ($svc -eq "all") {
        docker-compose logs -f
    } else {
        docker-compose logs -f $svc
    }
}

function Clean-System {
    Write-Host "Cleaning up all containers and volumes..." -ForegroundColor Red
    docker-compose down -v
    Write-Host "Cleanup complete!" -ForegroundColor Green
}

# Execute command
switch ($command) {
    "up" { Start-System }
    "down" { Stop-System }
    "logs" { View-Logs -svc $service }
    "clean" { Clean-System }
    default {
        Write-Host "Usage: ./run.ps1 [up|down|logs|clean] [service]" -ForegroundColor Cyan
        Write-Host "Examples:" -ForegroundColor Green
        Write-Host "  ./run.ps1 up              # Start system" -ForegroundColor Yellow
        Write-Host "  ./run.ps1 down            # Stop system" -ForegroundColor Yellow
        Write-Host "  ./run.ps1 logs backend    # View backend logs" -ForegroundColor Yellow
        Write-Host "  ./run.ps1 clean           # Clean up everything" -ForegroundColor Yellow
    }
}
```

**Chạy script:**
```powershell
# Cấp quyền chạy script
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Khởi động hệ thống
.\run.ps1 up

# Xem logs
.\run.ps1 logs backend

# Dừng hệ thống
.\run.ps1 down

# Xóa toàn bộ
.\run.ps1 clean
```

---

## Bước 8: Tạo dữ liệu khởi tạo (Seed Data)

**File:** `backend/src/main/resources/data.sql`

```sql
-- Tạo sample users
INSERT INTO users (username, email, password, full_name, age_group, role, level, created_at) 
VALUES 
('student1', 'student1@abc.com', '$2a$10$...', 'Student One', 'TEEN', 'STUDENT', 'A1', NOW()),
('teacher1', 'teacher1@abc.com', '$2a$10$...', 'Teacher One', 'ADULT', 'TEACHER', 'C1', NOW()),
('admin1', 'admin1@abc.com', '$2a$10$...', 'Admin One', 'ADULT', 'ADMIN', 'C1', NOW());

-- Tạo sample courses
INSERT INTO courses (title, description, level, instructor, total_lessons, rating, created_at)
VALUES
('English for Beginners', 'Learn basics of English', 'A1', 'Teacher One', 10, 4.5, NOW()),
('Business English', 'Learn business communication', 'B1', 'Teacher One', 15, 4.8, NOW());

-- Tạo sample vocabulary
INSERT INTO vocabulary_words (word, pronunciation, translation, definition, level, category, created_at)
VALUES
('Hello', '/həˈloʊ/', 'Xin chào', 'Used as greeting', 'A1', 'daily', NOW()),
('Book', '/bʊk/', 'Quyển sách', 'A written work', 'A1', 'daily', NOW());
```

---

## Bước 9: Xác nhận hệ thống chạy

### 9.1. Kiểm tra Frontend

```bash
# Truy cập http://localhost:3000
# Hoặc http://localhost (nếu dùng Nginx)

# Kiểm tra:
# - Trang đăng nhập có tải không?
# - Có thể điều hướng không?
```

### 9.2. Kiểm tra Backend

```bash
# Truy cập Swagger API docs
# http://localhost:8080/api/swagger-ui.html

# Hoặc test endpoint:
curl -X GET http://localhost:8080/api/health

# Kiểm tra:
# - API response có bình thường?
# - Database connections OK?
```

### 9.3. Kiểm tra Database

```bash
# Kết nối MySQL
mysql -h localhost -u abc_user -p
# Nhập password: user_password

# Kiểm tra
USE abc_english;
SHOW TABLES;
SELECT COUNT(*) FROM users;
```

---

## Troubleshooting

### Lỗi: "Docker daemon is not running"
```bash
# Windows: Mở Docker Desktop
# macOS: brew services start docker
# Linux: sudo systemctl start docker
```

### Lỗi: "Connection refused: localhost:3306"
```bash
# Kiểm tra MySQL chạy
docker ps | grep mysql

# Nếu chưa chạy, khởi động:
docker-compose up -d mysql
```

### Lỗi: "Port 3000 already in use"
```bash
# Tìm process sử dụng port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000  # macOS/Linux

# Kill process
taskkill /PID <PID> /F  # Windows
kill -9 <PID>  # macOS/Linux
```

### Lỗi: "Groq API key invalid"
```bash
# Cập nhật .env file
echo "GROQ_API_KEY=your_new_key" > .env

# Khởi động lại backend
docker-compose restart backend
```

### Lỗi: "Maven build fails"
```bash
# Xóa cache Maven
mvn clean
rm -rf ~/.m2/repository

# Build lại
mvn clean install
```

---

## Kiến trúc hệ thống

```
abc-english/
├── frontend/              # React app
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/               # Spring Boot app
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/abcenglish/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── docs/                  # Documentation
│   ├── DacTa_HeThong.md
│   ├── ClassDiagram.puml
│   ├── EntityDiagram.puml
│   ├── ActivityDiagram.puml
│   └── SequenceDiagram.puml
├── docker-compose.yml     # Docker configuration
├── nginx.conf             # Nginx configuration
├── run.ps1                # PowerShell script
└── SETUP_GUIDE.md         # This file
```

---

## Production Deployment

### Deploy lên Cloud (AWS/Azure/GCP)

```bash
# 1. Build Docker images
docker build -t abc-english/backend:latest ./backend
docker build -t abc-english/frontend:latest ./frontend

# 2. Push lên Docker Registry
docker tag abc-english/backend:latest your-registry/abc-english/backend:latest
docker push your-registry/abc-english/backend:latest

# 3. Deploy qua Kubernetes/Docker Swarm
kubectl apply -f k8s/deployment.yaml
# hoặc
docker stack deploy -c docker-compose.yml abc-english
```

---

## Tài liệu tham khảo

- **Spring Boot:** https://spring.io/projects/spring-boot
- **React:** https://react.dev/
- **Docker:** https://docs.docker.com/
- **MySQL:** https://dev.mysql.com/doc/
- **Groq API:** https://console.groq.com/docs
- **Swagger:** https://swagger.io/tools/swagger-ui/

---

## Hỗ trợ

Nếu gặp vấn đề:
1. Xem lại logs: `docker-compose logs -f [service]`
2. Kiểm tra các port có bị chiếm không
3. Xác nhận tất cả dependencies đã cài
4. Tham khảo Troubleshooting section ở trên
5. Liên hệ team support hoặc tạo issue trên GitHub

---

**Phiên bản:** v1.0 - May 2026
**Cập nhật lần cuối:** May 3, 2026
