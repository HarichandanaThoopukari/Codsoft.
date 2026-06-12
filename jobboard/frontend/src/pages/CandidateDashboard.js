import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import './Dashboard.css';

const CandidateDashboard = () => {
  const { user, updateUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    skills: user?.skills?.join(', ') || '',
    education: user?.education || [],
    experience: user?.experience || []
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/applications/my').then(r => setApplications(r.data.applications || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true); setProfileMsg({ type: '', text: '' });
    try {
      const fd = new FormData();
      fd.append('name', profileForm.name);
      fd.append('phone', profileForm.phone);
      fd.append('skills', JSON.stringify(profileForm.skills.split(',').map(s => s.trim()).filter(Boolean)));
      fd.append('education', JSON.stringify(profileForm.education));
      fd.append('experience', JSON.stringify(profileForm.experience));
      if (resumeFile) fd.append('resume', resumeFile);
      const { data } = await API.put('/users/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data.user);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save' });
    } finally { setSaving(false); }
  };

  const statusColors = { applied: 'primary', reviewing: 'warning', shortlisted: 'success', rejected: 'danger', hired: 'success' };
  const statusIcons = { applied: '📤', reviewing: '👀', shortlisted: '⭐', rejected: '❌', hired: '🎉' };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1>Candidate Dashboard</h1>
          <p>Manage your applications and profile</p>
        </div>
      </div>
      <div className="container dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="candidate-profile-card card">
            <div className="profile-avatar">{user?.name?.charAt(0)}</div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            {user?.resume && <a href={user.resume} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{marginTop:'8px'}}>📄 My Resume</a>}
          </div>
          <nav className="sidebar-nav card">
            <button className={`sidebar-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>📥 Applications ({applications.length})</button>
            <button className={`sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>👤 My Profile</button>
          </nav>
          <div className="sidebar-stats card">
            <div className="dash-stat"><strong>{applications.length}</strong><span>Applied</span></div>
            <div className="dash-stat"><strong>{applications.filter(a => a.status === 'shortlisted' || a.status === 'hired').length}</strong><span>Shortlisted</span></div>
          </div>
        </aside>
        <main className="dashboard-main">
          {activeTab === 'applications' && (
            <div className="dash-section">
              <h2>My Applications</h2>
              {loading ? <div className="loading-spinner"><div className="spinner"></div></div> :
                applications.length > 0 ? applications.map(app => (
                  <div key={app._id} className="applied-job-card card">
                    <div className="ajc-logo">{app.job?.company?.charAt(0) || 'J'}</div>
                    <div className="ajc-info">
                      <h4>{app.job?.title || 'Job'}</h4>
                      <p>{app.job?.company} · {app.job?.location}</p>
                      <p style={{fontSize:'0.78rem',color:'var(--gray-400)'}}>Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                      <span style={{fontSize:'1.2rem'}}>{statusIcons[app.status]}</span>
                      <span className={`badge badge-${statusColors[app.status]}`}>{app.status}</span>
                    </div>
                    {app.job?._id && <Link to={`/jobs/${app.job._id}`} className="btn btn-ghost btn-sm">View Job</Link>}
                  </div>
                )) : (
                  <div className="empty-state-box">
                    <div className="empty-icon">📥</div>
                    <h3>No applications yet</h3>
                    <p>Start applying to jobs that match your skills</p>
                    <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
                  </div>
                )
              }
            </div>
          )}
          {activeTab === 'profile' && (
            <div className="dash-section">
              <h2>My Profile</h2>
              {profileMsg.text && <div className={`alert alert-${profileMsg.type === 'success' ? 'success' : 'error'}`}>{profileMsg.text}</div>}
              <form onSubmit={handleProfileSave} className="profile-form-grid">
                <div className="form-group"><label className="form-label">Full Name</label>
                  <input className="form-control" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Phone</label>
                  <input className="form-control" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} /></div>
                <div className="form-group form-full"><label className="form-label">Skills (comma-separated)</label>
                  <input className="form-control" placeholder="React, Python, SQL..." value={profileForm.skills} onChange={e => setProfileForm({...profileForm, skills: e.target.value})} /></div>
                <div className="form-group form-full"><label className="form-label">Resume (PDF/DOC)</label>
                  <input type="file" className="form-control" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} />
                  {user?.resume && <p style={{fontSize:'0.8rem',color:'var(--success)',marginTop:'4px'}}>✅ Resume uploaded</p>}</div>
                <div className="form-full" style={{display:'flex',justifyContent:'flex-end'}}>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CandidateDashboard;