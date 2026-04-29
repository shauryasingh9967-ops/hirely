// server.js — Main Express entry point
require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const connectDB    = require('./config/db');

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/jobs',         require('./routes/jobs'));
app.use('/api',              require('./routes/applications'));

// Health check
app.get('/', (req, res) => res.json({ message: '🚀 Hirely API is running!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ██╗  ██╗██╗██████╗ ███████╗██╗  ██╗   ██╗
  ██║  ██║██║██╔══██╗██╔════╝██║  ╚██╗ ██╔╝
  ███████║██║██████╔╝█████╗  ██║   ╚████╔╝
  ██╔══██║██║██╔══██╗██╔══╝  ██║    ╚██╔╝
  ██║  ██║██║██║  ██║███████╗███████╗██║
  ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝

  🚀 Server running on http://localhost:${PORT}
  📦 MongoDB: Connecting...
  `);
});
