// routes/applications.js
const express     = require('express');
const Application = require('../models/Application');
const SavedJob    = require('../models/SavedJob');
const Job         = require('../models/Job');
const { protect } = require('../middleware/auth');
const router      = express.Router();

// ── POST /api/apply — apply to a job
router.post('/apply', protect, async (req, res) => {
  try {
    const { jobId } = req.body;
    const existing  = await Application.findOne({ user: req.user._id, job: jobId });
    if (existing) return res.status(400).json({ message: 'Already applied' });

    const app = await Application.create({ user: req.user._id, job: jobId });
    await Job.findByIdAndUpdate(jobId, { $inc: { applicants: 1 } });
    res.status(201).json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/applications — get user's applications
router.get('/applications', protect, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user._id }).populate('job');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/save — toggle save job
router.post('/save', protect, async (req, res) => {
  try {
    const { jobId } = req.body;
    const existing  = await SavedJob.findOne({ user: req.user._id, job: jobId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ saved: false });
    }
    await SavedJob.create({ user: req.user._id, job: jobId });
    res.status(201).json({ saved: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/saved — get saved jobs
router.get('/saved', protect, async (req, res) => {
  try {
    const saved = await SavedJob.find({ user: req.user._id }).populate('job');
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
