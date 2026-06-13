const express = require('express');
const router = express.Router();
const { adminLogin, getDashboardStats, getAllUsers, deleteUser } = require('../controllers/adminController');
const { getAllJobsAdmin, approveJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.post('/login', adminLogin);
router.get('/stats', protect, authorize('admin'), getDashboardStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.get('/jobs', protect, authorize('admin'), getAllJobsAdmin);
router.put('/jobs/:id/approve', protect, authorize('admin'), approveJob);

module.exports = router;
