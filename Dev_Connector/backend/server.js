// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import route modules
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const followRoutes = require('./routes/followRoutes');
const githubRoutes = require('./routes/githubRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Core Middlewares
app.use(cors());
app.use(express.json());

// Base health route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Dev_Connector API is running...'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Set Port and Start Server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle server errors (e.g. port already in use by AirPlay on macOS)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[Dev_Connector Error] Port ${PORT} is already in use!`);
    console.error(`- On macOS, AirPlay Receiver often uses port 5000.`);
    console.error(`- Fix: Change PORT in backend/.env (e.g. PORT=5001) OR disable AirPlay Receiver in System Settings -> General -> AirDrop & AirPlay.\n`);
  } else {
    console.error('Server error:', err.message);
  }
  process.exit(1);
});

