import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/jobs/JobCard';
import API from '../utils/api';
import './HomePage.css';

const CATEGORIES = [
  { icon: '💻', name: 'Technology', count: '1.2k+' },
  { icon: '🎨', name: 'Design', count: '800+' },
  { icon: '📊', name: 'Marketing', count: '650+' },
  { icon: '💼', name: 'Finance', count: '900+' },
  { icon: '🏥', name: 'Healthcare', count: '750+' },
  { icon: '📚', name: 'Education', count: '400+' },
  { icon: '⚙️', name: 'Engineering', count: '1.1k+' },
  { icon: '📦', name: 'Sales', count: '550+' },
];

const HomePage = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/jobs/featured').then(r => setFeaturedJobs(r.data.jobs || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge">🚀 Over 10,000 jobs available</div>
          <h1 className="hero-title">
            Find Your Dream<br/>
            <span className="hero-highlight">Career Today</span>
          </h1>
          <p className="hero-subtitle">Connect with top companies. Discover opportunities that match your skills and ambitions.</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-field">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Job title, keyword, company..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="search-divider"></div>
            <div className="search-field">
              <span className="search-icon">📍</span>
              <input type="text" placeholder="Location..." value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-accent btn-lg search-submit">Search Jobs</button>
          </form>
          <div className="hero-stats">
            <div className="stat"><strong>50k+</strong><span>Jobs Posted</span></div>
            <div className="stat-divider"></div>
            <div className="stat"><strong>12k+</strong><span>Companies</span></div>
            <div className="stat-divider"></div>
            <div className="stat"><strong>8M+</strong><span>Candidates</span></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Categories</h2>
            <p>Explore jobs in your field of expertise</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="category-card card" onClick={() => navigate(`/jobs?category=${cat.name}`)}>
                <span className="cat-icon">{cat.icon}</span>
                <h4>{cat.name}</h4>
                <span className="cat-count">{cat.count} jobs</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header-row">
            <div className="section-header">
              <h2>Featured Jobs</h2>
              <p>Hand-picked opportunities from top companies</p>
            </div>
            <a href="/jobs" className="btn btn-outline">View All Jobs →</a>
          </div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner"></div></div>
          ) : featuredJobs.length > 0 ? (
            <div className="jobs-grid">
              {featuredJobs.map(job => <JobCard key={job._id} job={job} />)}
            </div>
          ) : (
            <div className="empty-state">
              <p>No jobs available yet. <a href="/register">Be the first to post!</a></p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-grid">
            <div className="cta-card cta-candidate">
              <span className="cta-emoji">🎯</span>
              <h3>Looking for Work?</h3>
              <p>Create your profile and let employers find you. Upload your resume and apply with one click.</p>
              <a href="/register" className="btn btn-primary btn-lg">Get Started Free</a>
            </div>
            <div className="cta-card cta-employer">
              <span className="cta-emoji">🏢</span>
              <h3>Hiring Talent?</h3>
              <p>Post jobs and reach thousands of qualified candidates. Find your perfect hire today.</p>
              <a href="/register" className="btn btn-accent btn-lg">Post a Job</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;