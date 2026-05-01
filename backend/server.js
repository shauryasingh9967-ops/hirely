// server.js — Main Express entry point
require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect MongoDB
connectDB();

// ✅ CORS — allow localhost + Vercel
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL, // Vercel URL — set in Render environment variables
].filter(Boolean); // remove undefined

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api',      require('./routes/applications'));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Hirely API is running!',
    env: process.env.NODE_ENV,
    time: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
});
