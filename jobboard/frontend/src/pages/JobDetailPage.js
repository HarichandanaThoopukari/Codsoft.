import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import './JobDetailPage.css';

const JobDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [appSuccess, setAppSuccess] = useState('');
  const [appError, setAppError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    API.get(`/jobs/${id}`).then(r => setJob(r.data.job)).catch(() => navigate('/jobs')).finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'candidate') {
      API.get('/applications/my').then(r => {
        const applied = r.data.applications.some(a => a.job?._id === id);
        setAlreadyApplied(applied);
      }).catch(() => {});
    }
  }, [id, isAuthenticated, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true); setAppError('');
    try {
      const fd = new FormData();
      fd.append('coverLetter', coverLetter);
      if (resumeFile) fd.append('resume', resumeFile);
      await API.post(`/applications/apply/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setAppSuccess('Application submitted successfully! Check your email for confirmation.');
      setAlreadyApplied(true);
      setTimeout(() => setShowModal(false), 3000);
    } catch (err) {
      setAppError(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Not disclosed';
    const fmt = n => n >= 1000 ? `$${(n/1000).toFixed(0)}k` : `$${n}`;
    if (salary.min && salary.max) return `${fmt(salary.min)} - ${fmt(salary.max)} / year`;
    if (salary.min) return `From ${fmt(salary.min)} / year`;
    return `Up to ${fmt(salary.max)} / year`;
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!job) return <div className="container" style={{padding: '60px 0', textAlign:'center'}}>Job not found</div>;

  return (
    <div className="job-detail-page">
      <div className="container">
        <div className="breadcrumb"><Link to="/jobs">Jobs</Link> › {job.title}</div>
        <div className="job-detail-layout">
          <main className="job-detail-main">
            <div className="job-detail-header card">
              <div className="jd-company-logo">{job.company?.charAt(0)}</div>
              <div className="jd-title-area">
                <h1>{job.title}</h1>
                <p className="jd-company">{job.company}</p>
                <div className="jd-meta">
                  <span>📍 {job.location}</span>
                  <span>💰 {formatSalary(job.salary)}</span>
                  <span>⏱ {job.jobType}</span>
                  <span>🎯 {job.experienceLevel} level</span>
                </div>
              </div>
              <div className="jd-apply-area">
                {isAuthenticated && user?.role === 'candidate' ? (
                  alreadyApplied ? (
                    <div className="already-applied">✅ Applied</div>
                  ) : (
                    <button className="btn btn-accent btn-lg" onClick={() => setShowModal(true)}>Apply Now</button>
                  )
                ) : !isAuthenticated ? (
                  <Link to="/login" className="btn btn-primary btn-lg">Login to Apply</Link>
                ) : null}
                <p className="jd-views">{job.views} views · {job.applicationsCount} applicants</p>
              </div>
            </div>

            <div className="jd-section card">
              <h2>Job Description</h2>
              <p>{job.description}</p>
            </div>

            {job.responsibilities?.length > 0 && (
              <div className="jd-section card">
                <h2>Responsibilities</h2>
                <ul>{job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>
            )}

            {job.requirements?.length > 0 && (
              <div className="jd-section card">
                <h2>Requirements</h2>
                <ul>{job.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>
            )}

            {job.skills?.length > 0 && (
              <div className="jd-section card">
                <h2>Required Skills</h2>
                <div className="skills-list">{job.skills.map((s, i) => <span key={i} className="tag">{s}</span>)}</div>
              </div>
            )}
          </main>

          <aside className="job-detail-aside">
            <div className="job-summary card">
              <h3>Job Overview</h3>
              <div className="summary-items">
                <div className="summary-item"><span className="si-label">Posted</span><span>{new Date(job.createdAt).toLocaleDateString()}</span></div>
                <div className="summary-item"><span className="si-label">Job Type</span><span className={`badge badge-primary`}>{job.jobType}</span></div>
                <div className="summary-item"><span className="si-label">Experience</span><span>{job.experienceLevel}</span></div>
                <div className="summary-item"><span className="si-label">Salary</span><span>{formatSalary(job.salary)}</span></div>
                {job.deadline && <div className="summary-item"><span className="si-label">Deadline</span><span>{new Date(job.deadline).toLocaleDateString()}</span></div>}
              </div>
            </div>
            {job.employer?.company && (
              <div className="company-card card">
                <h3>About the Company</h3>
                <h4>{job.employer.company.name || job.company}</h4>
                {job.employer.company.description && <p>{job.employer.company.description}</p>}
                {job.employer.company.industry && <div className="summary-item"><span className="si-label">Industry</span><span>{job.employer.company.industry}</span></div>}
                {job.employer.company.size && <div className="summary-item"><span className="si-label">Company Size</span><span>{job.employer.company.size}</span></div>}
                {job.employer.company.website && <a href={job.employer.company.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-full" style={{marginTop:'12px'}}>Visit Website</a>}
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for {job.title}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {appSuccess ? (
              <div className="alert alert-success">{appSuccess}</div>
            ) : (
              <form onSubmit={handleApply}>
                {appError && <div className="alert alert-error">{appError}</div>}
                <div className="form-group">
                  <label className="form-label">Cover Letter</label>
                  <textarea className="form-control" rows="5" placeholder="Tell the employer why you're the perfect fit..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Resume (PDF/DOC) — Optional if already uploaded</label>
                  <input type="file" className="form-control" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-accent btn-lg" disabled={applying}>{applying ? 'Submitting...' : 'Submit Application'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;