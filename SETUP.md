# Backend Setup Instructions

## Database Connection Issues

The backend requires both PostgreSQL and MongoDB to be running. Here's how to set them up:

### 1. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Environment Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000

# Database Configuration
# PostgreSQL (for admin functionality)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=maraki_admin

# MongoDB (for student functionality)
MONGO_URI=mongodb://localhost:27017/maraki_students

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email Configuration
RESEND_API_KEY=your-resend-api-key-here
FROM_EMAIL=Maraki <noreply@techsphareet.com>

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 2. Database Setup

#### PostgreSQL Setup
1. Install PostgreSQL
2. Create a database named `maraki_admin`
3. Update the DB_* variables in your .env file

#### MongoDB Setup
1. Install MongoDB
2. Start MongoDB service
3. The database `maraki_students` will be created automatically

### 3. Start the Backend

```bash
npm run start:dev
```

### 4. Verify Setup

Test the health endpoint:
```bash
curl http://localhost:3000/health
```

## Error Handling Improvements

The backend now provides consistent error messages:

- **Network errors**: "Unable to connect to server. Please check your internet connection and try again."
- **Server errors**: "Server error. Please try again later."
- **Not found**: "The requested resource was not found."
- **Unauthorized**: "Session expired. Please log in again."
- **Forbidden**: "Access denied. You do not have permission to perform this action."

## API Endpoints

### Student Content
- `GET /api/student/quizzes` - Get all active quizzes
- `GET /api/student/quizzes/:id` - Get quiz by ID
- `GET /api/student/materials` - Get all active materials
- `GET /api/student/materials/:id` - Get material by ID
- `POST /api/student/quizzes/:id/attempt` - Submit quiz attempt

### Health Check
- `GET /health` - Health check endpoint
