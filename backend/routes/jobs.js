// routes/jobs.js — CRUD for job listings
const express = require('express');
const Job     = require('../models/Job');
const router  = express.Router();

// ── GET /api/jobs — list with filter + pagination
router.get('/', async (req, res) => {
  try {
    const { q, location, type, page = 1, limit = 6 } = req.query;
    const filter = { isActive: true };

    if (q && q.trim()) {
      filter.$or = [
        { title:   { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { tags:    { $elemMatch: { $regex: q, $options: 'i' } } },
      ];
    }
    if (location && location !== 'All Locations') filter.location = location;
    if (type     && type     !== 'All Types')      filter.type     = type;

    const total = await Job.countDocuments(filter);
    const jobs  = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.json({ jobs, total, page: +page, pages: Math.ceil(total / +limit) });
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
