import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="page-wrapper flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
    <div className="text-center animate-slide-up">
      <div className="font-display text-8xl font-extrabold text-brand-600/30">404</div>
      <h1 className="font-display mt-4 text-3xl font-bold text-white">Page not found</h1>
      <p className="mt-3 text-slate-400">The page you're looking for doesn't exist.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary px-6 py-3">Go home</Link>
        <Link to="/quizzes" className="btn-secondary px-6 py-3">Browse quizzes</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
