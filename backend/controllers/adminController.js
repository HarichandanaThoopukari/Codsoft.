import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import Result from '../models/Result.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  const quizCounts = await Quiz.aggregate([
    { $group: { _id: '$creator', count: { $sum: 1 } } },
  ]);

  const countByUser = quizCounts.reduce((acc, item) => ({
    ...acc,
    [item._id.toString()]: item.count,
  }), {});

  const usersWithCounts = users.map((user) => ({
    ...user.toObject(),
    quizCount: countByUser[user._id.toString()] || 0,
  }));

  res.json(usersWithCounts);
});

export const getAllQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find()
    .populate('creator', 'name email')
    .sort({ createdAt: -1 });
  res.json(quizzes);
});

export const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalQuizzes, totalResults] = await Promise.all([
    User.countDocuments(),
    Quiz.countDocuments(),
    Result.countDocuments(),
  ]);
  res.json({ totalUsers, totalQuizzes, totalResults });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.json({ message: 'User removed' });
});

export const deleteQuizAdmin = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  await quiz.deleteOne();
  res.json({ message: 'Quiz removed by admin' });
});
