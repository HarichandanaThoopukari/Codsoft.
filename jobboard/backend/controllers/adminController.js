const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const generateToken = require('../utils/generateToken');

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    let admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email,
        password,
        role: 'admin'
      });
    }

    const token = generateToken(admin._id);
    res.json({
      success: true,
      token,
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const totalJobs = await Job.countDocuments();
    const pendingJobs = await Job.countDocuments({ status: 'pending' });
    const approvedJobs = await Job.countDocuments({ status: 'approved' });
    const rejectedJobs = await Job.countDocuments({ status: 'rejected' });
    const totalApplications = await Application.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers, totalCandidates, totalEmployers,
        totalJobs, pendingJobs, approvedJobs, rejectedJobs,
        totalApplications
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
