import { Link } from 'react-router-dom';

const difficultyClass = {
  Easy: 'badge-easy',
  Medium: 'badge-medium',
  Hard: 'badge-hard',
};

const QuizCard = ({ quiz }) => (
  <div className="card group flex flex-col gap-4 hover:border-brand-500/40 hover:-translate-y-0.5 transition-all duration-300">
    <div className="flex flex-wrap gap-2">
      <span className="badge badge-cat">{quiz.category}</span>
      <span className={`badge ${difficultyClass[quiz.difficulty] || 'badge-medium'}`}>{quiz.difficulty}</span>
      <span className="badge bg-slate-700/50 text-slate-400">{quiz.questions.length} questions</span>
    </div>

    <div className="flex-1">
      <h3 className="font-display text-lg font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-2">
        {quiz.title}
      </h3>
      <p className="mt-1.5 text-sm text-slate-400 line-clamp-2">{quiz.description}</p>
    </div>

    <div className="flex items-center justify-between gap-3 border-t border-[#2a2a45] pt-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600/30 text-xs font-bold text-brand-300">
          {(quiz.creator?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <span className="text-xs text-slate-500 truncate max-w-[120px]">
          {quiz.creator?.name || 'Unknown'}
        </span>
      </div>
      <Link
        to={`/quiz/${quiz._id}`}
        className="btn-primary py-2 text-xs"
      >
        Take Quiz →
      </Link>
    </div>
  </div>
);

export default QuizCard;
