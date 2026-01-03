# Score Analyser - Full Stack Web Application

A comprehensive test score analysis application built with Node.js, React, and MongoDB. Track your test performance, analyze subject-wise scores, visualize trends, and set goals to improve your performance.

## Features

### Core Features
- ✅ Test-wise score entry with manual input
- ✅ Subject-wise breakdown with marks and weightage
- ✅ Test date tracking
- ✅ Overall performance dashboard with metrics
- ✅ Subject-wise analysis and comparison
- ✅ Interactive visualizations (Line, Bar, Pie, Radar charts)
- ✅ Goal setting and tracking
- ✅ Performance reports and data export
- ✅ Dark/Light mode support

### Analytics & Insights
- Total score summary (absolute, percentage, percentile)
- Progress trends over time
- Best/Worst performance tracking
- Score consistency metrics
- Subject improvement tracking
- Automated insights and recommendations

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **Database**: MongoDB
- **Charts**: Recharts
- **Styling**: CSS with CSS Variables (Dark/Light mode)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

**Note**: This app uses **browser localStorage** for data storage - no MongoDB setup needed! It's much faster for single-user scenarios.

## Storage: Browser LocalStorage (No Setup Required!)

This app uses **browser localStorage** for instant, offline data storage. No database setup needed!

**Why localStorage?**
- ⚡ **25-50x faster** than MongoDB for this use case
- 🚀 **Zero setup** - works immediately
- 📱 **Works offline** - no internet needed
- 🔒 **Privacy** - data stays on your device

See `STORAGE_INFO.md` for detailed information.

---

## Optional: MongoDB Setup (If Needed Later)

If you want to use MongoDB instead (for multi-device sync, etc.):

### Option 1: MongoDB Atlas (Cloud - Recommended for Deployment)

1. **Create a MongoDB Atlas Account**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose the FREE tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter a username and password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your server's IP address
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `score-analyser`)

   Example connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/score-analyser?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB

1. **Install MongoDB**
   - Download from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS
   - Start MongoDB service

2. **Connection String**
   - Default local connection: `mongodb://localhost:27017/score-analyser`

## Installation & Setup

### Quick Start (No Backend Needed!)

Since we're using browser localStorage, you only need to set up the frontend:

### 1. Navigate to Project Directory
```bash
cd GT-Score-Analyser
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Start the Application

```bash
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000

**That's it!** No backend server or database setup needed. Data is stored in your browser.

---

## Optional: Backend Setup (If You Want MongoDB Later)

If you want to use MongoDB instead of localStorage:

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
NODE_ENV=development
```

### 2. Switch to MongoDB

Update `frontend/src/components/*.js` files to import from `../services/api` instead of `../services/storage`.

### 3. Start Backend

```bash
cd backend
npm run dev
```

The backend API will be available at:
- **Backend API**: http://localhost:5000

## Project Structure

```
GT-Score-Analyser/
├── backend/
│   ├── models/
│   │   ├── Test.js
│   │   └── Goal.js
│   ├── routes/
│   │   ├── tests.js
│   │   ├── subjects.js
│   │   └── goals.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── AddTest.js
│   │   │   ├── TestList.js
│   │   │   ├── Goals.js
│   │   │   └── Reports.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Usage

### Adding a Test

1. Navigate to "Add Test" from the navigation bar
2. Enter test date
3. Enter overall test statistics:
   - Total questions (default: 200)
   - Correct questions
   - Incorrect questions
   - Skipped questions
4. Add subjects:
   - Enter subject name
   - Enter subject-wise question breakdown
   - Click "Add Subject"
   - Repeat for all subjects
5. Click "Save Test"

### Viewing Dashboard

- Overall performance metrics
- Score trends over time
- Subject-wise comparisons
- Performance insights and recommendations

### Setting Goals

1. Go to "Goals" page
2. Set overall target score
3. Add subject-wise goals
4. Track progress towards goals

### Exporting Data

1. Go to "Reports" page
2. Click "Export to CSV" to download test and subject data
3. Click "Generate Text Report" for a comprehensive performance report

## Exam Pattern

The application is configured for:
- **Total Marks**: 800
- **Total Questions**: 200 MCQs
- **Scoring**: +4 marks for correct, -1 mark for incorrect, 0 for skipped

You can modify these values in the backend routes if needed.

## API Endpoints

### Tests
- `GET /api/tests` - Get all tests
- `GET /api/tests/:id` - Get single test
- `POST /api/tests` - Create new test
- `PUT /api/tests/:id` - Update test
- `DELETE /api/tests/:id` - Delete test
- `GET /api/tests/analytics/summary` - Get overall analytics
- `GET /api/tests/analytics/subjects` - Get subject-wise analytics

### Goals
- `GET /api/goals` - Get current goals
- `POST /api/goals` - Create/update goals

### Subjects
- `GET /api/subjects` - Get all unique subjects

## Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: Will be set automatically by hosting platform
   - `NODE_ENV`: production

2. Update CORS settings if needed for your frontend domain

### Frontend Deployment (Vercel/Netlify)

1. Set environment variable:
   - `REACT_APP_API_URL`: Your backend API URL

2. Build and deploy:
   ```bash
   npm run build
   ```

## Troubleshooting

### MongoDB Connection Issues
- Verify your connection string is correct
- Check if MongoDB Atlas IP whitelist includes your IP
- Ensure database user credentials are correct
- For local MongoDB, ensure the service is running

### CORS Errors
- Make sure backend CORS is configured to allow your frontend domain
- Check if backend server is running

### Port Already in Use
- Change PORT in backend `.env` file
- Update frontend `REACT_APP_API_URL` if you change backend port

## License

This project is open source and available for personal use.

## Support

For issues or questions, please check the MongoDB setup guide above or review the code comments for implementation details.

