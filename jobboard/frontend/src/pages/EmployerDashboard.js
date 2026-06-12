import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import './Dashboard.css';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [showJobForm, setShowJobForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobForm, setJobForm] = useState({
    title: '', company: user?.company?.name || '', description: '', location: '', jobType: 'full-time',
    experienceLevel: 'mid', skills: '', salaryMin: '', salaryMax: '', requirements: '', responsibilities: ''
  });
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get('/jobs/employer');
      setJobs(data.jobs);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchApplications = async (jobId) => {
    try {
      const { data } = await API.get(`/applications/job/${jobId}`);
      setApplications(data.applications);
      setSelectedJob(jobId);
      setActiveTab('applications');
    } catch (e) { console.error(e); }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });
    try {
      const payload = {
        ...jobForm,
        skills: jobForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        requirements: jobForm.requirements.split('\n').filter(Boolean),
        responsibilities: jobForm.responsibilities.split('\n').filter(Boolean),
        salary: { min: Number(jobForm.salaryMin) || 0, max: Number(jobForm.salaryMax) || 0 }
      };
      if (editJob) {
        await API.put(`/jobs/${editJob._id}`, payload);
        setFormMsg({ type: 'success', text: 'Job updated successfully!' });
      } else {
        await API.post('/jobs', payload);
        setFormMsg({ type: 'success', text: 'Job posted successfully!' });
      }
      fetchJobs();
      setTimeout(() => { setShowJobForm(false); setEditJob(null); setFormMsg({ type: '', text: '' }); }, 1500);
    } catch (err) {
      setFormMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save job' });
    }
  };

  const handleEdit = (job) => {
    setEditJob(job);
    setJobForm({
      title: job.title, company: job.company, description: job.description,
      location: job.location, jobType: job.jobType, experienceLevel: job.experienceLevel,
      skills: job.skills?.join(', ') || '',
      salaryMin: job.salary?.min || '', salaryMax: job.salary?.max || '',
      requirements: job.requirements?.join('\n') || '',
      responsibilities: job.responsibilities?.join('\n') || ''
    });
    setShowJobForm(true);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await API.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch (e) { alert('Failed to delete'); }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await API.put(`/applications/${appId}/status`, { status });
      setApplications(apps => apps.map(a => a._id === appId ? { ...a, status } : a));
    } catch (e) { alert('Failed to update status'); }
  };

  const statusColors = { applied: 'primary', reviewing: 'warning', shortlisted: 'success', rejected: 'danger', hired: 'success' };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1>Employer Dashboard</h1>
          <p>Manage your job postings and applications</p>
        </div>
      </div>
      <div className="container dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="employer-profile card">
            <div className="profile-avatar">{user?.name?.charAt(0)}</div>
            <h3>{user?.name}</h3>
            <p>{user?.company?.name || 'Your Company'}</p>
            <Link to="/employer/profile" className="btn btn-outline btn-sm btn-full" style={{marginTop:'12px'}}>Edit Profile</Link>
          </div>
          <nav className="sidebar-nav card">
            <button className={`sidebar-btn ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>📋 My Jobs ({jobs.length})</button>
            <button className={`sidebar-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>📥 Applications</button>
            <button className="sidebar-btn" onClick={() => { setShowJobForm(true); setEditJob(null); setJobForm({ title:'', company: user?.company?.name||'', description:'', location:'', jobType:'full-time', experienceLevel:'mid', skills:'', salaryMin:'', salaryMax:'', requirements:'', responsibilities:'' }); }}>➕ Post New Job</button>
          </nav>
          <div className="sidebar-stats card">
            <div className="dash-stat"><strong>{jobs.length}</strong><span>Active Jobs</span></div>
            <div className="dash-stat"><strong>{jobs.reduce((a, j) => a + (j.applicationsCount || 0), 0)}</strong><span>Total Apps</span></div>
          </div>
        </aside>

        <main className="dashboard-main">
          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="dash-section">
              <div className="dash-section-header">
                <h2>Job Postings</h2>
                <button className="btn btn-primary btn-sm" onClick={() => { setShowJobForm(true); setEditJob(null); }}>+ Post Job</button>
              </div>
              {loading ? <div className="loading-spinner"><div className="spinner"></div></div> :
                jobs.length > 0 ? jobs.map(job => (
                  <div key={job._id} className="job-mgmt-card card">
                    <div className="jmc-info">
                      <h3>{job.title}</h3>
                      <div className="jmc-meta">
                        <span>📍 {job.location}</span>
                        <span className={`badge badge-primary`}>{job.jobType}</span>
                        <span>👥 {job.applicationsCount} applicants</span>
                        <span>👁 {job.views} views</span>
                      </div>
                    </div>
                    <div className="jmc-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => fetchApplications(job._id)}>View Apps</button>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(job)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job._id)}>Delete</button>
                    </div>
                  </div>
                )) : (
                  <div className="empty-state-box">
                    <div className="empty-icon">📋</div>
                    <h3>No jobs posted yet</h3>
                    <button className="btn btn-primary" onClick={() => setShowJobForm(true)}>Post Your First Job</button>
                  </div>
                )
              }
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="dash-section">
              <h2>Applications {selectedJob && `for selected job`}</h2>
              {applications.length > 0 ? applications.map(app => (
                <div key={app._id} className="app-card card">
                  <div className="app-info">
                    <div className="applicant-avatar">{app.candidate?.name?.charAt(0)}</div>
                    <div>
                      <h4>{app.candidate?.name}</h4>
                      <p>{app.candidate?.email}</p>
                      {app.candidate?.skills?.length > 0 && (
                        <div className="app-skills">{app.candidate.skills.slice(0,3).map((s,i) => <span key={i} className="tag">{s}</span>)}</div>
                      )}
                    </div>
                  </div>
                  <div className="app-actions">
                    <span className={`badge badge-${statusColors[app.status]}`}>{app.status}</span>
                    {app.resume && <a href={app.resume} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">📄 Resume</a>}
                    <select className="form-control" style={{width:'auto',padding:'6px 10px',fontSize:'0.82rem'}} value={app.status} onChange={e => handleStatusUpdate(app._id, e.target.value)}>
                      <option value="applied">Applied</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
                  </div>
                </div>
              )) : (
                <div className="empty-state-box">
                  <div className="empty-icon">📥</div>
                  <p>Select a job from the Jobs tab to view its applications.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <div className="modal-overlay" onClick={() => setShowJobForm(false)}>
          <div className="modal-box card job-form-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editJob ? 'Edit Job' : 'Post New Job'}</h2>
              <button className="modal-close" onClick={() => setShowJobForm(false)}>✕</button>
            </div>
            {formMsg.text && <div className={`alert alert-${formMsg.type === 'success' ? 'success' : 'error'}`}>{formMsg.text}</div>}
            <form onSubmit={handleJobSubmit} className="job-form-grid">
              <div className="form-group"><label className="form-label">Job Title *</label>
                <input className="form-control" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Company Name *</label>
                <input className="form-control" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} required /></div>
              <div className="form-group form-full"><label className="form-label">Description *</label>
                <textarea className="form-control" rows="4" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Location *</label>
                <input className="form-control" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Job Type</label>
                <select className="form-control" value={jobForm.jobType} onChange={e => setJobForm({...jobForm, jobType: e.target.value})}>
                  <option value="full-time">Full Time</option><option value="part-time">Part Time</option>
                  <option value="contract">Contract</option><option value="internship">Internship</option><option value="remote">Remote</option>
                </select></div>
              <div className="form-group"><label className="form-label">Experience Level</label>
                <select className="form-control" value={jobForm.experienceLevel} onChange={e => setJobForm({...jobForm, experienceLevel: e.target.value})}>
                  <option value="entry">Entry Level</option><option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option><option value="executive">Executive</option>
                </select></div>
              <div className="form-group"><label className="form-label">Min Salary ($)</label>
                <input type="number" className="form-control" value={jobForm.salaryMin} onChange={e => setJobForm({...jobForm, salaryMin: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Max Salary ($)</label>
                <input type="number" className="form-control" value={jobForm.salaryMax} onChange={e => setJobForm({...jobForm, salaryMax: e.target.value})} /></div>
              <div className="form-group form-full"><label className="form-label">Skills (comma-separated)</label>
                <input className="form-control" placeholder="React, Node.js, MongoDB..." value={jobForm.skills} onChange={e => setJobForm({...jobForm, skills: e.target.value})} /></div>
              <div className="form-group form-full"><label className="form-label">Requirements (one per line)</label>
                <textarea className="form-control" rows="3" placeholder="3+ years experience..." value={jobForm.requirements} onChange={e => setJobForm({...jobForm, requirements: e.target.value})} /></div>
              <div className="form-group form-full"><label className="form-label">Responsibilities (one per line)</label>
                <textarea className="form-control" rows="3" value={jobForm.responsibilities} onChange={e => setJobForm({...jobForm, responsibilities: e.target.value})} /></div>
              <div className="modal-actions form-full">
                <button type="button" className="btn btn-ghost" onClick={() => setShowJobForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-lg">{editJob ? 'Update Job' : 'Post Job'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;