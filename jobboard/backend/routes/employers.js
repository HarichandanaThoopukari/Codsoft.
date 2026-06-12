const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');

// @desc Get all employers (public)
router.get('/', async (req, res) => {
  try {
    const employers = await User.find({ role: 'employer', isActive: true })
      .select('name companyName companyLogo industry companySize location createdAt')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, employers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc Get employer profile with jobs
router.get('/:id', async (req, res) => {
  try {
    const employer = await User.findOne({ _id: req.params.id, role: 'employer' })
      .select('-password');
    if (!employer) return res.status(404).json({ success: false, message: 'Employer not found' });
    const jobs = await Job.find({ employer: req.params.id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, employer, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
