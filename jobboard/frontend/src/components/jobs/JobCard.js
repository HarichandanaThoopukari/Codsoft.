import React from 'react';
import { Link } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job }) => {
  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Not disclosed';
    const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(0)}k` : n;
    if (salary.min && salary.max) return `$${fmt(salary.min)} - $${fmt(salary.max)}`;
    if (salary.min) return `From $${fmt(salary.min)}`;
    return `Up to $${fmt(salary.max)}`;
  };

  const timeAgo = (date) => {
    const days = Math.floor((Date.now() - new Date(date)) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days/7)}w ago`;
    return `${Math.floor(days/30)}mo ago`;
  };

  const typeColors = { 'full-time':'primary', 'part-time':'warning', 'contract':'accent', 'internship':'success', 'remote':'success' };

  return (
    <div className="job-card card fade-in">
      <div className="job-card-header">
        <div className="job-company-logo">{job.company?.charAt(0) || 'J'}</div>
        <div className="job-meta-top">
          <span className={`badge badge-${typeColors[job.jobType] || 'gray'}`}>{job.jobType}</span>
          <span className="job-date">{timeAgo(job.createdAt)}</span>
        </div>
      </div>
      <div className="job-card-body">
        <h3 className="job-title">{job.title}</h3>
        <p className="job-company">{job.company}</p>
        <div className="job-details">
          <span className="job-detail">📍 {job.location}</span>
          <span className="job-detail">💰 {formatSalary(job.salary)}</span>
          <span className="job-detail">🎯 {job.experienceLevel}</span>
        </div>
        {job.skills?.length > 0 && (
          <div className="job-skills">
            {job.skills.slice(0, 3).map((s, i) => <span key={i} className="tag">{s}</span>)}
            {job.skills.length > 3 && <span className="tag">+{job.skills.length - 3}</span>}
          </div>
        )}
      </div>
      <div className="job-card-footer">
        <span className="applications-count">{job.applicationsCount || 0} applicants</span>
        <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">View Job</Link>
      </div>
    </div>
  );
};

export default JobCard;