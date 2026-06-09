import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(form.email, form.password);
      if (data.user.role === 'employer') navigate('/employer/dashboard');
      else navigate('/candidate/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card card">
          <div className="auth-logo">💼 Job<span>Board</span></div>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-control" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="auth-footer">Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
        <div className="auth-visual">
          <div className="auth-visual-content">
            <h3>Find Your Next Opportunity</h3>
            <p>Join thousands of professionals landing their dream jobs every day.</p>
            <div className="auth-features">
              <div className="auth-feature">✅ 50,000+ Active Jobs</div>
              <div className="auth-feature">✅ Top Companies Hiring</div>
              <div className="auth-feature">✅ Apply with One Click</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;