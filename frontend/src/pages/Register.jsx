import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create account</h1>
          <p className="mt-2 text-sm text-slate-400">Join QuizMaker today</p>
        </div>

        <div className="card">
          {error && <div className="error-msg mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required autoFocus />
            </div>
            <div>
              <label className="label">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required minLength={6} />
            </div>
            <div>
              <label className="label">Confirm password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password" required />
            </div>

            <div>
              <label className="label">Account type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: 'user', label: 'Quiz Taker', desc: 'Take quizzes & track scores' },
                  { val: 'creator', label: 'Quiz Creator', desc: 'Create & manage quizzes' },
                ].map(({ val, label, desc }) => (
                  <label
                    key={val}
                    className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-3 transition-all ${
                      form.role === val
                        ? 'border-brand-500 bg-brand-600/10'
                        : 'border-[#2a2a45] bg-[#1c1c30] hover:border-brand-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="role"
                        value={val}
                        checked={form.role === val}
                        onChange={handleChange}
                        className="w-auto accent-brand-500"
                      />
                      <span className="text-sm font-semibold text-white">{label}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 pl-5">{desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
