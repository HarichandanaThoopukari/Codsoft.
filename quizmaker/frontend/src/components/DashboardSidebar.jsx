import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/dashboard', label: 'Overview', icon: '▦' },
  { to: '/create-quiz', label: 'Create Quiz', icon: '+', creatorOnly: true },
  { to: '/quizzes', label: 'Browse Quizzes', icon: '◈' },
];

const DashboardSidebar = () => {
  const { user } = useAuth();

  const visibleLinks = links.filter(link =>
    !link.creatorOnly || user?.role === 'creator' || user?.role === 'admin'
  );

  return (
    <aside className="w-full md:w-60 shrink-0">
      <nav className="card flex flex-col gap-1 p-3">
        {visibleLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 rounded-xl bg-brand-600/20 px-4 py-2.5 text-sm font-semibold text-brand-300'
                : 'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-[#1c1c30] hover:text-white transition-colors'
            }
          >
            <span className="text-base leading-none">{icon}</span>
            {label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 rounded-xl bg-accent-500/20 px-4 py-2.5 text-sm font-semibold text-accent-400'
                : 'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-[#1c1c30] hover:text-white transition-colors'
            }
          >
            <span className="text-base leading-none">⬡</span>
            Admin Panel
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
