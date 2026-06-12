import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/jobs/JobCard';
import API from '../utils/api';
import './JobsPage.css';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    salaryMin: '',
    salaryMax: '',
    category: searchParams.get('category') || ''
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ ...filters, page, limit: 12 });
      Object.keys(filters).forEach(k => !filters[k] && params.delete(k));
      const { data } = await API.get(`/jobs?${params}`);
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val }));
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const clearFilters = () => {
    setFilters({ search: '', location: '', jobType: '', experienceLevel: '', salaryMin: '', salaryMax: '', category: '' });
    setPage(1);
  };

  return (
    <div className="jobs-page">
      <div className="page-header">
        <div className="container">
          <h1>Browse Jobs</h1>
          <p>{total} opportunities available</p>
        </div>
      </div>
      <div className="container jobs-layout">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filters-card card">
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear All</button>
            </div>
            <form onSubmit={handleSearch}>
              <div className="form-group">
                <label className="form-label">Keyword</label>
                <input className="form-control" placeholder="Job title or keyword..." value={filters.search} onChange={e => handleFilter('search', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-control" placeholder="City, state, or remote" value={filters.location} onChange={e => handleFilter('location', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select className="form-control" value={filters.jobType} onChange={e => handleFilter('jobType', e.target.value)}>
                  <option value="">All Types</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Experience</label>
                <select className="form-control" value={filters.experienceLevel} onChange={e => handleFilter('experienceLevel', e.target.value)}>
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Min Salary ($)</label>
                <input type="number" className="form-control" placeholder="e.g. 50000" value={filters.salaryMin} onChange={e => handleFilter('salaryMin', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Salary ($)</label>
                <input type="number" className="form-control" placeholder="e.g. 120000" value={filters.salaryMax} onChange={e => handleFilter('salaryMax', e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary btn-full">Apply Filters</button>
            </form>
          </div>
        </aside>

        {/* Jobs List */}
        <main className="jobs-main">
          {loading ? (
            <div className="loading-spinner"><div className="spinner"></div></div>
          ) : jobs.length > 0 ? (
            <>
              <div className="jobs-count">{total} jobs found</div>
              <div className="jobs-list">
                {jobs.map(job => <JobCard key={job._id} job={job} />)}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state-box">
              <div className="empty-icon">🔍</div>
              <h3>No jobs found</h3>
              <p>Try adjusting your search filters</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobsPage;