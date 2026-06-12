import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-brand-400 font-semibold text-sm transition-colors'
      : 'text-slate-400 hover:text-white text-sm font-medium transition-colors';

  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2a45] bg-[#0f0f1a]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-lg group-hover:bg-brand-500 transition-colors">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="font-display text-lg font-bold text-white">QuizMaker</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/quizzes" className={navLinkClass}>Browse</NavLink>
          {user && <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>}
          {user && (user.role === 'creator' || user.role === 'admin') && (
            <NavLink to="/create-quiz" className={navLinkClass}>Create</NavLink>
          )}
          {user && user.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass}>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" />
                Admin
              </span>
            </NavLink>
          )}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-xl border border-[#2a2a45] bg-[#16162a] px-3 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white leading-none">{user.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-brand-400 capitalize leading-none mt-0.5">{user.role}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-secondary py-2 text-xs">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary py-2 text-xs">Sign in</Link>
              <Link to="/register" className="btn-primary py-2 text-xs">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="flex md:hidden flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-5 bg-white transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-[#2a2a45] bg-[#0f0f1a] px-4 py-4 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-3">
            <NavLink to="/quizzes" className={navLinkClass} onClick={() => setMobileOpen(false)}>Browse Quizzes</NavLink>
            {user && <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>Dashboard</NavLink>}
            {user && (user.role === 'creator' || user.role === 'admin') && (
              <NavLink to="/create-quiz" className={navLinkClass} onClick={() => setMobileOpen(false)}>Create Quiz</NavLink>
            )}
            {user && user.role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>Admin Panel</NavLink>
            )}
            <div className="mt-2 flex gap-2 border-t border-[#2a2a45] pt-3">
              {user ? (
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="btn-secondary w-full text-xs py-2">Sign out</button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary flex-1 text-xs py-2 text-center" onClick={() => setMobileOpen(false)}>Sign in</Link>
                  <Link to="/register" className="btn-primary flex-1 text-xs py-2 text-center" onClick={() => setMobileOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
