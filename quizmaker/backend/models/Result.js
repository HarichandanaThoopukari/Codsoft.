import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    selectedAnswer: { type: String, default: '' },
    correctAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    answers: { type: [answerSchema], required: true },
  },
  { timestamps: true }
);

const Result = mongoose.model('Result', resultSchema);
export default Result;
