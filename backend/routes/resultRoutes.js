import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { submitResult, getResultsByUser, getResultById } from '../controllers/resultController.js';
const router = express.Router();

router.route('/').post(protect, submitResult);
router.route('/user/:id').get(protect, getResultsByUser);
router.route('/:id').get(protect, getResultById);

export default router;
