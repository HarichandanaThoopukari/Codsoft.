import express from 'express';
import { getAllUsers, getAllQuizzes, deleteUser, deleteQuizAdmin, getStats } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminOnly.js';
const router = express.Router();

router.route('/stats').get(protect, adminOnly, getStats);
router.route('/users').get(protect, adminOnly, getAllUsers);
router.route('/quizzes').get(protect, adminOnly, getAllQuizzes);
router.route('/users/:id').delete(protect, adminOnly, deleteUser);
router.route('/quizzes/:id').delete(protect, adminOnly, deleteQuizAdmin);

export default router;
