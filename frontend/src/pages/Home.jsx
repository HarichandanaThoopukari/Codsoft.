import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const STATS = [
  { value: '5+', label: 'Quiz Categories' },
  { value: '100%', label: 'Free to Use' },
  { value: '∞', label: 'Questions' },
];

const FEATURES = [
  {
    icon: '✦',
    title: 'Create Quizzes',
    desc: 'Build multi-question quizzes with 4 options each. Set difficulty, category, and description.',
  },
  {
    icon: '◈',
    title: 'Take & Score',
    desc: 'Navigate questions with prev/next controls. See instant scoring with detailed answer review.',
  },
  {
    icon: '▦',
    title: 'Track Progress',
    desc: 'Your dashboard shows every quiz you have taken, scores earned, and quizzes created.',
  },
  {
    icon: '⬡',
    title: 'Admin Control',
    desc: 'Admins manage users and quizzes platform-wide with full delete and oversight powers.',
  },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="relative overflow-hidden pb-24 pt-20">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-600/10 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse-slow" />
            Built by HARICHANDANA THOOPUKARI
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
            The quiz platform
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-violet-400 to-accent-400 bg-clip-text text-transparent">
              built for learners
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400 leading-relaxed">
            Create, share, and take quizzes on any topic. Track your performance,
            challenge yourself, and master new subjects.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {user ? (
              <>
                <Link to="/quizzes" className="btn-primary px-7 py-3 text-sm">
                  Browse Quizzes →
                </Link>
                <Link to="/dashboard" className="btn-secondary px-7 py-3 text-sm">
                  My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary px-7 py-3 text-sm">
                  Start for free →
                </Link>
                <Link to="/login" className="btn-secondary px-7 py-3 text-sm">
                  Sign in
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-display text-3xl font-bold text-white">{value}</div>
                <div className="mt-1 text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="section-title">Everything you need</h2>
          <p className="mt-3 text-slate-400">All the tools to build and take quizzes effectively.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="card hover:border-brand-500/40 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/20 text-lg text-brand-300 group-hover:bg-brand-600/30 transition-colors">
                {icon}
              </div>
              <h3 className="font-display font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-600/20 via-violet-600/10 to-[#16162a] p-12 text-center glow-brand">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-50" />
          <div className="relative">
            <h2 className="font-display text-4xl font-bold text-white">Ready to start?</h2>
            <p className="mt-3 text-slate-400">Join and test your knowledge today.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/quizzes" className="btn-primary px-8 py-3">Browse all quizzes →</Link>
              {!user && <Link to="/register" className="btn-secondary px-8 py-3">Create account</Link>}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a45] py-8 text-center">
        <p className="text-sm text-slate-600">
          © 2025 QuizMaker · Built by <span className="text-brand-400 font-medium">HARICHANDANA THOOPUKARI</span>
        </p>
      </footer>
    </div>
  );
};

export default Home;
