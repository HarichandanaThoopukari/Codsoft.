import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'candidate' });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    try {
      const data = await register({ name: form.name, email: form.email, password: form.password, role: form.role });
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
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join the JobBoard community</p>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="role-selector">
            <button type="button" className={`role-btn ${form.role === 'candidate' ? 'active' : ''}`} onClick={() => setForm({ ...form, role: 'candidate' })}>
              <span>👤</span> Job Seeker
            </button>
            <button type="button" className={`role-btn ${form.role === 'employer' ? 'active' : ''}`} onClick={() => setForm({ ...form, role: 'employer' })}>
              <span>🏢</span> Employer
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input name="name" className="form-control" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-control" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input name="confirmPassword" type="password" className="form-control" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
        <div className="auth-visual">
          <div className="auth-visual-content">
            <h3>{form.role === 'employer' ? 'Hire Great Talent' : 'Launch Your Career'}</h3>
            <p>{form.role === 'employer' ? 'Post jobs and reach thousands of qualified candidates instantly.' : 'Create a profile and get noticed by top employers.'}</p>
            <div className="auth-features">
              {form.role === 'employer' ? (
                <>
                  <div className="auth-feature">✅ Post Unlimited Jobs</div>
                  <div className="auth-feature">✅ Manage Applications</div>
                  <div className="auth-feature">✅ Find Top Talent Fast</div>
                </>
              ) : (
                <>
                  <div className="auth-feature">✅ Free Profile Creation</div>
                  <div className="auth-feature">✅ Apply to Any Job</div>
                  <div className="auth-feature">✅ Track Applications</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;