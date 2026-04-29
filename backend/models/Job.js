// models/Job.js — Job listing schema
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  company:      { type: String, required: true, trim: true },
  location:     { type: String, required: true },
  type:         { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], required: true },
  salary:       { type: String, default: 'Competitive' },
  tags:         [String],
  logo:         { type: String, default: 'H' },
  color:        { type: String, default: '#7c6ff7' },
  description:  { type: String, required: true },
  requirements: [String],
  benefits:     [String],
  postedAt:     { type: String, default: 'Just now' },
  isActive:     { type: Boolean, default: true },
  views:        { type: Number, default: 0 },
  applicants:   { type: Number, default: 0 },
}, { timestamps: true });

// Text index for full-text search
JobSchema.index({ title: 'text', company: 'text', tags: 'text' });

module.exports = mongoose.model('Job', JobSchema);
