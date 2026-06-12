import asyncHandler from 'express-async-handler';
import Quiz from '../models/Quiz.js';

export const createQuiz = asyncHandler(async (req, res) => {
  const { title, description, category, difficulty, questions } = req.body;

  if (!title || !description || !category || !difficulty || !questions?.length) {
    res.status(400);
    throw new Error('All fields including questions are required');
  }

  const quiz = await Quiz.create({
    title,
    description,
    category,
    difficulty,
    questions,
    creator: req.user._id,
  });

  res.status(201).json(quiz);
});

export const getQuizzes = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const query = {};

  if (search) query.title = { $regex: search, $options: 'i' };
  if (category) query.category = { $regex: category, $options: 'i' };

  const quizzes = await Quiz.find(query)
    .populate('creator', 'name email')
    .sort({ createdAt: -1 });
  res.json(quizzes);
});

export const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('creator', 'name email');
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  res.json(quiz);
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  if (quiz.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this quiz');
  }

  const { title, description, category, difficulty, questions } = req.body;
  quiz.title = title || quiz.title;
  quiz.description = description || quiz.description;
  quiz.category = category || quiz.category;
  quiz.difficulty = difficulty || quiz.difficulty;
  quiz.questions = questions?.length ? questions : quiz.questions;

  const updatedQuiz = await quiz.save();
  res.json(updatedQuiz);
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  if (quiz.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this quiz');
  }
  await quiz.deleteOne();
  res.json({ message: 'Quiz removed' });
});
