const express = require('express');
const router = express.Router();
const appController = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/apply/:jobId', protect, authorize('candidate'), appController.upload.single('resume'), appController.applyJob);
router.get('/my', protect, authorize('candidate'), appController.getCandidateApplications);
router.get('/job/:jobId', protect, authorize('employer'), appController.getJobApplications);
router.put('/:id/status', protect, authorize('employer'), appController.updateApplicationStatus);

module.exports = router;
