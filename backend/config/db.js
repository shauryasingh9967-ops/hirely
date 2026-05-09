// config/db.js — MongoDB connection using Mongoose
const mongoose = require('mongoose');
const path     = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not defined. Add a backend/.env file or set the environment variable.');
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
