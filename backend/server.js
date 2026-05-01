// server.js — Main Express entry point
require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect MongoDB
connectDB();


// ✅ CORS FIX (FINAL)
const allowedOrigins = [
  'http://localhost:3000',
  'https://hirely-green.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));


// Middlewares
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
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});