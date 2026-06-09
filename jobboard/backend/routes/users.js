const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.upload.single('resume'), userController.updateProfile);
router.get('/employers', userController.getEmployers);

module.exports = router;
