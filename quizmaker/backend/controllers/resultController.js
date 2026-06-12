import asyncHandler from 'express-async-handler';
import Result from '../models/Result.js';
import Quiz from '../models/Quiz.js';

export const submitResult = asyncHandler(async (req, res) => {
  const { quizId, answers } = req.body;

  if (!quizId || !answers?.length) {
    res.status(400);
    throw new Error('Quiz ID and answers are required');
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  const resultAnswers = quiz.questions.map((question, index) => {
    const selectedAnswer = answers[index] || '';
    return {
      questionText: question.questionText,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect: selectedAnswer === question.correctAnswer,
    };
  });

  const score = resultAnswers.filter((item) => item.isCorrect).length;
  const percentage = Number(((score / quiz.questions.length) * 100).toFixed(1));

  const result = await Result.create({
    user: req.user._id,
    quiz: quiz._id,
    score,
    percentage,
    answers: resultAnswers,
  });

  res.status(201).json(result);
});

export const getResultsByUser = asyncHandler(async (req, res) => {
  const results = await Result.find({ user: req.params.id })
    .populate('quiz', 'title category difficulty')
    .sort({ createdAt: -1 });
  res.json(results);
});

export const getResultById = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id).populate('quiz', 'title category difficulty');
  if (!result) {
    res.status(404);
    throw new Error('Result not found');
  }
  res.json(result);
});
