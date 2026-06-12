const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, `resume_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`)
});

exports.upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' && ext !== '.doc' && ext !== '.docx') return cb(new Error('Only PDF/DOC files allowed'));
    cb(null, true);
  }
});

exports.applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('employer');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const existing = await Application.findOne({ job: req.params.jobId, candidate: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already applied to this job' });

    const resumePath = req.file ? `/uploads/resumes/${req.file.filename}` : req.user.resume;
    const application = await Application.create({
      job: req.params.jobId,
      candidate: req.user._id,
      coverLetter: req.body.coverLetter,
      resume: resumePath
    });

    job.applicationsCount += 1;
    await job.save();

    // Email to candidate
    try {
      await sendEmail({
        email: req.user.email,
        subject: `Application Submitted - ${job.title}`,
        html: `<h2>Application Received!</h2><p>Hi ${req.user.name},</p><p>Your application for <strong>${job.title}</strong> at <strong>${job.company}</strong> has been submitted successfully.</p><p>We'll notify you of any updates.</p>`
      });
      // Email to employer
      if (job.employer && job.employer.email) {
        await sendEmail({
          email: job.employer.email,
          subject: `New Application for ${job.title}`,
          html: `<h2>New Application Received</h2><p>A new candidate <strong>${req.user.name}</strong> has applied for <strong>${job.title}</strong>.</p>`
        });
      }
    } catch (e) { console.log('Email error:', e.message); }

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate({ path: 'job', populate: { path: 'employer', select: 'name company' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email phone skills resume')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job').populate('candidate', 'email name');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    const job = await Job.findById(application.job._id);
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = req.body.status;
    application.notes = req.body.notes || application.notes;
    await application.save();

    try {
      await sendEmail({
        email: application.candidate.email,
        subject: `Application Update - ${application.job.title}`,
        html: `<h2>Application Status Update</h2><p>Hi ${application.candidate.name},</p><p>Your application for <strong>${application.job.title}</strong> has been updated to: <strong style="text-transform:capitalize">${application.status}</strong>.</p>`
      });
    } catch (e) { console.log('Email error:', e.message); }

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
