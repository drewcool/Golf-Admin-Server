# Golf Backend Setup

## Environment Variables

**IMPORTANT**: See `ENV_SETUP.md` for detailed instructions on setting up your environment variables.

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=mongodb://localhost:27017/golf_club

# Server Configuration
PORT=5000

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_here

# Other configurations as needed
NODE_ENV=development
```

## Database Setup

1. Make sure MongoDB is running on your system
2. The application will automatically create the necessary collections when you first save data

## Running the Backend

1. Install dependencies: `npm install`
2. Start the server: `npm run dev`

The server will run on http://localhost:5000

## API Endpoints

### Hole Management
- `POST /api/golf/saveHoles` - Save holes for a course
- `GET /api/golf/getHoles/:courseId` - Get holes for a course
- `DELETE /api/golf/deleteHoles/:courseId` - Delete holes for a course

### Golf Course Management
- `POST /api/golf/addCourse` - Add a new golf course
- `GET /api/golf/viewCourses` - View all courses
- `GET /api/golf/getCourse/:id` - Get a specific course
- And more...
