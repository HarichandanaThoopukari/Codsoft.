import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getResultsByUser } from '../services/api.js';
import DashboardSidebar from '../components/DashboardSidebar.jsx';
import Loader from '../components/Loader.jsx';

const ScoreBadge = ({ pct }) => {
  const color = pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-gold-400' : 'text-accent-400';
  return <span className={`font-bold ${color}`}>{pct}%</span>;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResultsByUser(user._id)
      .then(({ data }) => setResults(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user._id]);

  const avgScore = results.length
    ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
    : 0;

  const stats = [
    { label: 'Quizzes Taken', value: results.length, icon: '◈' },
    { label: 'Average Score', value: `${avgScore}%`, icon: '▦' },
    { label: 'Best Score', value: results.length ? `${Math.max(...results.map(r => r.percentage))}%` : '—', icon: '✦' },
  ];

  return (
    <div className="page-wrapper">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white">
            Welcome, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-slate-400 capitalize">{user.role} account · {user.email}</p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <DashboardSidebar />

          <main className="flex-1 space-y-6 min-w-0">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map(({ label, value, icon }) => (
                <div key={label} className="card flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600/20 text-xl text-brand-300">
                    {icon}
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-white">{value}</div>
                    <div className="text-xs text-slate-500">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="card">
              <h2 className="mb-4 font-semibold text-white">Quick actions</h2>
              <div className="flex flex-wrap gap-3">
                <Link to="/quizzes" className="btn-primary text-xs py-2">Browse quizzes</Link>
                {(user.role === 'creator' || user.role === 'admin') && (
                  <Link to="/create-quiz" className="btn-secondary text-xs py-2">Create a quiz</Link>
                )}
              </div>
            </div>

            {/* Recent results */}
            <div className="card">
              <h2 className="mb-4 font-semibold text-white">Recent quiz results</h2>
              {loading ? (
                <Loader message="Loading results..." />
              ) : results.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-3 text-4xl">📝</div>
                  <p className="text-slate-400">No quizzes taken yet.</p>
                  <Link to="/quizzes" className="btn-primary mt-4 text-xs py-2">Take your first quiz →</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.slice(0, 8).map((result) => (
                    <Link
                      key={result._id}
                      to={`/result/${result._id}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[#2a2a45] bg-[#1c1c30] px-4 py-3 hover:border-brand-500/40 transition-all"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white text-sm">{result.quiz?.title || 'Unknown Quiz'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{result.quiz?.category} · {result.quiz?.difficulty}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <ScoreBadge pct={result.percentage} />
                        <p className="text-xs text-slate-500">{result.score} / {result.answers.length}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
