import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, submitResult } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';

const TakeQuiz = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getQuizById(id)
      .then(({ data }) => {
        setQuiz(data);
        setAnswers(Array(data.questions.length).fill(''));
      })
      .catch(() => setError('Failed to load quiz'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelect = (option) => {
    if (submitted) return;
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      const { data } = await submitResult({ quizId: id, answers });
      navigate(`/result/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-wrapper py-20"><Loader message="Loading quiz..." /></div>;
  if (error) return <div className="page-wrapper py-20 px-4 text-center"><div className="error-msg mx-auto max-w-md">{error}</div></div>;
  if (!quiz) return null;

  const q = quiz.questions[current];
  const progress = ((current + 1) / quiz.questions.length) * 100;
  const answeredCount = answers.filter(Boolean).length;

  return (
    <div className="page-wrapper">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        {/* Quiz header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-white">{quiz.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="badge badge-cat">{quiz.category}</span>
            <span className={`badge ${quiz.difficulty === 'Easy' ? 'badge-easy' : quiz.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'}`}>
              {quiz.difficulty}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-xs text-slate-500">
            <span>Question {current + 1} of {quiz.questions.length}</span>
            <span>{answeredCount} answered</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#2a2a45]">
            <div
              className="progress-bar h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="card mb-4 animate-fade-in" key={current}>
          <p className="text-lg font-semibold text-white leading-relaxed">{q.questionText}</p>

          <div className="mt-6 space-y-3">
            {q.options.map((option, i) => {
              const letter = String.fromCharCode(65 + i);
              const selected = answers[current] === option;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(option)}
                  className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all ${
                    selected
                      ? 'border-brand-500 bg-brand-600/20 text-white'
                      : 'border-[#2a2a45] bg-[#1c1c30] text-slate-300 hover:border-brand-500/40 hover:text-white'
                  }`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                    selected ? 'bg-brand-600 text-white' : 'bg-[#2a2a45] text-slate-400'
                  }`}>
                    {letter}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="btn-secondary py-2.5 text-sm"
          >
            ← Previous
          </button>

          {current < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              className="btn-primary py-2.5 text-sm"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || answeredCount === 0}
              className="btn-primary py-2.5 text-sm bg-emerald-600 hover:bg-emerald-500"
            >
              {submitting ? 'Submitting...' : `Submit Quiz (${answeredCount}/${quiz.questions.length})`}
            </button>
          )}
        </div>

        {/* Question navigator */}
        <div className="mt-6 card">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Jump to question</p>
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all ${
                  i === current
                    ? 'bg-brand-600 text-white ring-2 ring-brand-500/50'
                    : answers[i]
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#1c1c30] text-slate-500 border border-[#2a2a45] hover:border-brand-500/40'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
