AKILIHUB SMS is a modern, scalable School Management System (SMS) designed to digitize and automate school operations while providing a centralized learning environment for administrators, teachers, students, parents, and finance departments. The platform is built using modern web technologies and follows enterprise software architecture principles to ensure scalability, security, maintainability, and high performance.

The long-term vision of AKILIHUB SMS is to evolve from a traditional School ERP into a complete **Education Operating System (EdOS)** by integrating academic management, digital learning, artificial intelligence, analytics, communication, and financial management into a single platform.



# AkiliHub SMS Backend API

A production-grade, scalable backend system for managing school operations including student enrollment, attendance, grades, fees, and user management. Designed to handle **5000+ users** with **2000+ concurrent users** without performance degradation.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [Performance](#performance)
- [Database](#database)
- [Scaling](#scaling)

## Features

✅ **High Concurrency Support**
- Connection pooling (100 connections, 200 queue limit)
- Non-blocking async/await architecture
- Graceful handling of 2000+ concurrent users

✅ **Security**
- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Request validation and sanitization
- Rate limiting (5 req/min sensitive, 100 req/15min general)

✅ **Reliability**
- Global error handling
- Structured logging with file output
- Health checks and metrics endpoints
- Graceful shutdown

✅ **Data Management**
- Comprehensive audit logging
- User profiles and permissions
- Student enrollment and attendance
- Grade management
- Fee tracking
- Teacher and parent management

✅ **Performance**
- Compression middleware (level 6)
- CORS caching (24-hour Max-Age)
- Database query optimization
- Connection keep-alive enabled
- Redis-ready caching layer

## Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.x
- **Language**: TypeScript
- **Database**: MySQL 8.0+
- **Cache** (optional): Redis
- **Authentication**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **Validation**: express-validator
- **Logging**: Custom logger with file output
- **HTTP**: Helmet, CORS, Compression

## System Requirements

### Minimum
- Node.js 16+
- MySQL 8.0+
- 1GB RAM
- 100MB disk space

### Recommended
- Node.js 18+
- MySQL 8.0+
- 4GB RAM
- 1GB disk space
- Redis 6+ (for scaling)

## Installation

### 1. Clone and Setup

```bash
cd akilihub-sms/backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=akilihub_sms
JWT_SECRET=your_secret_key
```

### 3. Initialize Database

```bash
mysql -u root -p < ../schema.sql
```

## Configuration

All configuration is managed via environment variables in `.env`:

### Server
- `NODE_ENV`: development | production
- `PORT`: Server port (default: 5000)
- `LOG_LEVEL`: error | warn | info | debug

### Database
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `DB_CONNECTION_LIMIT`: Max connections (100 for 2000+ users)
- `DB_QUEUE_LIMIT`: Request queue limit (200)

### Authentication
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRY`: Token expiration time (e.g., "24h")
- `REFRESH_TOKEN_EXPIRY`: Refresh token TTL (e.g., "7d")

### Rate Limiting
- `RATE_LIMIT_MAX_REQUESTS`: General endpoint limit (100 per 15min)
- `RATE_LIMIT_SENSITIVE_MAX`: Sensitive endpoint limit (5 per minute)

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### With Docker
```bash
docker build -t akilihub-api .
docker run -p 5000:5000 --env-file .env akilihub-api
```

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - Login and get JWT token
- `POST /refresh-token` - Refresh expired token
- `POST /logout` - Logout user
- `POST /change-password` - Change user password
- `GET /me` - Get current user profile

### Users (`/api/v1/users`)
- `GET /` - Get all users (Admin only)
- `GET /:id` - Get user by ID
- `GET /role/:role` - Get users by role
- `PUT /:id` - Update user profile
- `DELETE /:id` - Delete user (Admin only)
- `GET /stats` - User statistics

### Students (`/api/v1/students`)
- `POST /` - Create student
- `GET /` - Get all students (paginated)
- `GET /:id` - Get student details
- `GET /grade/:gradeLevel` - Get students by grade
- `PUT /:id` - Update student
- `GET /stats` - Student statistics

### Attendance (`/api/v1/attendance`)
- `POST /` - Record attendance
- `POST /bulk` - Bulk record attendance
- `GET /student/:studentId` - Get student attendance
- `GET /class/:classId/date/:date` - Get class attendance
- `GET /stats/student/:studentId` - Attendance statistics
- `PUT /:id` - Update attendance record

### Grades (`/api/v1/grades`)
- `POST /` - Record grade
- `GET /student/:studentId` - Get student grades
- `GET /course/:courseId` - Get course grades
- `PUT /:id` - Update grade
- `DELETE /:id` - Delete grade

### Courses (`/api/v1/courses`)
- `POST /` - Create course
- `GET /` - Get all courses (paginated)
- `GET /:id` - Get course details
- `PUT /:id` - Update course
- `DELETE /:id` - Delete course

### Classrooms (`/api/v1/classrooms`)
- `POST /` - Create classroom
- `GET /` - Get all classrooms
- `GET /:id` - Get classroom details
- `PUT /:id` - Update classroom
- `DELETE /:id` - Delete classroom

### Teachers (`/api/v1/teachers`)
- `POST /` - Create teacher record
- `GET /` - Get all teachers
- `GET /:id` - Get teacher details
- `PUT /:id` - Update teacher
- `DELETE /:id` - Delete teacher

### Parents (`/api/v1/parents`)
- `POST /` - Create parent record
- `GET /` - Get all parents
- `GET /:id` - Get parent details
- `GET /student/:studentId` - Get student parents
- `PUT /:id` - Update parent
- `DELETE /:id` - Delete parent

### Fees (`/api/v1/fees`)
- `POST /` - Record fee payment
- `GET /student/:studentId` - Get student fees
- `GET /stats` - Fee statistics
- `PUT /:id` - Update fee record
- `DELETE /:id` - Delete fee record

### Credentials (`/api/v1/credentials`)
- `POST /generate` - Generate user credentials
- `GET /:userId` - Get user credentials
- `PUT /:id/password` - Reset password
- `DELETE /:id` - Delete credentials

### Audit Logs (`/api/v1/audit-logs`)
- `GET /` - Get all audit logs (Admin only)
- `GET /user/:userId` - Get user audit logs
- `GET /entity/:entityType/:entityId` - Get entity audit logs
- `GET /stats` - Audit log statistics

### System
- `GET /health` - Health check
- `GET /metrics` - Server metrics (memory, uptime)

## Architecture

### Request Pipeline
```
Incoming Request
    ↓
[Helmet] - Security headers
    ↓
[CORS] - Cross-origin requests (cached)
    ↓
[Compression] - Gzip compression (level 6)
    ↓
[JSON Parser] - Parse request body
    ↓
[Logger] - Log request details
    ↓
[Rate Limit] - Per-IP rate limiting
    ↓
[Auth] - Verify JWT token
    ↓
[Route Handler] - Process request
    ↓
[Error Handler] - Global error handling
    ↓
Response to Client
```

### Directory Structure
```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # MySQL pool setup
│   │   └── config.ts    # Environment variables
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # JWT & RBAC
│   │   ├── error.ts     # Error handling
│   │   ├── logger.ts    # Request logging
│   │   └── rateLimit.ts # Rate limiting
│   ├── routes/          # API route handlers
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── studentRoutes.ts
│   │   └── ...
│   ├── services/        # Business logic layer
│   │   ├── UserService.ts
│   │   ├── StudentService.ts
│   │   └── ...
│   ├── utils/           # Utility functions
│   │   └── helpers.ts
│   └── server.ts        # Express app setup
├── schema.sql           # Database schema
├── .env.example         # Environment template
└── package.json
```

## Performance

### Concurrency Handling
- **Connection Pool**: 100 connections + 200 queue = 300 concurrent DB operations
- **Keep-Alive**: Enabled to reduce connection overhead
- **Timeout**: 10s connection, 60s idle timeout

### Request Processing
- **Compression**: Gzip level 6 (balance between speed & size)
- **CORS Caching**: 24-hour Max-Age to reduce preflight requests
- **Rate Limiting**: Per-IP tracking with automatic cleanup

### Database
- **Query Optimization**: Indexes on frequently queried columns
- **Connection Pooling**: Efficient connection reuse
- **Prepared Statements**: SQL injection prevention

## Database

### Schema
The database includes tables for:
- `users` - User accounts and authentication
- `students` - Student enrollment information
- `teachers` - Teacher records
- `parents` - Parent/guardian information
- `classrooms` - Class management
- `courses` - Course definitions
- `attendance` - Attendance tracking
- `grades` - Grade records
- `fees` - Fee transactions
- `audit_logs` - Audit trail

### Initial Setup
```bash
mysql -u root -p akilihub_sms < schema.sql
```

## Scaling

### For 2000+ Concurrent Users

**Current Setup (In-Memory)**
- ✅ Supports up to 2000 concurrent users
- Connection pooling handles database concurrency
- In-memory rate limiting for request throttling

**Redis Integration (Future)**
For distributed scaling across multiple servers:

```typescript
// Add Redis connection in config.ts
const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
});

// Update rate limiting to use Redis
// Update session storage to use Redis
// Add caching layer with Redis
```

### Horizontal Scaling
1. Deploy multiple backend instances
2. Add load balancer (Nginx, HAProxy)
3. Use Redis for shared rate limiting & caching
4. Use MySQL read replicas for scaling reads

### Monitoring & Metrics
- Health check endpoint: `GET /health`
- Metrics endpoint: `GET /metrics` (memory, uptime)
- Structured logging with file output
- Performance monitoring via middleware

## Development

### Scripts
```bash
npm run dev           # Start dev server with auto-reload
npm run build         # Build TypeScript
npm start             # Run production build
npm run lint          # Run ESLint
npm run format        # Format with Prettier
npm run test          # Run tests
```

### Debug Mode
```bash
DEBUG=* npm run dev
```

## Error Handling

All errors are handled through a global error handler:

```typescript
// APIError class
throw new APIError(400, "Invalid request");

// Async wrapper to catch all errors
router.post("/", asyncHandler(async (req, res) => {
  // If error thrown, caught and formatted automatically
}));
```

## Security

- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ JWT token-based authentication
- ✅ Role-based access control
- ✅ Request validation with express-validator
- ✅ Rate limiting to prevent abuse
- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ SQL injection prevention

## Support

For issues or questions:
1. Check logs in `./logs/` directory
2. Review API documentation above
3. Check `.env.example` for configuration options
4. Test endpoints with curl or Postman

## License

All rights reserved © 2026 AkiliHub
