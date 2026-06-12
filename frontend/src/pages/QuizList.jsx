import { useEffect, useState } from 'react';
import { getQuizzes } from '../services/api.js';
import QuizCard from '../components/QuizCard.jsx';
import Loader from '../components/Loader.jsx';

const CATEGORIES = ['All', 'Programming', 'Computer Science', 'Web', 'Engineering', 'Science', 'Math'];

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [error, setError] = useState('');

  const fetchQuizzes = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      const { data } = await getQuizzes(params);
      setQuizzes(data);
    } catch {
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuizzes(); }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchQuizzes();
  };

  return (
    <div className="page-wrapper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title">Browse Quizzes</h1>
          <p className="mt-2 text-slate-400">Find and take quizzes on any topic</p>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes..."
              className="flex-1"
            />
            <button type="submit" className="btn-primary px-5 py-3 shrink-0">Search</button>
          </form>
          <button
            onClick={() => { setSearch(''); setCategory('All'); }}
            className="btn-secondary px-4 py-3 text-xs shrink-0"
          >
            Clear
          </button>
        </div>

        {/* Category chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-brand-600 text-white'
                  : 'border border-[#2a2a45] bg-[#16162a] text-slate-400 hover:border-brand-500/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <Loader message="Loading quizzes..." />
        ) : error ? (
          <div className="error-msg">{error}</div>
        ) : quizzes.length === 0 ? (
          <div className="card py-16 text-center">
            <div className="mx-auto mb-3 text-5xl">🔍</div>
            <p className="text-lg font-semibold text-white">No quizzes found</p>
            <p className="mt-2 text-slate-400">Try a different search or category.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-500">{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} found</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => <QuizCard key={quiz._id} quiz={quiz} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizList;
