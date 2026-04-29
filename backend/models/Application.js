// models/Application.js — Job application schema
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job:     { type: mongoose.Schema.Types.ObjectId, ref: 'Job',  required: true },
  status:  { type: String, enum: ['applied', 'reviewed', 'shortlisted', 'rejected'], default: 'applied' },
  message: { type: String, default: '' }, // Optional cover note
}, { timestamps: true });

// Prevent duplicate applications
ApplicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
