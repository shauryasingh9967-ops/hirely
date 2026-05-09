// routes/jobs.js — CRUD for job listings
const express = require('express');
const Job     = require('../models/Job');
const router  = express.Router();

// ── GET /api/jobs — list with filter + pagination
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({});
    console.log('Jobs count:', jobs.length);
    console.log('Fetched jobs length:', jobs.length);

    res.json({
      jobs,
      total: jobs.length,
      page: 1,
      pages: 1,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    job.views += 1; await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
