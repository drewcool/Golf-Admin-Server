const express = require('express');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleWere/errorMiddlewere');
const app = express();
require('dotenv').config();
const cors = require("cors");
const axios = require('axios');

// Environment-based configuration
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const allowedOrigins = [
  'http://13.234.113.29:5173',
  'http://localhost:5173',
  'http://13.50.244.87',
  'https://13.50.244.87',
  'http://golfserver.appsxperts.live',
  'https://golfserver.appsxperts.live',
  // Add your production domain here
  'http://13.50.244.87:5173',
  'https://13.50.244.87:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Log blocked origins for debugging
    console.log('Blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

//DataBase connection
connectDB();

//body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '50mb' }));

// Static file serving
app.use('/images', express.static('images'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to GOLF club API',
    status: 'running',
    environment: isProduction ? 'production' : 'development',
    timestamp: new Date().toISOString()
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'API is running',
    version: '1.0.0',
    environment: isProduction ? 'production' : 'development',
    timestamp: new Date().toISOString()
  });
});

//Routes
app.use('/api/user', require('./Routes/userRoute'));
app.use('/api/admin', require('./Routes/adminRoute'));
app.use('/api/golf', require('./Routes/GolfCourseRoute'));
app.use('/api/public', require('./Routes/public'));
app.use('/api/game', require('./Routes/game/gameRoundRoute'));
app.use('/api/report', require('./Routes/game/performanceRoute'));
app.use('/api/lession', require('./Routes/lession'));
app.use('/api/practice', require('./Routes/practice'));

// Error handling
app.use(errorHandler);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running at PORT: ${PORT}`);
  console.log(`🌍 Environment: ${isProduction ? 'production' : 'development'}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`📁 Images: http://localhost:${PORT}/images`);
});
