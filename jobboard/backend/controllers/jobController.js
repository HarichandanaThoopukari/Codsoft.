const Job = require('../models/Job');
const Application = require('../models/Application');
const sendEmail = require('../utils/sendEmail');

exports.getJobs = async (req, res) => {
  try {
    let query = { isActive: true, status: 'approved' };
    const { search, location, jobType, experienceLevel, salaryMin, salaryMax, category, page = 1, limit = 10 } = req.query;

    if (search) query.$text = { $search: search };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (salaryMin || salaryMax) {
      query['salary.min'] = {};
      if (salaryMin) query['salary.min'].$gte = Number(salaryMin);
      if (salaryMax) query['salary.max'] = { $lte: Number(salaryMax) };
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('employer', 'name company')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, count: jobs.length, total, pages: Math.ceil(total / limit), currentPage: Number(page), jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email company');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    job.views += 1;
    await job.save();
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, employer: req.user._id, status: 'pending' });

    try {
      await sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: `New Job Pending Approval - ${job.title}`,
        html: `
          <h2>New Job Posted - Pending Your Approval</h2>
          <p><strong>Title:</strong> ${job.title}</p>
          <p><strong>Company:</strong> ${job.company}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Type:</strong> ${job.jobType}</p>
          <p><strong>Description:</strong> ${job.description}</p>
          <p><strong>Posted by:</strong> ${req.user.name} (${req.user.email})</p>
          <br/>
          <p>Please login to admin dashboard to approve or reject this job:</p>
          <a href="${process.env.FRONTEND_URL}/admin/dashboard" style="background:#0F4C81;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">Go to Admin Dashboard</a>
        `
      });
    } catch (e) { console.log('Admin email error:', e.message); }

    try {
      await sendEmail({
        email: req.user.email,
        subject: `Job Submitted for Approval - ${job.title}`,
        html: `
          <h2>Your Job is Under Review</h2>
          <p>Hi ${req.user.name},</p>
          <p>Your job posting <strong>${job.title}</strong> has been submitted and is pending admin approval.</p>
          <p>You will receive an email once it is approved and goes live on the website.</p>
        `
      });
    } catch (e) { console.log('Employer email error:', e.message); }

    res.status(201).json({ success: true, job, message: 'Job submitted for approval. Admin will review shortly.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }
    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }
    await job.deleteOne();
    await Application.deleteMany({ job: req.params.id });
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeaturedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true, status: 'approved' })
      .populate('employer', 'name company')
      .sort({ views: -1 })
      .limit(6);
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllJobsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    const jobs = await Job.find(query)
      .populate('employer', 'name email company')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    job.status = req.body.status;
    job.adminNote = req.body.adminNote || '';
    if (req.body.status === 'approved') job.isActive = true;
    if (req.body.status === 'rejected') job.isActive = false;
    await job.save();

    try {
      const isApproved = req.body.status === 'approved';
      await sendEmail({
        email: job.employer.email,
        subject: `Job ${isApproved ? 'Approved' : 'Rejected'} - ${job.title}`,
        html: `
          <h2>Job ${isApproved ? '✅ Approved' : '❌ Rejected'}</h2>
          <p>Hi ${job.employer.name},</p>
          <p>Your job posting <strong>${job.title}</strong> has been <strong>${req.body.status}</strong> by the admin.</p>
          ${req.body.adminNote ? `<p><strong>Admin Note:</strong> ${req.body.adminNote}</p>` : ''}
          ${isApproved ? `<p>Your job is now live on the website!</p><a href="${process.env.FRONTEND_URL}/jobs">View Jobs</a>` : '<p>Please review and repost with necessary changes.</p>'}
        `
      });
    } catch (e) { console.log('Email error:', e.message); }

    res.json({ success: true, job, message: `Job ${req.body.status} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
