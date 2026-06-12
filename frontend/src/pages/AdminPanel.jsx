import { useEffect, useState } from 'react';
import {
  getAdminStats, getAdminUsers, getAdminQuizzes,
  deleteUserAdmin, deleteQuizAdmin
} from '../services/api.js';
import Loader from '../components/Loader.jsx';

const StatCard = ({ icon, label, value, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${color}`}>
      {icon}
    </div>
    <div>
      <div className="font-display text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  </div>
);

const AdminPanel = () => {
  const [tab, setTab] = useState('users');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([getAdminStats(), getAdminUsers(), getAdminQuizzes()])
      .then(([s, u, q]) => {
        setStats(s.data);
        setUsers(u.data);
        setQuizzes(q.data);
      })
      .catch(() => setError('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await deleteUserAdmin(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch { alert('Failed to delete user'); }
  };

  const handleDeleteQuiz = async (id, title) => {
    if (!confirm(`Delete quiz "${title}"? This cannot be undone.`)) return;
    try {
      await deleteQuizAdmin(id);
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch { alert('Failed to delete quiz'); }
  };

  const roleBadge = (role) => {
    const map = { admin: 'bg-accent-500/20 text-accent-400', creator: 'bg-brand-500/20 text-brand-300', user: 'bg-slate-700/50 text-slate-400' };
    return map[role] || map.user;
  };

  if (loading) return <div className="page-wrapper py-20"><Loader message="Loading admin data..." /></div>;

  return (
    <div className="page-wrapper">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/20">
            <span className="text-accent-400">⬡</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-slate-400">Platform management</p>
          </div>
        </div>

        {error && <div className="error-msg mb-6">{error}</div>}

        {/* Stats */}
        {stats && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard icon="👥" label="Total Users" value={stats.totalUsers} color="bg-brand-600/20 text-brand-300" />
            <StatCard icon="◈" label="Total Quizzes" value={stats.totalQuizzes} color="bg-violet-600/20 text-violet-300" />
            <StatCard icon="▦" label="Total Attempts" value={stats.totalResults} color="bg-emerald-600/20 text-emerald-300" />
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {['users', 'quizzes'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold capitalize transition-all ${
                tab === t ? 'bg-brand-600 text-white' : 'border border-[#2a2a45] bg-[#16162a] text-slate-400 hover:text-white'
              }`}
            >
              {t} ({t === 'users' ? users.length : quizzes.length})
            </button>
          ))}
        </div>

        {/* Users Table */}
        {tab === 'users' && (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a45] bg-[#1c1c30]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Quizzes</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Joined</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a45]">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-[#1c1c30] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600/30 text-sm font-bold text-brand-300">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white">{u.name}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${roleBadge(u.role)}`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{u.quizCount || 0}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            className="rounded-lg bg-accent-500/10 px-3 py-1.5 text-xs font-medium text-accent-400 hover:bg-accent-500/20 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quizzes Table */}
        {tab === 'quizzes' && (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a45] bg-[#1c1c30]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Quiz</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Difficulty</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Creator</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a45]">
                  {quizzes.map((q) => (
                    <tr key={q._id} className="hover:bg-[#1c1c30] transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{q.title}</p>
                        <p className="text-xs text-slate-500">{q.questions.length} questions</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge badge-cat">{q.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${q.difficulty === 'Easy' ? 'badge-easy' : q.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'}`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{q.creator?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteQuiz(q._id, q.title)}
                          className="rounded-lg bg-accent-500/10 px-3 py-1.5 text-xs font-medium text-accent-400 hover:bg-accent-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
