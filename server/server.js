const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Database Connection
connectDB();

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        frameSrc: [
          "'self'",
          'https://www.youtube.com',
          'https://www.youtube-nocookie.com',
          'https://player.vimeo.com',
          'https://fast.wistia.net',
          'https://drive.google.com',
          'https://docs.google.com',
        ],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS Configuration
const clientUrl = process.env.CLIENT_URL;
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, server-to-server, or same-origin)
      if (!origin) return callback(null, true);

      // Check against configured CLIENT_URL, localhost, or any Vercel preview/prod domain
      if (
        (clientUrl && origin === clientUrl) ||
        origin.endsWith('.vercel.app') ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      // Allow request but reflect origin if in development
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsers
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// API Health Check
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AuraLMS Secure API',
    database: {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host || 'disconnected',
      dbName: mongoose.connection.name || 'none',
    },
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/topics', require('./routes/topicRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 Route Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[AuraLMS Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

module.exports = app;
