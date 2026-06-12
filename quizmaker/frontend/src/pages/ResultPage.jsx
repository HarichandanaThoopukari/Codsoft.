import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResultById } from '../services/api.js';
import Loader from '../components/Loader.jsx';

const ResultPage = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    getResultById(id)
      .then(({ data }) => setResult(data))
      .catch(() => setError('Failed to load result'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-wrapper py-20"><Loader message="Loading result..." /></div>;
  if (error) return <div className="page-wrapper py-20 px-4"><div className="error-msg mx-auto max-w-md">{error}</div></div>;
  if (!result) return null;

  const { percentage, score, answers, quiz } = result;
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const wrong = total - correct;

  const grade =
    percentage >= 90 ? { label: 'Excellent!', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' } :
    percentage >= 70 ? { label: 'Good job!', color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/30' } :
    percentage >= 50 ? { label: 'Keep going!', color: 'text-gold-400', bg: 'bg-gold-500/10 border-gold-500/30' } :
    { label: 'Keep practicing!', color: 'text-accent-400', bg: 'bg-accent-500/10 border-accent-500/30' };

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="page-wrapper">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        {/* Score Card */}
        <div className={`card border text-center mb-6 ${grade.bg} animate-slide-up`}>
          <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            {quiz?.title}
          </div>

          {/* Circular progress */}
          <div className="relative mx-auto my-6 h-32 w-32">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#2a2a45" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke={percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#f43f5e'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-display text-3xl font-bold ${grade.color}`}>{percentage}%</span>
            </div>
          </div>

          <h1 className={`font-display text-2xl font-bold ${grade.color}`}>{grade.label}</h1>
          <p className="mt-1 text-slate-400">
            You scored <span className="font-bold text-white">{score}</span> out of{' '}
            <span className="font-bold text-white">{total}</span>
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
              <div className="font-display text-2xl font-bold text-emerald-400">{correct}</div>
              <div className="text-xs text-slate-500 mt-0.5">Correct</div>
            </div>
            <div className="rounded-xl bg-accent-500/10 border border-accent-500/20 p-4">
              <div className="font-display text-2xl font-bold text-accent-400">{wrong}</div>
              <div className="text-xs text-slate-500 mt-0.5">Wrong</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link to={`/quiz/${result.quiz?._id}`} className="btn-primary flex-1 py-3 text-center">
            Retry Quiz
          </Link>
          <button
            onClick={() => setShowReview(!showReview)}
            className="btn-secondary flex-1 py-3"
          >
            {showReview ? 'Hide Review' : 'Review Answers'}
          </button>
          <Link to="/quizzes" className="btn-secondary flex-1 py-3 text-center">
            More Quizzes
          </Link>
        </div>

        {/* Answer Review */}
        {showReview && (
          <div className="space-y-4 animate-slide-up">
            <h2 className="font-display text-xl font-bold text-white">Answer Review</h2>
            {answers.map((answer, i) => (
              <div
                key={i}
                className={`card border ${answer.isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-accent-500/30 bg-accent-500/5'}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${answer.isCorrect ? 'bg-emerald-500 text-white' : 'bg-accent-500 text-white'}`}>
                    {answer.isCorrect ? '✓' : '✗'}
                  </span>
                  <p className="font-medium text-white text-sm leading-relaxed">{answer.questionText}</p>
                </div>
                <div className="ml-9 space-y-1 text-sm">
                  {!answer.isCorrect && (
                    <p className="text-accent-400">
                      Your answer: <span className="font-medium">{answer.selectedAnswer || 'Not answered'}</span>
                    </p>
                  )}
                  <p className="text-emerald-400">
                    Correct answer: <span className="font-medium">{answer.correctAnswer}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
