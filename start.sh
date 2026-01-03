#!/bin/bash

echo "🚀 Starting Score Analyser Application..."
echo ""

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env file not found!"
    echo "📝 Please create backend/.env with the following content:"
    echo ""
    echo "PORT=5000"
    echo "MONGODB_URI=your_mongodb_connection_string_here"
    echo "NODE_ENV=development"
    echo ""
    echo "See MONGODB_SETUP.md for detailed instructions."
    echo ""
    read -p "Press Enter to continue anyway..."
fi

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "Starting servers..."
echo "Backend will run on http://localhost:5000"
echo "Frontend will run on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
cd ../frontend && npm start &
FRONTEND_PID=$!

# Wait for user interrupt
wait $BACKEND_PID $FRONTEND_PID

