const User = require('../models/User');
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

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, skills, education, experience, company } = req.body;
    const updateData = { name, phone };

    if (req.user.role === 'candidate') {
      if (skills) updateData.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
      if (education) updateData.education = typeof education === 'string' ? JSON.parse(education) : education;
      if (experience) updateData.experience = typeof experience === 'string' ? JSON.parse(experience) : experience;
      if (req.file) updateData.resume = `/uploads/resumes/${req.file.filename}`;
    } else if (req.user.role === 'employer') {
      if (company) updateData.company = typeof company === 'string' ? JSON.parse(company) : company;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEmployers = async (req, res) => {
  try {
    const employers = await User.find({ role: 'employer', isActive: true }).select('name company createdAt');
    res.json({ success: true, employers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
